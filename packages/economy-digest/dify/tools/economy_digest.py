from collections.abc import Generator
from typing import Any

from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage

from news_core import APIError, InputError, choice_parameter, error_result
from news_digest import run_news_digest


SECTIONS = {
    "macro": ("経済政策・指標", "日本 (経済政策 OR 日銀 OR 物価 OR GDP OR 雇用)"),
    "markets": ("市場・為替", "日本 (株価 OR 為替 OR 金利 OR 債券)"),
    "companies": ("企業・産業", "日本 (企業 OR 決算 OR 産業 OR 投資)"),
    "global": ("世界経済", "日本 (世界経済 OR 貿易 OR 関税 OR 海外景気)"),
}


def build_lanes(parameters: dict[str, Any]) -> list[dict[str, Any]]:
    section = choice_parameter(parameters, "section", "all", ("all", *SECTIONS))
    return [
        {"id": name, "label": label, "query": query, "domains": ["www.nikkei.com"]}
        for name, (label, query) in SECTIONS.items()
        if section == "all" or section == name
    ]


class EconomyDigestTool(Tool):
    def _invoke(self, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        try:
            result = run_news_digest(
                "economy-digest",
                self.runtime.credentials,
                tool_parameters,
                build_lanes(tool_parameters),
            )
        except (InputError, APIError) as exc:
            result = error_result("economy-digest", exc)
        yield self.create_json_message(result)
        yield self.create_text_message(result["text"])
        for name, default in (
            ("items", []), ("coverage", []), ("warnings", []),
            ("status", "error"), ("generated_at", ""),
        ):
            yield self.create_variable_message(name, result.get(name, default))
