"""Shared news engine regressions: fixed clocks, fake clients, no network."""

from __future__ import annotations

import copy
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from news_core import APIError
from news_digest import run_news_digest


NOW = datetime(2026, 10, 29, 3, 0, tzinfo=timezone.utc)
DOMAIN = "news.example.com"


def lanes(count=2):
    return [
        {"id": f"lane_{number}", "label": f"Source {number}",
         "query": f"Japan news lane {number}", "domains": [DOMAIN]}
        for number in range(count)
    ]


def row(path="/article/shared", **values):
    return {"title": "News evidence", "url": "https://" + DOMAIN + path, **values}


class FakeClient:
    def __init__(self, handler):
        self.handler = handler
        self.calls = []
        self.requests = []

    def call(self, operation, parameters):
        payload = copy.deepcopy(parameters)
        self.calls.append((operation, payload))
        self.requests.append({"operation": operation, "status": "ok"})
        return self.handler(operation, payload)


class EngineRegressions(unittest.TestCase):
    def setUp(self):
        guard = patch(
            "urllib.request.OpenerDirector.open",
            side_effect=AssertionError("Regression tests must not access the network"),
        )
        guard.start()
        self.addCleanup(guard.stop)

    def run_engine(self, client, parameters=None, source_lanes=None):
        return run_news_digest(
            "offline-engine-regression", {}, parameters or {}, source_lanes or lanes(),
            client=client, now=NOW,
        )

    def test_duplicate_url_upgrades_date_excerpt_and_all_lane_coverage(self):
        def handler(_, parameters):
            if parameters["query"].endswith("lane 0"):
                return {"results": [row()]}
            return {"results": [row(
                published_date=(NOW - timedelta(hours=1)).isoformat(),
                content="A later search returned a publicly available excerpt.",
            )]}

        result = self.run_engine(FakeClient(handler))
        self.assertEqual(result["count"], 1)
        item = result["items"][0]
        self.assertEqual(set(item["lane_ids"]), {"lane_0", "lane_1"})
        self.assertIsNotNone(item["published_at"])
        self.assertTrue(item["time_window_verified"])
        self.assertEqual(item["content_basis"], "excerpt")
        self.assertIn("publicly available excerpt", item["excerpt"])
        self.assertEqual(result["status"], "ok")
        for coverage in result["coverage"]:
            self.assertEqual(coverage["matched"], 1)
            self.assertEqual(coverage["returned"], 1)
            self.assertEqual(coverage["undated"], 0)
            self.assertEqual(coverage["status"], "ok")

    def test_absolute_stale_and_future_brave_page_ages_are_rejected(self):
        def handler(operation, _):
            if operation == "tavily_search":
                return {"results": []}
            self.assertEqual(operation, "brave_news")
            return {"results": [
                row("/article/stale", page_age=(NOW - timedelta(days=2)).isoformat()),
                row("/article/future", page_age=(NOW + timedelta(hours=1)).isoformat()),
                row("/article/current", page_age=(NOW - timedelta(hours=1)).isoformat()),
            ]}

        result = self.run_engine(
            FakeClient(handler), {"fallback_provider": "brave"}, lanes(1),
        )
        self.assertEqual(result["count"], 1)
        self.assertTrue(result["items"][0]["url"].endswith("/article/current"))
        self.assertEqual(result["items"][0]["date_role"], "published_or_updated")
        self.assertFalse(result["items"][0]["time_window_verified"])

    def test_account_failure_after_success_stops_later_searches_and_extraction(self):
        for error_type in ("authentication", "payment", "permission", "rate_limit"):
            with self.subTest(error_type=error_type):
                def handler(operation, parameters):
                    self.assertEqual(operation, "tavily_search")
                    if parameters["query"].endswith("lane 0"):
                        return {"results": [row(published_date=NOW.isoformat())]}
                    raise APIError(error_type, "Stop this account's requests")

                client = FakeClient(handler)
                result = self.run_engine(
                    client, {"extract_content": True, "fallback_provider": "brave"},
                    lanes(4),
                )
                self.assertEqual(len(client.calls), 2)
                self.assertTrue(all(operation == "tavily_search" for operation, _ in client.calls))
                self.assertEqual(result["count"], 1)
                self.assertEqual(result["status"], "partial")
                self.assertEqual(len(result["coverage"]), 4)
                for coverage in result["coverage"][1:]:
                    self.assertEqual(coverage["status"], "error")
                    self.assertEqual(coverage["errors"][0]["type"], error_type)

    def test_mixed_empty_and_failed_lanes_do_not_claim_a_complete_empty_search(self):
        def handler(_, parameters):
            if parameters["query"].endswith("lane 0"):
                return {"results": []}
            raise APIError("network", "The source search could not complete")

        result = self.run_engine(FakeClient(handler))
        self.assertEqual(result["count"], 0)
        self.assertEqual(result["status"], "partial")
        self.assertEqual([entry["status"] for entry in result["coverage"]], ["empty", "error"])
        self.assertTrue(result["warnings"])

    def test_retrieval_failure_is_explained_in_the_human_readable_report(self):
        def handler(*_):
            raise APIError("upstream", "The news service is unavailable")

        result = self.run_engine(FakeClient(handler), source_lanes=lanes(1))
        self.assertEqual(result["status"], "error")
        self.assertTrue(any(
            any(marker in warning.lower() for marker in ("upstream", "failed", "error", "unavailable", "失敗", "エラー"))
            for warning in result["warnings"]
        ), result["warnings"])
        self.assertTrue(any(warning in result["text"] for warning in result["warnings"]))
        self.assertIn("Source 0", result["text"])


if __name__ == "__main__":
    unittest.main()
