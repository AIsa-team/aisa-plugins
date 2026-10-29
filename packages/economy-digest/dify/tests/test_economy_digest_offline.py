from __future__ import annotations

import copy
import importlib
from datetime import datetime, timezone
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from news_core import APIError, InputError
from news_digest import run_news_digest

NOW = datetime(2026, 10, 29, 3, 0, tzinfo=timezone.utc)
FRESH = "2026-10-29T02:30:00Z"


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


def article(domain, path="/articles/test", **extra):
    return {"title": "日本の最新ニュース", "url": "https://" + domain + path,
            "published_date": FRESH, "content": "公開された記事の根拠。", **extra}


class OfflineTests(unittest.TestCase):
    def setUp(self):
        self.network_guard = patch("urllib.request.OpenerDirector.open", side_effect=AssertionError("Offline tests must never access the network"))
        self.network_guard.start()
        self.addCleanup(self.network_guard.stop)

    def run_engine(self, parameters=None, *, client=None, lanes=None):
        return run_news_digest(SLUG, {}, parameters or {}, lanes or module.build_lanes(parameters or {}), client=client, now=NOW)

    def test_metadata_is_an_independent_single_tool_plugin(self):
        manifest = yaml.safe_load((ROOT / "manifest.yaml").read_text())
        self.assertEqual(manifest["name"], SLUG)
        self.assertEqual(manifest["author"], "aisa-team")
        self.assertEqual(manifest["version"], "0.1.0")
        self.assertEqual(manifest["resource"]["permission"], {})
        self.assertEqual(manifest["meta"]["minimum_dify_version"], "1.16.0")
        self.assertEqual(manifest["meta"]["runner"]["version"], "3.12")
        self.assertEqual(len(manifest["plugins"]["tools"]), 1)
        provider = yaml.safe_load((ROOT / manifest["plugins"]["tools"][0]).read_text())
        self.assertEqual(provider["identity"]["name"], SLUG)
        self.assertEqual(len(provider["tools"]), 1)
        tool = yaml.safe_load((ROOT / provider["tools"][0]).read_text())
        self.assertEqual(tool["identity"]["name"], SLUG)
        self.assertIn("ja_JP", tool["description"]["human"])
        self.assertTrue((ROOT / "PRIVACY.md").is_file())
        self.assertEqual(ET.parse(ROOT / "_assets" / "icon.svg").getroot().tag, "{http://www.w3.org/2000/svg}svg")
        self.assertIn("dify-plugin==0.10.2", (ROOT / "requirements.txt").read_text())

    def test_preview_is_offline_and_does_not_need_credentials(self):
        result = self.run_engine({"preview_only": True})
        self.assertEqual(result["status"], "preview")
        self.assertEqual(result["requests"], [])
        self.assertEqual(result["timezone"], "Asia/Tokyo")
        self.assertEqual(len(result["request_plan"]), len(module.build_lanes({})))
        self.assertTrue(all(entry["operation"] == "tavily_search" for entry in result["request_plan"]))

    def test_invalid_options_are_rejected_before_network(self):
        for values in [{SELECTOR: "untrusted"}, {SELECTOR: ["all"]}, {"lookback_hours": 0}, {"max_items": 21}, {"keywords": "a" * 201}, {"fallback_provider": "other"}]:
            with self.subTest(values=values):
                with self.assertRaises(InputError):
                    self.run_engine(values, client=FakeClient(lambda *_: self.fail("Invalid inputs reached a provider")))

    def test_tool_emits_json_text_and_declared_workflow_variables(self):
        result = {"status": "partial", "items": [], "coverage": [], "warnings": ["取得状況を確認"], "generated_at": FRESH, "text": "出典付きの一覧"}
        tool = TOOL_CLASS.from_credentials({"aisa_api_key": "offline-test-key"})
        with patch.object(module, "run_news_digest", return_value=result) as engine:
            messages = list(tool.invoke({"keywords": "予算"}))
        self.assertEqual(engine.call_args.args[0], SLUG)
        self.assertEqual([message.type.value for message in messages[:2]], ["json", "text"])
        values = {message.message.variable_name: message.message.variable_value for message in messages[2:]}
        for key in ("items", "coverage", "warnings", "status", "generated_at"):
            self.assertEqual(values[key], result[key])

    def test_tool_converts_invalid_selector_to_an_error_without_calling_engine(self):
        tool = TOOL_CLASS.from_credentials({"aisa_api_key": "offline-test-key"})
        with patch.object(module, "run_news_digest") as engine:
            messages = list(tool.invoke({SELECTOR: "untrusted"}))
        engine.assert_not_called()
        self.assertEqual(messages[0].message.json_object["status"], "error")
        self.assertEqual(messages[0].message.json_object["items"], [])

    def test_provider_validation_is_local(self):
        provider_path = ROOT / "provider" / (PY_NAME + ".py")
        spec = importlib.util.spec_from_file_location("local_provider_" + PY_NAME, provider_path)
        provider_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(provider_module)
        provider = getattr(provider_module, PROVIDER_CLASS)()
        provider._validate_credentials({"aisa_api_key": "offline-test-key"})
        from dify_plugin.errors.tool import ToolProviderCredentialValidationError
        for key in ("", "bad\nkey", "bad key"):
            with self.subTest(key=key):
                with self.assertRaises(ToolProviderCredentialValidationError):
                    provider._validate_credentials({"aisa_api_key": key})

    def test_default_covers_four_economy_lanes_with_nikkei_only(self):
        number = iter(range(4))
        client = FakeClient(lambda _, params: {"results": [article("www.nikkei.com", "/article/" + str(next(number)))]})
        result = self.run_engine(client=client)
        self.assertEqual(result["count"], 4)
        self.assertEqual({entry["id"] for entry in result["coverage"]}, set(module.SECTIONS))
        self.assertEqual({item["publisher"] for item in result["items"]}, {"nikkei.com"})
        self.assertEqual(len(client.calls), 4)
        for operation, parameters in client.calls:
            self.assertEqual(operation, "tavily_search")
            self.assertEqual(parameters["include_domains"], ["www.nikkei.com"])

    def test_each_economy_section_has_a_distinct_query(self):
        queries = set()
        for section in module.SECTIONS:
            with self.subTest(section=section):
                client = FakeClient(lambda *_: {"results": [article("www.nikkei.com")]})
                result = self.run_engine({"section": section}, client=client)
                self.assertEqual(len(client.calls), 1)
                queries.add(client.calls[0][1]["query"])
                self.assertEqual(result["items"][0]["lane_ids"], [section])
        self.assertEqual(len(queries), 4)

    def test_same_nikkei_story_across_lanes_is_merged(self):
        client = FakeClient(lambda *_: {"results": [article("www.nikkei.com", "/article/shared?utm_source=test")]})
        result = self.run_engine(client=client)
        self.assertEqual(result["count"], 1)
        self.assertEqual(set(result["items"][0]["lane_ids"]), set(module.SECTIONS))
        self.assertEqual(result["items"][0]["url"], "https://www.nikkei.com/article/shared")
        self.assertTrue(all(entry["returned"] == 1 for entry in result["coverage"]))

    def test_other_outlets_and_nikkei_subdomains_are_not_substituted(self):
        rows = [article("www.nikkei.com", "/article/current"), article("www.asahi.com", "/articles/unwanted"), article("marketing.nikkei.com", "/article/advert"), article("big.nikkei.com", "/article/alternate"), article("www.nikkei.com.evil.example", "/article/fake")]
        result = self.run_engine({"section": "macro"}, client=FakeClient(lambda *_: {"results": rows}))
        self.assertEqual([item["url"] for item in result["items"]], ["https://www.nikkei.com/article/current"])

    def test_undated_evidence_is_marked_uncertain(self):
        result = self.run_engine({"section": "companies"}, client=FakeClient(lambda *_: {"results": [article("www.nikkei.com", published_date=None)]}))
        self.assertEqual(result["status"], "partial")
        self.assertIsNone(result["items"][0]["published_at"])
        self.assertFalse(result["items"][0]["time_window_verified"])
        self.assertEqual(result["coverage"][0]["undated"], 1)
        self.assertTrue(result["warnings"])

    def test_authentication_error_does_not_trigger_paid_fallback(self):
        def handler(*_):
            raise APIError("authentication", "Authentication failed", 401)
        client = FakeClient(handler)
        result = self.run_engine({"section": "markets", "fallback_provider": "brave"}, client=client)
        self.assertEqual(result["status"], "error")
        self.assertEqual([operation for operation, _ in client.calls], ["tavily_search"])
        self.assertEqual(result["coverage"][0]["errors"][0]["type"], "authentication")

SLUG = "economy-digest"
PY_NAME = "economy_digest"
SELECTOR = "section"
PROVIDER_CLASS = "EconomyDigestProvider"
module = importlib.import_module("tools.economy_digest")
TOOL_CLASS = module.EconomyDigestTool

if __name__ == "__main__":
    unittest.main()
