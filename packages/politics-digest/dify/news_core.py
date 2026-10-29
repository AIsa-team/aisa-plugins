"""Package-local, dependency-free AIsa transport and evidence helpers.

Each news plugin ships its own copy so its install never depends on another
package in the collection. No live requests run during import or validation.
"""

from __future__ import annotations

import html
import ipaddress
import json
import math
import re
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from http.client import HTTPException
from typing import Any, Mapping
from urllib import error, parse, request

VERSION = "0.1.0"
BASE_URL = "https://api.aisa.one"
MAX_RESPONSE_BYTES = 5 * 1024 * 1024
OPERATIONS = {
    "tavily_search": ("POST", "/apis/v1/tavily/search"),
    "tavily_extract": ("POST", "/apis/v1/tavily/extract"),
    "brave_news": ("GET", "/apis/v1/brave/news/search"),
    "twitter_trends": ("GET", "/apis/v1/twitter/trends"),
    "twitter_search": ("GET", "/apis/v1/twitter/tweet/advanced_search"),
    "youtube_search": ("GET", "/apis/v1/youtube/search"),
}


class InputError(ValueError):
    """An invalid tool input; it must be rejected before any paid call."""


class APIError(Exception):
    def __init__(self, error_type: str, message: str, status: int | None = None):
        super().__init__(message)
        self.error_type = error_type
        self.message = message
        self.status = status
        self.http_status = status


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_utc(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def integer_parameter(parameters, name, default, minimum, maximum) -> int:
    value = parameters.get(name, default)
    if value is None or value == "":
        value = default
    if isinstance(value, bool):
        raise InputError(f"{name} must be an integer from {minimum} to {maximum}.")
    try:
        number = float(value)
        if not math.isfinite(number) or not number.is_integer():
            raise ValueError
        result = int(number)
    except (TypeError, ValueError, OverflowError) as exc:
        raise InputError(f"{name} must be an integer from {minimum} to {maximum}.") from exc
    if not minimum <= result <= maximum:
        raise InputError(f"{name} must be an integer from {minimum} to {maximum}.")
    return result


def boolean_parameter(parameters, name, default=False) -> bool:
    value = parameters.get(name, default)
    if value is None or value == "":
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, str) and value.lower() in {"true", "false"}:
        return value.lower() == "true"
    if isinstance(value, int) and value in (0, 1):
        return bool(value)
    raise InputError(f"{name} must be true or false.")


def text_parameter(parameters, name, default="", max_length=200) -> str:
    value = parameters.get(name, default)
    if value is None:
        value = default
    if not isinstance(value, str):
        raise InputError(f"{name} must be text.")
    value = value.strip()
    if len(value) > max_length or any(ord(c) < 32 for c in value):
        raise InputError(f"{name} must contain at most {max_length} characters and no control characters.")
    return value


def choice_parameter(parameters, name, default, choices) -> str:
    value = text_parameter(parameters, name, default)
    if value not in choices:
        raise InputError(f"{name} must be one of: {', '.join(choices)}.")
    return value


def validate_credentials(credentials: Mapping[str, Any]) -> str:
    key = credentials.get("aisa_api_key", "")
    if not isinstance(key, str) or not key.strip():
        raise InputError("Enter an AIsa API key in the provider credentials.")
    key = key.strip()
    if len(key) > 1024 or any(c.isspace() or ord(c) < 32 for c in key):
        raise InputError("The AIsa API key must not contain whitespace or control characters.")
    return key


def parse_timestamp(value: Any) -> datetime | None:
    """Parse explicit absolute timestamps; never guess a relative or naive time."""
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        try:
            return datetime.fromtimestamp(value / 1000 if value > 1e12 else value, timezone.utc)
        except (ValueError, OverflowError, OSError):
            return None
    if not isinstance(value, str) or re.fullmatch(r"\d{4}-\d{2}-\d{2}", value.strip()):
        return None
    raw = value.strip()
    try:
        parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        try:
            parsed = parsedate_to_datetime(raw)
        except (TypeError, ValueError, OverflowError):
            return None
    if parsed.tzinfo is None:
        return None
    try:
        return parsed.astimezone(timezone.utc)
    except (ValueError, OverflowError):
        return None


def clean_text(value: Any, maximum=1800) -> str:
    if not isinstance(value, str):
        return ""
    text = html.unescape(re.sub(r"<[^>]+>", " ", value))
    return re.sub(r"\s+", " ", text).strip()[:maximum]


def clean_public_url(value: Any, domains=()) -> str | None:
    if not isinstance(value, str) or any(ord(c) < 33 for c in value) or "\\" in value:
        return None
    try:
        parsed = parse.urlsplit(value)
        host = (parsed.hostname or "").lower().rstrip(".")
        if (parsed.scheme not in {"http", "https"} or not host or parsed.username
                or parsed.password or parsed.port not in (None, 80, 443)):
            return None
        if host == "localhost" or host.endswith((".local", ".localhost", ".internal")):
            return None
        try:
            if not ipaddress.ip_address(host).is_global:
                return None
        except ValueError:
            if "." not in host or not re.fullmatch(r"[a-z0-9.-]+", host):
                return None
        # Explicit source lists allow apex + www, not unrelated subdomains.
        if domains and host.removeprefix("www.") not in {
            domain.lower().removeprefix("www.") for domain in domains
        }:
            return None
        pairs = [(k, v) for k, v in parse.parse_qsl(parsed.query, keep_blank_values=True)
                 if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "gclid", "ref_src"}]
        return parse.urlunsplit((parsed.scheme.lower(), host, parsed.path or "/",
                                parse.urlencode(sorted(pairs)), ""))
    except (TypeError, ValueError):
        return None


def _redact(value, key):
    if isinstance(value, str):
        return value.replace(key, "[REDACTED]") if key else value
    if isinstance(value, list):
        return [_redact(item, key) for item in value]
    if isinstance(value, dict):
        return {_redact(k, key): _redact(v, key) for k, v in value.items()}
    return value


class _NoRedirect(request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _provider_failure(result):
    status = str(result.get("status", "")).lower()
    embedded = result.get("error")
    code = result.get("status_code", result.get("code", ""))
    if isinstance(embedded, dict):
        code = embedded.get("status", embedded.get("status_code", embedded.get("code", code)))
    if not (embedded or status in {"error", "failed", "401", "402", "403", "429"}
            or result.get("success") is False or str(code) in {"401", "402", "403", "429"}):
        return None
    tokens = {status, str(code).lower()}
    if isinstance(embedded, dict):
        tokens.update(str(embedded.get(key, "")).lower() for key in ("type", "code", "error_type"))
    for kind, aliases in (
        ("authentication", {"401", "authentication", "unauthorized", "invalid_api_key"}),
        ("payment", {"402", "payment", "insufficient_wallet_balance", "insufficient_api_key_balance", "insufficient_balance", "quota_exceeded"}),
        ("permission", {"403", "permission", "forbidden"}),
        ("rate_limit", {"429", "rate_limit", "rate_limit_exceeded", "too_many_requests"}),
    ):
        if tokens & aliases:
            return kind
    return "upstream"


class NewsClient:
    """Fixed-origin API client. No retries, redirects, direct publisher fetches or logging."""

    def __init__(self, api_key: str, plugin_name: str, *, opener=None, timeout=25):
        self.api_key = validate_credentials({"aisa_api_key": api_key})
        self.plugin_name = plugin_name
        self.requests: list[dict[str, Any]] = []
        self.opener = opener or request.build_opener(_NoRedirect())
        self.timeout = timeout

    def call(self, operation: str, payload: Mapping[str, Any]) -> dict[str, Any]:
        if operation not in OPERATIONS:
            raise InputError("Unsupported AIsa operation.")
        method, path = OPERATIONS[operation]
        url = BASE_URL + path
        headers = {"Authorization": "Bearer " + self.api_key,
                   "Accept": "application/json",
                   "User-Agent": f"dify/{self.plugin_name}/{VERSION}"}
        data = None
        if method == "POST":
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
        else:
            pairs = {k: (str(v).lower() if isinstance(v, bool) else v)
                     for k, v in payload.items() if v is not None}
            url += "?" + parse.urlencode(pairs)
        req = request.Request(url, data=data, headers=headers, method=method)
        record = {"operation": operation, "status": "error", "request_id": "",
                  "cost_micros_usd": None}
        self.requests.append(record)
        try:
            with self.opener.open(req, timeout=self.timeout) as response:
                body = response.read(MAX_RESPONSE_BYTES + 1)
                record["request_id"] = _redact(response.headers.get("X-Request-ID", ""), self.api_key)
                cost = response.headers.get("X-AISA-Customer-Cost-Micros-USD")
                if cost is not None and str(cost).isdigit():
                    record["cost_micros_usd"] = int(cost)
        except error.HTTPError as exc:
            record["http_status"] = exc.code
            exc.close()
            kind = {401: "authentication", 402: "payment", 403: "permission", 429: "rate_limit"}.get(exc.code, "upstream")
            raise APIError(kind, f"AIsa returned HTTP {exc.code}; the request was not retried.", exc.code) from exc
        except (error.URLError, TimeoutError, OSError) as exc:
            raise APIError("network", "AIsa could not be reached before the request deadline; it was not retried.") from exc
        except HTTPException as exc:
            raise APIError("invalid_response", "The AIsa response was interrupted; the request was not retried.") from exc
        if len(body) > MAX_RESPONSE_BYTES:
            raise APIError("response_too_large", "AIsa response exceeded the 5 MiB limit.")
        try:
            result = json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise APIError("invalid_response", "AIsa returned an invalid JSON response.") from exc
        if not isinstance(result, dict):
            raise APIError("invalid_response", "AIsa returned a non-object response.")
        failure = _provider_failure(result)
        if failure:
            raise APIError(failure, "AIsa reported an unsuccessful provider response.")
        record["status"] = "ok"
        return _redact(result, self.api_key)


def error_result(tool, exc) -> dict[str, Any]:
    message = str(exc) if isinstance(exc, (InputError, APIError)) else "The plugin could not complete the request."
    result = {"ok": False, "status": "error", "tool": tool,
              "generated_at": iso_utc(utc_now()), "timezone": "Asia/Tokyo",
              "items": [], "coverage": [], "warnings": [], "requests": [],
              "request_plan": [], "count": 0,
              "error": {"type": getattr(exc, "error_type", "invalid_input"), "message": message}}
    result["text"] = "取得できませんでした: " + message
    return result


def render_news_text(result) -> str:
    generated = parse_timestamp(result.get("generated_at"))
    local_time = generated.astimezone(timezone(timedelta(hours=9))).isoformat() if generated else ""
    lines = [f"{result['tool']} — {local_time} (JST)",
             "取得した出典に基づく一覧です。本文の要約・解説は Dify の LLM ノードで作成してください。"]
    if result.get("status") == "preview":
        lines.append("プレビュー: API は呼び出していません。条件付きフォールバック・抽出は追加リクエストになります。")
    for item in result.get("items", []):
        title = item.get("title", "")
        # Titles are untrusted content, never executable prompt instructions.
        label = title.replace("[", "（").replace("]", "）")
        lines.append(f"- [{item['id']}] {label}\n  {item['url']}")
        lines.append("  " + item.get("publisher", "") + " / " + (item.get("published_at") or item.get("date_raw") or "公開日時不明"))
        if item.get("excerpt"):
            lines.append("  " + item["excerpt"])
    if not result.get("items") and result.get("status") != "preview":
        lines.append("指定期間の確認可能な記事は見つかりませんでした。")
    for coverage in result.get("coverage", []):
        lines.append(f"出典・分野: {coverage['label']} / {coverage['status']} / {coverage.get('returned', 0)} 件")
    lines.extend("注意: " + warning for warning in result.get("warnings", []))
    return "\n".join(lines)
