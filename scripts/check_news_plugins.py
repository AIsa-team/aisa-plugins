#!/usr/bin/env python3
"""Validate the four independent news packages with their actual Dify SDK.

This loads metadata and tool classes and emits preview messages. No API key,
debug connection, plugin daemon, or network request is needed.
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLUGINS = ("politics-digest", "economy-digest", "sports-digest", "trending-topics")
CHECK = r'''
import socket
from pathlib import Path
import yaml

def offline(*args, **kwargs):
    raise AssertionError("Network access is forbidden during plugin validation")

socket.socket.connect = offline
socket.create_connection = offline
from dify_plugin import DifyPluginEnv
from dify_plugin.core.plugin_registration import PluginRegistration

registration = PluginRegistration(DifyPluginEnv())
manifest = yaml.safe_load(Path("manifest.yaml").read_text())
assert len(registration.tools_configuration) == 1
assert len(registration.tools_mapping) == 1
assert manifest["name"] == EXPECTED
provider = registration.tools_configuration[0]
assert len(provider.tools) == 1
assert provider.tools[0].identity.name == EXPECTED
assert manifest["resource"]["permission"] == {}
assert any(str(tag.value if hasattr(tag, "value") else tag) == "news" for tag in provider.identity.tags)
for _, provider_cls, tools in registration.tools_mapping.values():
    provider_cls()._validate_credentials({"aisa_api_key": "offline-fixture-key"})
    for tool_name, (entity, tool_cls) in tools.items():
        assert tool_name == EXPECTED
        messages = list(tool_cls.from_credentials({}).invoke({"preview_only": True}))
        assert messages
        variable_names = {message.message.variable_name for message in messages
                          if message.type.value == "variable"}
        assert {"items", "coverage", "warnings", "status", "generated_at"} <= variable_names
print("SDK registration and preview invocation OK: " + EXPECTED)
'''


def main():
    selected = sys.argv[1:] or list(PLUGINS)
    if any(name not in PLUGINS for name in selected):
        raise SystemExit("Choose one or more known news plugins: " + ", ".join(PLUGINS))
    for name in selected:
        code = "EXPECTED = " + repr(name) + "\n" + CHECK
        subprocess.run([sys.executable, "-c", code], cwd=ROOT / "packages" / name / "dify", check=True)


if __name__ == "__main__":
    main()
