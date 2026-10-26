# Easy Search

Easy Search is an independently installable DeepSeek Harness bundle in the
[AIsa Plugins](../..) collection. It adds provider-neutral search and page
extraction tools while leaving settings, credentials, execution, replay, and UI
shell ownership with Harness.

The plugin supports both an AIsa One Key and users' own provider credentials:

- `aisa` routes every capability through AIsa.
- `byok` calls each upstream provider directly.
- `hybrid` prefers a configured direct credential and otherwise uses AIsa.

Hybrid routing falls back only when a direct credential is absent. It never
replays a failed request through another provider.

## What it adds

- `easy_search` searches the web, X, YouTube, and Scholar concurrently.
- `easy_extract` retrieves clean Markdown from one to three public URLs.
- Per-source provider and coverage metadata make partial failures explicit.
- Native DSH web cards render citations and single-page extraction results.
- Credentials are resolved once per tool operation and never enter tool input,
  output, presentation metadata, or settings documents.

The collection root is a catalog, not a package. Easy Search owns this directory,
its lockfile, and its build and test commands. It has no runtime dependency on
the collection root or the legacy AIsa marketplace plugin.

## Requirements

- Node.js 22 or newer
- DeepSeek Harness 0.1.1-rc.2 or newer
- Credentials for the selected routing mode

## Install

### From npm

Install the published bundle into the profile that runs Harness:

~~~sh
dsh plugin --profile web add @aisa-plugins/easy-search
dsh --profile web --dump-config
~~~

Use another profile name if your Harness deployment does not use `web`.

### From a source checkout

Run these commands from the collection root:

~~~sh
cd packages/easy-search-dsh
pnpm install --frozen-lockfile
pnpm run check
dsh plugin --profile web add .
dsh --profile web --dump-config
~~~

The package ships its compiled `lib` directory, so installation does not run a
build script.

## Configure in DSH

Ordinary setup stays inside DSH:

1. Open **Settings → Plugins → Plugin configuration**.
2. Expand **Easy Search** and choose a route.
3. Paste the keys shown for that route.
4. Select **Save changes**.

The card writes ordinary values through DSH Settings and secrets through DSH
Credentials. A saved key is intentionally never read back into the browser;
the field clears and its badge changes to **Ready** instead. Changes apply to
the next tool operation without restarting DSH.

### Routing

| Mode | Selection rule | Missing credential | Request failure |
| --- | --- | --- | --- |
| `aisa` | Always AIsa | Operation fails | No provider switch |
| `byok` | Always direct | Capability fails | No provider switch |
| `hybrid` | Direct key if configured, otherwise AIsa | Falls back to AIsa | No provider switch |

The default is `aisa`, preserving the simplest One Key setup. Choose `hybrid`
when direct keys should be used where available and AIsa should cover the
remaining sources. Choose `byok` when every capability must use its native
provider.

## Credentials

Settings contain credential references, never secret values. The standard DSH
credential provider stores keys entered in the card. A launch-time environment
variable with the same reference takes precedence; the card reports it as
configured but read-only rather than pretending it can replace it.

| Capability | Direct provider | Default reference |
| --- | --- | --- |
| All AIsa routes | AIsa | `AISA_API_KEY` |
| Web search and extraction | Tavily | `TAVILY_API_KEY` |
| X search | X API v2 | `X_BEARER_TOKEN` |
| YouTube search | YouTube Data API v3 | `YOUTUBE_API_KEY` |
| Scholar search | SerpApi Google Scholar | `SERPAPI_API_KEY` |

One immutable credential snapshot is shared by all requests in a single tool
operation. A later operation resolves credentials again, so settings changes do
not require a plugin restart.

Credential references are scoped to the DSH deployment, not to an individual
browser session. Separate tenant secrets therefore require separate DSH homes
or another credential provider; Easy Search deliberately does not add a second
secret store.

## Configuration

| Setting | Default | Purpose |
| --- | --- | --- |
| Routing mode | `aisa` | `aisa`, `byok`, or `hybrid` |
| AIsa key reference | `AISA_API_KEY` | One Key credential |
| AIsa base URL | `https://api.aisa.one` | Origin used only for AIsa routes |
| Tavily key reference | `TAVILY_API_KEY` | Direct web and extraction |
| X token reference | `X_BEARER_TOKEN` | Direct X recent search |
| YouTube key reference | `YOUTUBE_API_KEY` | Direct YouTube search |
| SerpApi key reference | `SERPAPI_API_KEY` | Direct Scholar search |
| Request timeout | 30000 ms | Per-request cooperative timeout |
| Response limit | 5 MiB | Maximum upstream response bytes |
| Default results | 5 | Results retained per selected source |
| Maximum results | 10 | User-selectable per-source ceiling |
| Snippet limit | 1200 chars | Maximum normalized preview |
| Extract limit | 100000 chars | Maximum retained content per page |

The AIsa base URL must be a credential-free HTTP(S) origin. Direct provider
origins are fixed by their adapters and cannot be supplied through tool input.

### Headless and managed deployments

The settings card is the normal path, not the only path. Automation can write
the same user layer to `$DSH_HOME/settings.yaml`:

~~~yaml
easy-search:
  routingMode: hybrid
~~~

The standard local credential provider reads `$DSH_HOME/.credentials.yaml`:

~~~yaml
AISA_API_KEY: your-one-key
TAVILY_API_KEY: your-tavily-key
~~~

Keep only the references the deployment needs, preserve unrelated entries,
and keep this file at mode `0600` inside an owner-only DSH home. Environment
variables with the same names are also supported and take precedence.

Operators can establish a per-profile base in
`$DSH_HOME/profiles/<profile>/cordis.patch.yml`:

~~~yaml
- id: easy-search
  config:
    routingMode: hybrid
~~~

Do not edit the plugin's installed `cordis.patch.yml`; package updates may
replace package-owned files. DSH watches valid user and profile changes live.

## Provider contracts

| Source | AIsa route | Direct route |
| --- | --- | --- |
| Web | Tavily-compatible AIsa API | Tavily Search |
| X | AIsa X Advanced Search | X API v2 recent search |
| YouTube | AIsa YouTube Search | YouTube Data API v3 |
| Scholar | AIsa Scholar Search | SerpApi Google Scholar |
| Extract | Tavily-compatible AIsa API | Tavily Extract |

Provider payloads are normalized behind one stable domain model. Selected
search sources run concurrently; one failed source becomes an error entry in
`coverage` while successful siblings remain available to the model.

`easy_extract` accepts only credential-free HTTP(S) URLs. Literal local,
private, link-local, multicast, and IPv4-mapped private addresses are rejected
before any provider request.

## Native presentation

The canonical tool value remains structured JSON for validation and replay.
The model receives compact citeable text, while `presentationMeta` projects
only fields required by official DSH web cards. Raw provider payloads and
credentials do not enter presentation data.

## Development

Use Node.js 22 or newer and pnpm 11.7.0. Run package commands from
`packages/easy-search-dsh`:

~~~sh
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run check
pnpm pack --dry-run
~~~

The tests lock down routing policy, official HTTP contracts, credential
snapshots, settings-card commits, response normalization, partial-source
failure, extraction URL boundaries, response limits, and native DSH
presentation.

## Repository layout

~~~text
packages/easy-search-dsh/
├── src/
│   ├── providers/
│   │   ├── aisa.ts
│   │   ├── tavily.ts
│   │   ├── x.ts
│   │   ├── youtube.ts
│   │   ├── serpapi.ts
│   │   ├── router.ts
│   │   ├── runtime.ts
│   │   └── contracts.ts
│   ├── client/
│   │   ├── card.tsx
│   │   ├── controller.ts
│   │   ├── locales.ts
│   │   ├── model.ts
│   │   └── styles.ts
│   ├── config.ts
│   ├── index.ts
│   ├── normalize.ts
│   ├── search.ts
│   ├── settings.ts
│   ├── tools.ts
│   └── types.ts
├── tests/
├── docs/architecture.md
├── cordis.patch.yml
├── pnpm-lock.yaml
└── package.json
~~~

See [docs/architecture.md](docs/architecture.md) for dependency boundaries and
extension rules.

## License

MIT
