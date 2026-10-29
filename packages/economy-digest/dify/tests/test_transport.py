"""Offline regressions for package-local transport and evidence validation.

All responses and failures are supplied in memory. These tests neither import
the Dify SDK nor open a network connection.
"""

import json
import sys
import unittest
from datetime import datetime, timezone
from email.message import Message
from http.client import IncompleteRead
from io import BytesIO
from pathlib import Path
from unittest import mock
from urllib import error, parse, request, response


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from news_core import (  # noqa: E402
    APIError, BASE_URL, InputError, MAX_RESPONSE_BYTES, NewsClient,
    _NoRedirect, clean_public_url, parse_timestamp,
)


SECRET = "test-secret-not-a-real-key"


class FakeResponse:
    def __init__(self, body=b'{"results": []}', headers=None, read_error=None):
        self.body = BytesIO(body)
        self.headers = headers or {}
        self.read_error = read_error
        self.read_limits = []

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.body.close()
        return False

    def read(self, size=-1):
        self.read_limits.append(size)
        if self.read_error is not None:
            raise self.read_error
        return self.body.read(size)


class FakeOpener:
    def __init__(self, result):
        self.result = result
        self.calls = []

    def open(self, req, timeout=None):
        self.calls.append((req, timeout))
        if isinstance(self.result, Exception):
            raise self.result
        return self.result


class RedirectingHTTPSHandler(request.HTTPSHandler):
    """Return an in-memory redirect using urllib's real redirect/error chain."""

    def __init__(self):
        super().__init__()
        self.urls = []

    def https_open(self, req):
        self.urls.append(req.full_url)
        headers = Message()
        headers["Location"] = "https://untrusted.example/receive-credentials"
        result = response.addinfourl(BytesIO(b"redirect"), headers, req.full_url, 302)
        result.msg = "Found"
        return result


class TransportTests(unittest.TestCase):
    def setUp(self):
        network_guard = mock.patch("socket.create_connection", side_effect=AssertionError("Network access is forbidden in transport tests"))
        network_guard.start()
        self.addCleanup(network_guard.stop)

    def make_client(self, result=None):
        opener = FakeOpener(result if result is not None else FakeResponse())
        return NewsClient(SECRET, "transport-test", opener=opener), opener

    def test_post_is_fixed_origin_bearer_json_and_identifies_the_plugin(self):
        client, opener = self.make_client()
        payload = {"query": "日本の政治", "topic": "news", "include_domains": ["example.com"]}
        client.call("tavily_search", payload)
        req, timeout = opener.calls[0]
        self.assertEqual(req.full_url, BASE_URL + "/apis/v1/tavily/search")
        self.assertEqual(req.get_method(), "POST")
        self.assertEqual(req.get_header("Authorization"), "Bearer " + SECRET)
        self.assertEqual(req.get_header("Content-type"), "application/json")
        self.assertEqual(req.get_header("User-agent"), "dify/transport-test/0.1.0")
        self.assertEqual(json.loads(req.data), payload)
        self.assertGreater(timeout, 0)
        self.assertNotIn(SECRET, req.full_url)
        self.assertEqual(client.requests[0]["status"], "ok")

    def test_get_encodes_japanese_query_and_boolean_without_body_or_content_type(self):
        client, opener = self.make_client()
        payload = {"q": "相撲 & 日本", "country": "JP", "spellcheck": False, "unused": None}
        client.call("brave_news", payload)
        req, _ = opener.calls[0]
        parsed = parse.urlsplit(req.full_url)
        self.assertEqual(parsed.path, "/apis/v1/brave/news/search")
        self.assertEqual(req.get_method(), "GET")
        self.assertEqual(parse.parse_qs(parsed.query), {
            "q": ["相撲 & 日本"], "country": ["JP"], "spellcheck": ["false"],
        })
        self.assertIsNone(req.data)
        self.assertIsNone(req.get_header("Content-type"))
        self.assertNotIn(SECRET, req.full_url)

    def test_response_body_keys_nested_values_and_request_id_redact_credentials(self):
        body = json.dumps({SECRET: {"nested": ["echo " + SECRET]}, "results": []}).encode()
        client, _ = self.make_client(FakeResponse(body, {"X-Request-ID": "echo-" + SECRET}))
        result = client.call("tavily_search", {"query": "test"})
        serialized = json.dumps({"result": result, "requests": client.requests})
        self.assertNotIn(SECRET, serialized)
        self.assertIn("[REDACTED]", serialized)
        self.assertEqual(client.requests[0]["request_id"], "echo-[REDACTED]")

    def test_redirect_does_not_forward_bearer_credentials_or_retry(self):
        handler = RedirectingHTTPSHandler()
        opener = request.build_opener(_NoRedirect(), handler)
        client = NewsClient(SECRET, "transport-test", opener=opener)
        with self.assertRaises(APIError) as caught:
            client.call("tavily_search", {"query": "test"})
        self.assertEqual(caught.exception.status, 302)
        self.assertEqual(handler.urls, [BASE_URL + "/apis/v1/tavily/search"])
        self.assertEqual(len(client.requests), 1)
        self.assertNotIn(SECRET, str(caught.exception))

    def test_http_auth_payment_permission_and_rate_limit_fail_once(self):
        for status, kind in ((401, "authentication"), (402, "payment"),
                             (403, "permission"), (429, "rate_limit")):
            with self.subTest(status=status):
                failure = error.HTTPError(BASE_URL, status, "failure " + SECRET, {}, BytesIO(SECRET.encode()))
                client, opener = self.make_client(failure)
                with self.assertRaises(APIError) as caught:
                    client.call("tavily_search", {"query": "test"})
                self.assertEqual(caught.exception.error_type, kind)
                self.assertEqual(caught.exception.status, status)
                self.assertEqual(len(opener.calls), 1)
                self.assertEqual(client.requests[0]["http_status"], status)
                self.assertNotIn(SECRET, str(caught.exception))
                self.assertNotIn(SECRET, json.dumps(client.requests))

    def test_embedded_http200_auth_and_credit_errors_keep_their_type(self):
        cases = (
            ({"error": {"code": "401", "message": SECRET}}, "authentication"),
            ({"error": {"status_code": 402}}, "payment"),
            ({"success": False, "error": {"code": "QUOTA_EXCEEDED"}}, "payment"),
            ({"error": {"status": 429}}, "rate_limit"),
            ({"status": "failed", "code": 403}, "permission"),
        )
        for body, kind in cases:
            with self.subTest(body=body):
                client, opener = self.make_client(FakeResponse(json.dumps(body).encode()))
                with self.assertRaises(APIError) as caught:
                    client.call("tavily_search", {"query": "test"})
                self.assertEqual(caught.exception.error_type, kind)
                self.assertEqual(len(opener.calls), 1)
                self.assertEqual(client.requests[0]["status"], "error")
                self.assertNotIn(SECRET, str(caught.exception))

    def test_response_larger_than_five_mib_is_rejected_with_a_bounded_read(self):
        result = FakeResponse(b"x" * (MAX_RESPONSE_BYTES + 2))
        client, opener = self.make_client(result)
        with self.assertRaises(APIError) as caught:
            client.call("tavily_search", {"query": "test"})
        self.assertEqual(caught.exception.error_type, "response_too_large")
        self.assertEqual(result.read_limits, [MAX_RESPONSE_BYTES + 1])
        self.assertEqual(len(opener.calls), 1)

    def test_non_json_invalid_utf8_and_non_object_bodies_are_rejected(self):
        for body in (b"not JSON", b"\xff", b"[]", b"null", b'"text"', b"42"):
            with self.subTest(body=body):
                client, opener = self.make_client(FakeResponse(body))
                with self.assertRaises(APIError) as caught:
                    client.call("tavily_search", {"query": "test"})
                self.assertEqual(caught.exception.error_type, "invalid_response")
                self.assertEqual(len(opener.calls), 1)

    def test_truncated_http_body_is_a_structured_api_error_without_retry(self):
        client, opener = self.make_client(FakeResponse(read_error=IncompleteRead(b"partial", 100)))
        with self.assertRaises(APIError) as caught:
            client.call("tavily_search", {"query": "test"})
        self.assertEqual(caught.exception.error_type, "invalid_response")
        self.assertEqual(len(opener.calls), 1)
        self.assertEqual(client.requests[0]["status"], "error")

    def test_network_errors_do_not_retry(self):
        for failure in (error.URLError("failed " + SECRET), TimeoutError(SECRET), OSError(SECRET)):
            with self.subTest(failure=type(failure).__name__):
                client, opener = self.make_client(failure)
                with self.assertRaises(APIError) as caught:
                    client.call("tavily_search", {"query": "test"})
                self.assertEqual(caught.exception.error_type, "network")
                self.assertEqual(len(opener.calls), 1)
                self.assertNotIn(SECRET, str(caught.exception))

    def test_unknown_operations_are_rejected_before_network_access(self):
        client, opener = self.make_client()
        with self.assertRaises(InputError):
            client.call("arbitrary_request", {"url": "https://untrusted.example"})
        self.assertEqual(opener.calls, [])
        self.assertEqual(client.requests, [])


class EvidenceValidationTests(unittest.TestCase):
    def test_absolute_timestamps_are_normalized_to_utc(self):
        expected = datetime(2026, 10, 29, 0, tzinfo=timezone.utc)
        self.assertEqual(parse_timestamp("2026-10-29T09:00:00+09:00"), expected)
        self.assertEqual(parse_timestamp("2026-10-29T00:00:00Z"), expected)
        self.assertEqual(parse_timestamp(expected.timestamp()), expected)
        self.assertEqual(parse_timestamp(expected.timestamp() * 1000), expected)

    def test_boundary_timezone_overflow_is_unknown_instead_of_crashing(self):
        for value in ("0001-01-01T00:00:00+01:00", "9999-12-31T23:59:59-01:00"):
            with self.subTest(value=value):
                self.assertIsNone(parse_timestamp(value))

    def test_naive_relative_and_date_only_values_are_not_invented_publication_times(self):
        for value in (None, True, "2 hours ago", "yesterday", "2026-10-29", "2026-10-29T09:00:00",
                      "invalid", float("nan"), float("inf")):
            with self.subTest(value=value):
                self.assertIsNone(parse_timestamp(value))

    def test_local_credential_bearing_and_non_http_urls_are_rejected(self):
        urls = (
            "file:///etc/passwd", "ftp://example.com/file", "http://localhost/private",
            "http://127.0.0.1/private", "http://10.0.0.1/private", "http://169.254.169.254/meta-data",
            "http://[::1]/private", "https://service.local/private", "https://service.internal/private",
            "https://user:password@example.com/story", "https://example.com:8080/story",
            "https://example.com/\nsecret", "https://example.com\\@attacker.example/story",
        )
        for url in urls:
            with self.subTest(url=url):
                self.assertIsNone(clean_public_url(url))

    def test_allowlist_accepts_apex_and_www_but_not_lookalikes_or_other_subdomains(self):
        for url in ("https://example.com/story", "https://www.example.com/story"):
            with self.subTest(url=url):
                self.assertIsNotNone(clean_public_url(url, ["example.com"]))
        for url in ("https://example.com.attacker.example/story", "https://other.example/story",
                    "https://unlisted.example.com/story"):
            with self.subTest(url=url):
                self.assertIsNone(clean_public_url(url, ["example.com"]))

    def test_tracking_parameters_and_fragments_do_not_create_duplicate_urls(self):
        original = "https://www.example.com/story?b=2&utm_source=test&a=1&fbclid=tracking#section"
        self.assertEqual(clean_public_url(original, ["example.com"]),
                         "https://www.example.com/story?a=1&b=2")


if __name__ == "__main__":
    unittest.main()
