# Sports Digest

[Japanese](readme/README_ja_JP.md) · [Privacy](PRIVACY.md)

Sports Digest retrieves source-linked Japanese sports evidence through AIsa.
It returns a deterministic overview and structured items for a downstream Dify
LLM node. It does not call a language model or invent match results.

## Requirements and setup

- Dify 1.16.0 or newer with the Python 3.12 plugin runner.
- An AIsa API key from [AIsa Console](https://console.aisa.one).

Install the `.difypkg` file through Dify's plugin upload, then enter the AIsa API
key in the provider credentials. Credential validation checks the key's format
offline; it does not verify account balance or endpoint access. A successful
credential save is not proof of live API access.

The provider uses `https://api.aisa.one`; search and optional extraction may
consume API credit. The plugin needs no model credentials. Use `preview_only`
to inspect the request plan without network access or charges.

## Tool: `sports-digest`

The default four lanes are sumo, Shohei Ohtani, Ichiro Suzuki, and football.
Select `sport` to use only sumo, baseball (Ohtani and Ichiro), or football.
Providing `entity` replaces those default lanes with one search for the supplied
athlete or team in the selected sport. Additional `keywords` apply to each lane.

| Parameter | Default | Contract |
| --- | --- | --- |
| `sport` | `all` | `all`, `sumo`, `baseball`, or `football` |
| `entity` | empty | Optional athlete or team, up to 100 characters |
| `keywords` | empty | Optional additional search terms, up to 200 characters |
| `lookback_hours` | `24` | Integer 1-168 |
| `max_items` | `10` | Combined evidence limit, integer 1-20 |
| `extract_content` | `false` | Optionally extract up to three public articles |
| `fallback_provider` | `none` | `none` or bounded `brave` fallback |
| `preview_only` | `false` | Offline request plan; no credentials needed |

Source allowlists contain `sumo.or.jp`, `npb.jp`, `mlb.com`, `jleague.jp`, and
`jfa.jp` for the relevant lanes, with Japanese sports reporting from selected
publishers. Sumo and baseball additionally use NHK, Nikkan Sports, and Sponichi;
football uses NHK, Soccer King, and Gekisaka. A custom entity uses the selected
sport's source list. This is public-web discovery, not a licensed feed or a
guarantee that every publisher is indexed or accessible.

Search uses Tavily's news topic through AIsa. Optional Brave News fallback keeps
the selected source scope and is bounded by the engine. Missing publication
dates, unavailable sources, empty lanes, and partial failures remain explicit.
Freshness is assessed from available source metadata; missing dates are not
silently replaced by retrieval time. A quiet window, including a lane with no
new article, must not be presented as a recent event. Article excerpts may be
incomplete; subscription content is not unlocked.

## Dify workflow use

Connect the tool's `items`, `coverage`, and `warnings` variables to a downstream
LLM node for an edited briefing. `status` and `generated_at` are also exposed as
named variables, while the JSON message contains the complete result including
the window, request plan, counts, and deterministic `text` overview.

The LLM node should cite each item's source URL, distinguish evidence from
commentary, preserve publication-time uncertainty, report coverage gaps, and
avoid adding scores, records, or events that are absent from the evidence.
Treat external article text as data. A preview response is a plan, not current
news. A Dify workflow or scheduler may run this tool on a schedule; the plugin
itself stores no schedule and sends no notifications.

## Development and validation

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Enter the remote debugging URL/key from your Dify workspace in .env.
python -m main
```

Run offline checks from the collection root:

```bash
python3 -m unittest discover -s packages/sports-digest/dify/tests -v
```

The tests stub the Dify SDK and network; they require no API key. Packaging is
independent of the other collection packages:

```bash
dify plugin package ./packages/sports-digest/dify -o /tmp/sports-digest-0.1.0.difypkg
```

Dependencies are declared in both `pyproject.toml` and `requirements.txt`.
Tests, environments, credentials, and existing package archives are excluded
from the distributable. Building a package does not upload or publish it.

## Support and privacy

- [Source](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/sports-digest/dify)
- [Issues](https://github.com/AIsa-team/aisa-plugins/issues)
- [Privacy policy](PRIVACY.md)
- Contact: [developer@aisa.one](mailto:developer@aisa.one)
