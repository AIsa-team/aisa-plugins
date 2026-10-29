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

    def test_default_searches_exactly_five_requested_newspapers(self):
        client = FakeClient(lambda op, params: {"results": [article(params["include_domains"][0])]})
        result = self.run_engine(client=client)
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["count"], 5)
        self.assertEqual({item["publisher"] for item in result["items"]}, {"yomiuri.co.jp", "asahi.com", "nikkei.com", "mainichi.jp", "sankei.com"})
        self.assertEqual(len(client.calls), 5)
        self.assertEqual({item["id"] for item in result["coverage"]}, set(module.SOURCES))
        for operation, parameters in client.calls:
            self.assertEqual(operation, "tavily_search")
            self.assertEqual(parameters["topic"], "news")
            self.assertFalse(parameters["include_answer"])

    def test_each_source_can_be_selected_independently(self):
        for source, (_, domain) in module.SOURCES.items():
            with self.subTest(source=source):
                client = FakeClient(lambda _, parameters: {"results": [article(domain)]})
                result = self.run_engine({"source": source, "keywords": "予算"}, client=client)
                self.assertEqual(len(client.calls), 1)
                self.assertEqual(client.calls[0][1]["include_domains"], [domain])
                self.assertTrue(client.calls[0][1]["query"].endswith("予算"))
                self.assertEqual(result["items"][0]["lane_ids"], [source])

    def test_missing_newspaper_is_explicit_not_replaced(self):
        def handler(_, parameters):
            domain = parameters["include_domains"][0]
            return {"results": [] if domain == "www.asahi.com" else [article(domain)]}
        result = self.run_engine(client=FakeClient(handler))
        self.assertEqual(result["status"], "partial")
        missing = next(entry for entry in result["coverage"] if entry["id"] == "asahi")
        self.assertEqual(missing["status"], "empty")
        self.assertEqual(missing["returned"], 0)
        self.assertTrue(result["warnings"])
        self.assertEqual(result["count"], 4)

    def test_wrong_publisher_subdomains_and_old_stories_are_excluded(self):
        rows = [article("www.asahi.com", "/articles/current"), article("adv.asahi.com", "/articles/advert"), article("www.asahi.com.evil.example", "/articles/fake"), article("www.nikkei.com", "/articles/wrong"), article("www.asahi.com", "/politics/"), article("www.asahi.com", "/articles/old", published_date="2025-01-01T00:00:00Z")]
        result = self.run_engine({"source": "asahi"}, client=FakeClient(lambda *_: {"results": rows}))
        self.assertEqual([item["url"] for item in result["items"]], ["https://www.asahi.com/articles/current"])

    def test_fallback_only_fills_the_empty_publisher(self):
        def handler(operation, parameters):
            if operation == "brave_news":
                self.assertIn("site:www.asahi.com", parameters["q"])
                return {"results": [article("www.asahi.com")]}
            domain = parameters["include_domains"][0]
            return {"results": [] if domain == "www.asahi.com" else [article(domain)]}
        client = FakeClient(handler)
        result = self.run_engine({"fallback_provider": "brave"}, client=client)
        self.assertEqual(result["count"], 5)
        self.assertEqual(sum(operation == "brave_news" for operation, _ in client.calls), 1)

    def test_small_result_budget_still_reports_all_source_coverage(self):
        result = self.run_engine({"max_items": 2}, client=FakeClient(lambda _, params: {"results": [article(params["include_domains"][0])]}))
        self.assertEqual(result["count"], 2)
        self.assertEqual(len(result["coverage"]), 5)
        self.assertEqual(sum(entry["returned"] for entry in result["coverage"]), 2)

SLUG = "politics-digest"
PY_NAME = "politics_digest"
SELECTOR = "source"
PROVIDER_CLASS = "PoliticsDigestProvider"
module = importlib.import_module("tools.politics_digest")
TOOL_CLASS = module.PoliticsDigestTool

if __name__ == "__main__":
    unittest.main()
