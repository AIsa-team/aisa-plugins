# AIsa Go-to-Market for Dify

This directory contains the Dify-only Go-to-Market plugin. Its Dify identity is
`aisa-team/go-to-market`, version `0.2.0`. The directory name `aisa-gtm-dify` groups
the integration in this marketplace without changing the published identity.
It has no Codex or Claude Code plugin manifest. The separate
[`aisa-gtm-agents`](../aisa-gtm-agents/README.md) package provides the `aisa-gtm`
agent plugin listed in those hosts' marketplace catalogs.

## Source

Imported from [AIsa-team/dify-gtm-plugin-source](https://github.com/AIsa-team/dify-gtm-plugin-source)
at commit [`1a3b0a0874875e4553532e7e295d09916367a16a`](https://github.com/AIsa-team/dify-gtm-plugin-source/commit/1a3b0a0874875e4553532e7e295d09916367a16a).
Runtime code, manifests, assets, tests, and GTM prompt resources are preserved.
The upstream release/publish and scheduled live-audit workflows are not imported:
they target the standalone repository and require its secrets and publishing setup.
Local packaging and offline validation are documented below.

The upstream Python 3.11+ requirement and Python 3.12 Dify runner are preserved;
the shared `aisa-search` bundle's Python 3.9 requirement is unchanged.

## Documentation

- [English tool and setup guide](dify/README.md)
- [Chinese tool and setup guide](dify/README.zh_Hans.md)
- [Development guide](dify/GUIDE.md)
- [Privacy policy](dify/PRIVACY.md)
- [GTM instructions for a Dify chatflow](dify/gtm-skill/dify-chatflow-instructions.md)

## Package and install

Run from the marketplace repository root with the Dify Plugin CLI installed:

```bash
dify plugin package ./packages/aisa-gtm-dify/dify -o go-to-market-0.2.0.difypkg
```

Install the resulting file through Dify's plugin package upload, then configure
the provider's AIsa API key. No credentials are needed to build the package.
For remote debugging, run the development guide's commands inside
`packages/aisa-gtm-dify/dify/`. Never commit the resulting `.env` file.

## Offline validation

Use Python 3.12 in a virtual environment with PyYAML installed. From the
marketplace repository root:

```bash
python3 packages/aisa-gtm-dify/dify/tests/test_offline.py
```

The GTM suite stubs the Dify SDK and network calls, so it needs no API key or
installed Dify SDK. It resolves files relative to its own location and can also
run from another working directory. `tests/contract_audit.py` is an upstream
live API diagnostic, not part of offline validation; do not run it as a unit test.

The Dify package excludes tests and `gtm-skill/`; the latter contains source-only
prompt resources to use separately when configuring an agent or chatflow.
