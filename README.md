# AIsa Plugins

A collection of independently maintained plugins and integrations from AIsa.
Use this repository to find a plugin and work on its source. Each package keeps
its own native manifests, dependencies, tests, and release process.

## Catalog

| Plugin | Hosts | Purpose | Install and develop |
| --- | --- | --- | --- |
| AIsa (`aisa`) | Cursor | Connect Cursor to AIsa Tool Router MCP with OAuth. | [aisa-cursor](packages/aisa-cursor/README.md) |
| AIsa Search (`aisa-search`) | Claude Code, Codex, Dify | Search web, X, YouTube, and Scholar. | [aisa-search](packages/aisa-search/README.md) |
| Go-to-Market (`go-to-market`) | Dify | GTM data tools for traffic, keywords, social, prospects, and creators. | [aisa-gtm-dify](packages/aisa-gtm-dify/README.md) |
| AIsa GTM (`aisa-gtm`) | Claude Code, Codex | Agent workflows for market research, customer insight, content, and SEO. | [aisa-gtm-agents](packages/aisa-gtm-agents/README.md) |
| Easy Search (`@aisa-plugins/easy-search`) | DeepSeek Harness | Search and extraction with AIsa or direct provider keys. | [easy-search-dsh](packages/easy-search-dsh/README.md) |
| AIsa Hub (`aisa-connector`) | WorkBuddy connector | Connect WorkBuddy to AIsa services with OAuth. | [aisa-connector](https://github.com/AIsa-team/aisa-plugins-private/tree/main/workbuddy/aisa-connector) |
| E-commerce Content Studio | WorkBuddy skill | Research and produce e-commerce content. | [e-commerce-content-studio](https://github.com/AIsa-team/aisa-plugins-private/tree/main/workbuddy/e-commerce-content-studio) |
| AIsa Crossborder (`aisa-crossborder`) | WorkBuddy expert | Coordinate cross-border e-commerce research, selection, tracking, and content workflows. | [aisa-crossborder](https://github.com/AIsa-team/aisa-plugins-private/tree/main/workbuddy/aisa-crossborder) |
| Product Selection | WorkBuddy skill | Research and compare product opportunities. | [product-selection](https://github.com/AIsa-team/aisa-plugins-private/tree/main/workbuddy/product-selection) |
| Product Tracking | WorkBuddy skill | Track product prices, availability, ratings, and demand signals. | [product-tracking](https://github.com/AIsa-team/aisa-plugins-private/tree/main/workbuddy/product-tracking) |
| AIsa (`aisa`) | Accio Work | Discover and use AIsa data tools through the AIsa CLI. | [Accio source and submission guide](https://github.com/AIsa-team/aisa-plugins-private/blob/main/accio/SUBMISSION.md) |

The two GTM plugins are separate packages with distinct published identities.
Directory names organize the collection; native plugin and npm package names are
preserved.

Private plugin source is grouped by platform in the
[aisa-plugins-private](https://github.com/AIsa-team/aisa-plugins-private)
companion repository. WorkBuddy lives under `workbuddy/` and Accio under `accio/`. Source links and
submission ZIP releases require repository access. The public collection contains only links and brief
descriptions for these entries.

## Layout

```text
packages/                         independent plugin projects
.claude-plugin/marketplace.json    Claude Code installation catalog
.agents/plugins/marketplace.json   Codex installation catalog
.cursor-plugin/marketplace.json    Cursor installation catalog
.github/CODEOWNERS                review routing
.github/workflows/                registry and package checks
IMPORTS.md                        original repositories and exact source commits
```

There is no repository-wide application, dependency workspace, or shared release
version. Run development and packaging commands from the relevant package. Host
catalogs contain the packages supported by that host.

For Claude Code, add this collection with:

```bash
claude plugin marketplace add AIsa-team/aisa-plugins
claude plugin install aisa-search@aisa
claude plugin install aisa-gtm@aisa
```

For other hosts and local development, use the package README linked above.
This repository makes plugin source and catalogs available; existing marketplace
listings and package releases are managed separately.

## Skills and MCP

[AIsa-team/agent-skills](https://github.com/AIsa-team/agent-skills) remains the
dedicated repository for reusable skills. Existing plugin skill bundles are
preserved here as part of the imported packages; their import commits are recorded
in [IMPORTS.md](IMPORTS.md). Future reuse should reference that skills repository
where the host supports it, or bundle a recorded snapshot when the host requires
local files.

Plugins may connect to AIsa's hosted MCP endpoint. The `AIsa-mcp-server` project
and its server/bridge implementation are excluded from this collection.

## Maintenance

See [CONTRIBUTING.md](CONTRIBUTING.md) for adding and releasing a package.
Run the dependency-free collection check from the repository root:

```bash
python3 scripts/check_registry.py
```

Package READMEs document their own offline tests and build commands. No publishing
or scheduled live API calls run automatically from this repository.

## Provenance and licensing

These are source snapshots copied from the repositories listed in
[IMPORTS.md](IMPORTS.md). The original repositories, history, issues, releases, and
settings remain at their original locations. They were not transferred, modified,
or deleted as part of this import. Updates are deliberate changes in this
collection; there is no automatic synchronization back to the originals.

Original license files are retained with the packages that supply them. Some
imported packages have no standalone license file; this collection does not assign
a new blanket license to their contents. Preserve existing notices and licensing
when updating or redistributing a package.
