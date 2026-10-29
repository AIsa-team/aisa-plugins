from collections.abc import Generator
from typing import Any

from dify_plugin import Tool
from dify_plugin.entities.tool import ToolInvokeMessage

from news_core import APIError, InputError, error_result
from trending import run_trending


class TrendingTopicsTool(Tool):
    def _invoke(self, tool_parameters: dict[str, Any]) -> Generator[ToolInvokeMessage, None, None]:
        try:
            result = run_trending(tool_parameters, self.runtime.credentials)
        except (APIError, InputError) as exc:
            result = error_result("trending-topics", exc)
            result["topics"] = result["items"]
            result["coverage"] = {"sources": []}
        yield self.create_json_message(result)
        yield self.create_text_message(result["text"])
        for key in ("items", "topics", "coverage", "warnings", "status", "generated_at"):
            yield self.create_variable_message(key, result.get(key))
