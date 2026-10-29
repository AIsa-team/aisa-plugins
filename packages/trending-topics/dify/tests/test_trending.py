"""Offline contract and fanout checks; no real data requests."""

from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from news_core import APIError, InputError
from trending import normalize_posts, normalize_topics, normalize_videos, run_trending

NOW = datetime(2026, 10, 29, 6, 0, tzinfo=timezone.utc)
KEY = {"aisa_api_key": "offline-test-key"}


class FakeClient:
    def __init__(self, *, fail=None, topics=30, failure_type="upstream"):
        self.requests = []
        self.calls = []
        self.fail = fail
        self.topic_count = topics
        self.failure_type = failure_type

    def call(self, operation, payload):
        self.calls.append((operation, payload))
        self.requests.append({"operation": operation, "status": "ok", "request_id": "offline", "cost_micros_usd": None})
        if operation == self.fail:
            self.requests[-1]["status"] = "error"
            raise APIError(self.failure_type, "Controlled offline failure")
        if operation == "twitter_trends":
            return {"trends": [{"trend": {"name": f"話題 {i}", "rank": i + 1, "target": {"query": f"話題 {i}"}}} for i in range(self.topic_count)]}
        if operation == "twitter_search":
            return {"tweets": [{"id": str(i), "url": f"https://x.com/example/status/{i}", "text": f"日本語の投稿 {i}", "createdAt": "2026-10-29T05:30:00Z", "lang": "ja"} for i in range(10)]}
        if operation == "youtube_search":
            return {"videos": [{"id": str(i), "link": f"https://www.youtube.com/watch?v=video{i}", "title": f"関連動画 {i}", "published_time": "2 hours ago", "views": 100} for i in range(10)]}
        raise AssertionError(operation)


class TrendingTests(unittest.TestCase):
    def test_preview_is_credential_and_network_free(self):
        result = run_trending({"preview_only": True}, {}, now=NOW)
        self.assertEqual(result["status"], "preview")
        self.assertEqual(len(result["request_plan"]), 7)
        self.assertEqual(result["requests"], [])
        self.assertEqual(result["items"], [])

    def test_flat_and_nested_trend_contracts_with_missing_volume(self):
        for row in ({"name": "テスト", "rank": 2}, {"trend": {"name": "テスト", "rank": 2}}):
            topic = normalize_topics({"trends": [row]}, 10, "retrieved")[0]
            self.assertEqual(topic["name"], "テスト")
            self.assertEqual(topic["rank"], 2)
            self.assertIsNone(topic["metrics"]["post_volume"])
            self.assertIsNone(topic["published_at"])

    def test_defaults_bound_fanout_and_retained_evidence(self):
        client = FakeClient()
        result = run_trending({}, KEY, client=client, now=NOW)
        self.assertEqual(len(client.calls), 7)
        self.assertEqual(result["count"], 10)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(sum(bool(t["posts"]) for t in result["topics"]), 3)
        self.assertEqual(len(result["topics"][0]["posts"]), 3)
        self.assertEqual(len(result["topics"][0]["videos"]), 2)
        self.assertIs(result["items"], result["topics"])
        youtube = next(payload for op, payload in client.calls if op == "youtube_search")
        self.assertEqual((youtube["engine"], youtube["gl"], youtube["hl"]), ("youtube", "jp", "ja"))

    def test_no_enrichment_makes_one_request(self):
        client = FakeClient()
        result = run_trending({"enrich_top_n": 0}, KEY, client=client, now=NOW)
        self.assertEqual(len(client.calls), 1)
        self.assertEqual(result["coverage"]["maximum_requests"], 1)

    def test_post_window_does_not_invent_time_or_accept_other_languages(self):
        rows = [
            {"url": "https://x.com/a/status/1", "text": "old", "lang": "ja", "createdAt": "2026-10-28T01:00:00Z"},
            {"url": "https://x.com/a/status/2", "text": "future", "lang": "ja", "createdAt": "2026-10-30T01:00:00Z"},
            {"url": "https://x.com/a/status/3", "text": "English", "lang": "en", "createdAt": "2026-10-29T05:00:00Z"},
            {"url": "https://x.com/a/status/4", "text": "日時不明", "lang": "ja"},
            {"url": "https://x.com.evil.test/status/5", "text": "bad URL", "lang": "ja"},
        ]
        posts, unknown, outside = normalize_posts({"tweets": rows}, NOW - timedelta(hours=6), NOW, "retrieved")
        self.assertEqual(len(posts), 1)
        self.assertEqual((unknown, outside), (1, 2))
        self.assertIsNone(posts[0]["published_at"])
        self.assertIsNone(posts[0]["within_window"])

    def test_video_relative_time_and_unparseable_metrics_remain_nullable(self):
        videos = normalize_videos({"videos": [{"title": "動画", "link": "https://youtube.com/watch?v=abc", "published_time": "2 hours ago", "views": "2K"}]}, "retrieved")
        self.assertIsNone(videos[0]["published_at"])
        self.assertEqual(videos[0]["published_time_text"], "2 hours ago")
        self.assertIsNone(videos[0]["metrics"]["views"])
        self.assertEqual(videos[0]["relationship"], "related_search_result")

    def test_source_failure_returns_partial_without_retries(self):
        client = FakeClient(fail="youtube_search")
        result = run_trending({"limit": 1}, KEY, client=client, now=NOW)
        self.assertEqual(result["status"], "partial")
        self.assertEqual(len(client.calls), 3)
        self.assertEqual(len(result["items"][0]["posts"]), 3)
        self.assertEqual(result["items"][0]["videos"], [])
        self.assertEqual(result["coverage"]["sources"][-1]["status"], "error")

    def test_ranking_failure_stops_fanout(self):
        client = FakeClient(fail="twitter_trends")
        result = run_trending({}, KEY, client=client, now=NOW)
        self.assertEqual(result["status"], "error")
        self.assertFalse(result["ok"])
        self.assertEqual(len(client.calls), 1)
        self.assertEqual(result["error"]["type"], "upstream")

    def test_first_enrichment_account_failure_stops_all_remaining_calls_and_keeps_topics(self):
        for error_type in ("authentication", "payment", "permission", "rate_limit"):
            with self.subTest(error_type=error_type):
                client = FakeClient(fail="twitter_search", failure_type=error_type)
                result = run_trending({}, KEY, client=client, now=NOW)
                self.assertEqual([operation for operation, _ in client.calls],
                                 ["twitter_trends", "twitter_search"])
                self.assertEqual(len(result["requests"]), 2)
                self.assertEqual(result["status"], "partial")
                self.assertTrue(result["ok"])
                self.assertEqual(result["count"], 10)
                self.assertEqual(result["topics"][0]["name"], "話題 0")
                self.assertEqual(result["topics"][0]["rank"], 1)
                self.assertEqual(result["coverage"]["errors"][0]["type"], error_type)
                self.assertEqual(len(result["coverage"]["errors"]), 1)
                self.assertEqual(result["coverage"]["skipped_requests"], 5)
                sources = result["coverage"]["sources"]
                self.assertEqual([source["status"] for source in sources],
                                 ["success", "error", "skipped", "skipped", "skipped", "skipped", "skipped"])
                for topic in result["topics"][:3]:
                    self.assertEqual(topic["enrichment_status"], "partial")
                    self.assertEqual(topic["posts"], [])
                    self.assertEqual(topic["videos"], [])
                self.assertTrue(any("not attempted" in warning for warning in result["warnings"]))

    def test_video_account_failure_keeps_preceding_post_evidence_and_skips_later_topics(self):
        client = FakeClient(fail="youtube_search", failure_type="payment")
        result = run_trending({}, KEY, client=client, now=NOW)
        self.assertEqual([operation for operation, _ in client.calls],
                         ["twitter_trends", "twitter_search", "youtube_search"])
        self.assertEqual(result["status"], "partial")
        self.assertEqual(len(result["topics"][0]["posts"]), 3)
        self.assertEqual(result["topics"][0]["videos"], [])
        self.assertEqual(result["topics"][1]["enrichment_status"], "partial")
        self.assertEqual(result["coverage"]["skipped_requests"], 4)

    def test_rank_sort_happens_before_limit(self):
        topics = normalize_topics({"trends": [{"name": "順位なし"}, {"name": "三位", "rank": 3}, {"name": "一位", "rank": 1}]}, 1, "retrieved")
        self.assertEqual(topics[0]["name"], "一位")

    def test_missing_arrays_are_schema_errors_not_empty_success(self):
        class ChangedClient:
            def call(self, operation, payload):
                return {"changed_response_shape": []}
        result = run_trending({}, KEY, client=ChangedClient(), now=NOW)
        self.assertEqual(result["status"], "error")
        self.assertEqual(result["error"]["type"], "schema")
        self.assertEqual(result["requests"], [])

    def test_missing_search_arrays_are_partial(self):
        class ChangedClient(FakeClient):
            def call(self, operation, payload):
                raw = super().call(operation, payload)
                return raw if operation == "twitter_trends" else {"changed": []}
        result = run_trending({"limit": 1}, KEY, client=ChangedClient(), now=NOW)
        self.assertEqual(result["status"], "partial")
        self.assertEqual(len(result["coverage"]["errors"]), 2)

    def test_invalid_parameters_fail_before_requests(self):
        for params in ({"limit": 21}, {"enrich_top_n": 4}, {"lookback_hours": 0}, {"include_videos": "maybe"}):
            client = FakeClient()
            with self.assertRaises(InputError):
                run_trending(params, KEY, client=client, now=NOW)
            self.assertEqual(client.calls, [])

    def test_markdown_is_deterministic_and_preserves_source_urls(self):
        a = run_trending({"limit": 1}, KEY, client=FakeClient(), now=NOW)
        b = run_trending({"limit": 1}, KEY, client=FakeClient(), now=NOW)
        self.assertEqual(a["text"], b["text"])
        self.assertIn("https://x.com/example/status/0", a["text"])
        self.assertIn("関連動画", a["text"])


if __name__ == "__main__":
    unittest.main()
