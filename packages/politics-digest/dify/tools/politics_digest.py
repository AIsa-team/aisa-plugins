from collections.abc import Generator
from typing import Any

from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage

from news_core import APIError, InputError, choice_parameter, error_result
from news_digest import run_news_digest


SOURCES = {
    "yomiuri": ("読売新聞", "www.yomiuri.co.jp"),
    "asahi": ("朝日新聞", "www.asahi.com"),
    "nikkei": ("日本経済新聞", "www.nikkei.com"),
    "mainichi": ("毎日新聞", "mainichi.jp"),
    "sankei": ("産経新聞", "www.sankei.com"),
}


def build_lanes(parameters: dict[str, Any]) -> list[dict[str, Any]]:
    source = choice_parameter(parameters, "source", "all", ("all", *SOURCES))
    return [
        {"id": name, "label": label, "query": "日本 (政治 OR 国会 OR 政府 OR 政策 OR 選挙)", "domains": [domain]}
        for name, (label, domain) in SOURCES.items()
        if source == "all" or source == name
    ]


class PoliticsDigestTool(Tool):
    def _invoke(self, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        try:
            result = run_news_digest(
                "politics-digest",
                self.runtime.credentials,
                tool_parameters,
                build_lanes(tool_parameters),
            )
        except (InputError, APIError) as exc:
            result = error_result("politics-digest", exc)
        yield self.create_json_message(result)
        yield self.create_text_message(result["text"])
        for name, default in (
            ("items", []), ("coverage", []), ("warnings", []),
            ("status", "error"), ("generated_at", ""),
        ):
            yield self.create_variable_message(name, result.get(name, default))
