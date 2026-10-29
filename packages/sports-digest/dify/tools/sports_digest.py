from collections.abc import Generator
from typing import Any

from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage

from news_core import APIError, InputError, choice_parameter, error_result, text_parameter
from news_digest import run_news_digest


_SPORTS = ("all", "sumo", "baseball", "football")
_LANES = (
    {
        "id": "sumo",
        "label": "相撲",
        "query": "相撲 大相撲 取組 結果 ニュース",
        "sport": "sumo",
        "domains": ["sumo.or.jp", "nhk.or.jp", "nikkansports.com", "sponichi.co.jp"],
    },
    {
        "id": "ohtani",
        "label": "大谷翔平",
        "query": "大谷翔平 Shohei Ohtani 試合 成績 ニュース",
        "sport": "baseball",
        "domains": ["mlb.com", "npb.jp", "nhk.or.jp", "nikkansports.com", "sponichi.co.jp"],
    },
    {
        "id": "ichiro",
        "label": "イチロー",
        "query": "イチロー Ichiro Suzuki ニュース",
        "sport": "baseball",
        "domains": ["mlb.com", "npb.jp", "nhk.or.jp", "nikkansports.com", "sponichi.co.jp"],
    },
    {
        "id": "football",
        "label": "サッカー",
        "query": "サッカー 日本代表 Jリーグ 試合 結果 ニュース",
        "sport": "football",
        "domains": ["jleague.jp", "jfa.jp", "nhk.or.jp", "soccer-king.jp", "gekisaka.jp"],
    },
)


def build_lanes(parameters: dict[str, Any]) -> list[dict[str, Any]]:
    """Build independent source-scoped searches; never mutate default lanes."""
    sport = choice_parameter(parameters, "sport", "all", _SPORTS)
    entity = text_parameter(parameters, "entity", max_length=100)
    selected = [lane for lane in _LANES if sport == "all" or lane["sport"] == sport]
    if entity:
        domains = list(dict.fromkeys(domain for lane in selected for domain in lane["domains"]))
        sport_word = {"all": "スポーツ", "sumo": "相撲", "baseball": "野球", "football": "サッカー"}[sport]
        return [{"id": "custom", "label": entity, "query": f"{entity} {sport_word} ニュース", "domains": domains}]
    return [{key: value.copy() if isinstance(value, list) else value
             for key, value in lane.items() if key != "sport"} for lane in selected]


class SportsDigestTool(Tool):
    def _invoke(self, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        try:
            result = run_news_digest(
                "sports-digest", self.runtime.credentials, tool_parameters, build_lanes(tool_parameters)
            )
        except (InputError, APIError) as exc:
            result = error_result("sports-digest", exc)
        yield self.create_json_message(result)
        yield self.create_text_message(result.get("text", ""))
        for name, default in (("items", []), ("coverage", []), ("warnings", []),
                              ("status", "error"), ("generated_at", "")):
            yield self.create_variable_message(name, result.get(name, default))
