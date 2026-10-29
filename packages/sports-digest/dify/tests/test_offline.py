"""Offline contract checks. No AIsa credentials or network calls are used."""

import importlib.util
import json
import sys
import types
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest import mock

import yaml


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


class FakeTool:
    def create_json_message(self, value):
        return ("json", value)

    def create_text_message(self, value):
        return ("text", value)

    def create_variable_message(self, name, value):
        return ("variable", name, value)


def load_tool():
    sdk = types.ModuleType("dify_plugin")
    sdk.Tool = FakeTool
    entities = types.ModuleType("dify_plugin.entities")
    entity_tool = types.ModuleType("dify_plugin.entities.tool")
    entity_tool.ToolInvokeMessage = object
    spec = importlib.util.spec_from_file_location("sports_digest_tool", ROOT / "tools/sports_digest.py")
    module = importlib.util.module_from_spec(spec)
    with mock.patch.dict(sys.modules, {
        "dify_plugin": sdk,
        "dify_plugin.entities": entities,
        "dify_plugin.entities.tool": entity_tool,
    }):
        spec.loader.exec_module(module)
    return module


TOOL = load_tool()


class NoNetworkClient:
    requests = []

    def call(self, *args, **kwargs):
        raise AssertionError("Preview attempted a network request")


class ScriptedClient:
    def __init__(self, responses):
        self.responses = list(responses)
        self.requests = []
        self.payloads = []

    def call(self, operation, parameters):
        self.requests.append({"operation": operation, "status": "ok"})
        self.payloads.append(parameters)
        if not self.responses:
            raise AssertionError("Unexpected additional request")
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return response


NOW = datetime(2026, 10, 29, 0, tzinfo=timezone.utc)


def article(url, title="Sports update", published_date="2026-10-28T23:00:00Z", **extra):
    result = {"url": url, "title": title, "content": "Reported evidence.", **extra}
    if published_date is not None:
        result["published_date"] = published_date
    return result


class LaneTests(unittest.TestCase):
    def test_default_four_lanes_include_the_relevant_official_sources(self):
        lanes = {lane["id"]: lane for lane in TOOL.build_lanes({})}
        self.assertEqual(set(lanes), {"sumo", "ohtani", "ichiro", "football"})
        self.assertIn("sumo.or.jp", lanes["sumo"]["domains"])
        for lane in ("ohtani", "ichiro"):
            self.assertIn("mlb.com", lanes[lane]["domains"])
            self.assertIn("npb.jp", lanes[lane]["domains"])
        self.assertIn("jleague.jp", lanes["football"]["domains"])
        self.assertIn("jfa.jp", lanes["football"]["domains"])

    def test_baseball_preserves_two_distinct_player_lanes(self):
        self.assertEqual(
            [lane["id"] for lane in TOOL.build_lanes({"sport": "baseball"})],
            ["ohtani", "ichiro"],
        )

    def test_custom_entity_replaces_unrelated_default_queries(self):
        lanes = TOOL.build_lanes({"sport": "football", "entity": "日本代表"})
        self.assertEqual(len(lanes), 1)
        self.assertIn("日本代表", lanes[0]["query"])
        self.assertIn("jfa.jp", lanes[0]["domains"])
        self.assertNotIn("sumo.or.jp", lanes[0]["domains"])
        self.assertNotIn("Ohtani", lanes[0]["query"])

    def test_each_invocation_owns_its_domain_list(self):
        lanes = TOOL.build_lanes({})
        lanes[0]["domains"].append("attacker.example")
        self.assertNotIn("attacker.example", TOOL.build_lanes({})[0]["domains"])

    def test_invalid_sport_and_oversized_entity_are_rejected(self):
        for params in ({"sport": "basketball"}, {"entity": "a" * 101}, {"entity": ["team"]}):
            with self.subTest(params=params), self.assertRaises(TOOL.InputError):
                TOOL.build_lanes(params)


class EngineIntegrationTests(unittest.TestCase):
    def test_preview_has_four_lanes_without_credentials_or_network(self):
        from news_digest import run_news_digest

        result = run_news_digest(
            "sports-digest", {}, {"preview_only": True}, TOOL.build_lanes({}),
            client=NoNetworkClient(), now=NOW,
        )
        self.assertEqual(result["status"], "preview")
        self.assertEqual(result["items"], [])
        self.assertEqual(result["requests"], [])
        self.assertEqual(result["coverage"], [])
        self.assertEqual({plan["lane"] for plan in result["request_plan"]},
                         {"sumo", "ohtani", "ichiro", "football"})
        self.assertTrue(result["text"])

    def test_recent_official_sumo_result_keeps_evidence_and_verified_time(self):
        client = ScriptedClient([{"results": [article("https://www.sumo.or.jp/ResultData/torikumi/")]}])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {}, TOOL.build_lanes({"sport": "sumo"}), client=client, now=NOW,
        )
        self.assertEqual(result["status"], "ok")
        self.assertEqual(result["count"], 1)
        item = result["items"][0]
        self.assertEqual(item["publisher"], "sumo.or.jp")
        self.assertEqual(item["lane_ids"], ["sumo"])
        self.assertTrue(item["time_window_verified"])
        self.assertEqual(item["content_basis"], "excerpt")
        self.assertNotIn("extracted_content", item)
        self.assertEqual(client.payloads[0]["topic"], "news")
        self.assertIn("sumo.or.jp", client.payloads[0]["include_domains"])

    def test_old_future_and_out_of_source_articles_are_not_current_evidence(self):
        client = ScriptedClient([{"results": [
            article("https://sumo.or.jp/old", published_date="2026-10-20T00:00:00Z"),
            article("https://sumo.or.jp/future", published_date="2026-10-30T00:00:00Z"),
            article("https://sumo.or.jp.attacker.example/story"),
            article("http://127.0.0.1/private"),
        ]}])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {}, TOOL.build_lanes({"sport": "sumo"}), client=client, now=NOW,
        )
        self.assertEqual(result["status"], "empty")
        self.assertEqual(result["items"], [])
        self.assertEqual(result["coverage"][0]["status"], "empty")
        self.assertTrue(result["warnings"])

    def test_four_lanes_expose_ichiro_gap_and_merge_cross_lane_duplicates(self):
        shared = article("https://mlb.com/news/two-japanese-players")
        client = ScriptedClient([
            {"results": [article("https://sumo.or.jp/news/day-one")]},
            {"results": [shared]},
            {"results": []},
            {"results": [article("https://jfa.jp/news/japan-squad")]},
        ])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {}, TOOL.build_lanes({}), client=client, now=NOW,
        )
        self.assertEqual(result["status"], "partial")
        coverage = {lane["id"]: lane for lane in result["coverage"]}
        self.assertEqual(coverage["ichiro"]["status"], "empty")
        self.assertEqual(coverage["ichiro"]["returned"], 0)
        self.assertTrue(any("イチロー" in warning for warning in result["warnings"]))
        self.assertEqual(result["count"], 3)

        duplicated = ScriptedClient([{"results": [shared]}, {"results": [shared]}])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {}, TOOL.build_lanes({"sport": "baseball"}), client=duplicated, now=NOW,
        )
        self.assertEqual(result["count"], 1)
        self.assertEqual(set(result["items"][0]["lane_ids"]), {"ohtani", "ichiro"})

    def test_missing_publication_date_remains_unknown_and_partial(self):
        client = ScriptedClient([{"results": [article("https://mlb.com/news/ichiro", published_date=None)]}])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {}, TOOL.build_lanes({"sport": "baseball", "entity": "Ichiro"}),
            client=client, now=NOW,
        )
        self.assertEqual(result["status"], "partial")
        self.assertIsNone(result["items"][0]["published_at"])
        self.assertFalse(result["items"][0]["time_window_verified"])
        self.assertEqual(result["coverage"][0]["undated"], 1)

    def test_extraction_is_opt_in_and_limited_to_three_selected_articles(self):
        urls = [f"https://sumo.or.jp/news/day-{index}" for index in range(5)]
        client = ScriptedClient([
            {"results": [article(url) for url in urls]},
            {"results": [{"url": urls[0], "raw_content": "Public article excerpt."}],
             "failed_results": [{"url": urls[1], "error": "unavailable"}]},
        ])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {"extract_content": True}, TOOL.build_lanes({"sport": "sumo"}),
            client=client, now=NOW,
        )
        self.assertEqual([request["operation"] for request in client.requests], ["tavily_search", "tavily_extract"])
        self.assertEqual(len(client.payloads[1]["urls"]), 3)
        self.assertEqual(result["items"][0]["content_basis"], "extracted_text")
        self.assertEqual(result["items"][0]["extracted_content"], "Public article excerpt.")
        self.assertEqual(result["items"][1]["access_status"], "unavailable_or_empty")
        self.assertEqual(result["items"][3]["access_status"], "not_extracted")
        self.assertEqual(result["status"], "partial")

    def test_fallback_keeps_sources_and_japanese_locale(self):
        client = ScriptedClient([
            {"results": []},
            {"results": [{"url": "https://jfa.jp/news/japan", "title": "Japan football news",
                          "description": "News excerpt", "page_age": "2026-10-28T23:00:00Z"}]},
        ])
        result = TOOL.run_news_digest(
            "sports-digest", {}, {"fallback_provider": "brave"}, TOOL.build_lanes({"sport": "football"}),
            client=client, now=NOW,
        )
        self.assertEqual([request["operation"] for request in client.requests], ["tavily_search", "brave_news"])
        self.assertEqual(client.payloads[1]["country"], "JP")
        self.assertEqual(client.payloads[1]["search_lang"], "ja")
        self.assertIn("site:jfa.jp", client.payloads[1]["q"])
        self.assertEqual(result["items"][0]["date_role"], "published_or_updated")
        self.assertFalse(result["items"][0]["time_window_verified"])

    def test_tool_exposes_named_variables_for_the_downstream_llm(self):
        tool = TOOL.SportsDigestTool()
        tool.runtime = types.SimpleNamespace(credentials={})
        output = list(tool._invoke({"preview_only": True, "sport": "sumo"}))
        result = next(message[1] for message in output if message[0] == "json")
        self.assertEqual(result["status"], "preview")
        variables = {message[1]: message[2] for message in output if message[0] == "variable"}
        self.assertEqual(set(variables), {"items", "coverage", "warnings", "status", "generated_at"})
        self.assertEqual(variables["items"], result["items"])
        self.assertEqual(variables["coverage"], result["coverage"])
        self.assertTrue(any(message[0] == "text" and message[1] == result["text"] for message in output))

    def test_validation_errors_are_structured_and_do_not_escape_tool(self):
        tool = TOOL.SportsDigestTool()
        tool.runtime = types.SimpleNamespace(credentials={})
        output = list(tool._invoke({"sport": "invalid"}))
        result = next(message[1] for message in output if message[0] == "json")
        self.assertEqual(result["status"], "error")
        self.assertFalse(result["ok"])
        self.assertEqual(result["items"], [])


class PackagingTests(unittest.TestCase):
    def test_native_identity_and_wiring(self):
        manifest = yaml.safe_load((ROOT / "manifest.yaml").read_text())
        self.assertEqual((manifest["author"], manifest["name"], manifest["version"]),
                         ("aisa-team", "sports-digest", "0.1.0"))
        self.assertEqual(manifest["meta"]["minimum_dify_version"], "1.16.0")
        self.assertEqual(manifest["plugins"]["tools"], ["provider/sports-digest.yaml"])
        provider = yaml.safe_load((ROOT / "provider/sports-digest.yaml").read_text())
        self.assertEqual(provider["identity"]["tags"], ["news"])
        self.assertEqual(provider["tools"], ["tools/sports_digest.yaml"])
        self.assertTrue((ROOT / provider["extra"]["python"]["source"]).is_file())
        tool = yaml.safe_load((ROOT / "tools/sports_digest.yaml").read_text())
        self.assertEqual(tool["identity"]["name"], "sports-digest")
        self.assertEqual(tool["output_schema"]["properties"]["coverage"]["type"], "array")
        self.assertTrue((ROOT / tool["extra"]["python"]["source"]).is_file())
        json.dumps(tool["output_schema"])

    def test_dependencies_match_and_secrets_tests_are_not_packaged(self):
        project = (ROOT / "pyproject.toml").read_text()
        requirement = (ROOT / "requirements.txt").read_text().strip()
        self.assertEqual(requirement, "dify-plugin==0.10.2")
        self.assertIn(requirement, project)
        self.assertIn('version = "0.1.0"', project)
        ignore = (ROOT / ".difyignore").read_text().splitlines()
        for entry in (".env", ".env.*", ".venv/", "tests/", "*.difypkg"):
            self.assertIn(entry, ignore)
        self.assertFalse((ROOT / ".env").exists())


if __name__ == "__main__":
    unittest.main()
