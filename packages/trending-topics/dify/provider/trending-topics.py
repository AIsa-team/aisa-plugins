from typing import Any

from dify_plugin import ToolProvider
from dify_plugin.errors.tool import ToolProviderCredentialValidationError
from news_core import InputError, validate_credentials


class TrendingTopicsProvider(ToolProvider):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        try:
            validate_credentials(credentials)
        except InputError as exc:
            raise ToolProviderCredentialValidationError(str(exc)) from exc
