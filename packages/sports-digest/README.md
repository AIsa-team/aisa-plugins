# Sports Digest for Dify

An independent Dify Tool plugin for a Japanese sports briefing: sumo, Shohei
Ohtani, Ichiro Suzuki, and football. Its native identity is
`aisa-team/sports-digest`, version `0.1.0`.

- [Setup and tool reference](dify/README.md)
- [Japanese guide](dify/readme/README_ja_JP.md)
- [Privacy policy](dify/PRIVACY.md)

Run the offline checks from the collection root:

```bash
python3 -m unittest discover -s packages/sports-digest/dify/tests -v
```

Package the independent plugin with the Dify Plugin CLI:

```bash
dify plugin package ./packages/sports-digest/dify -o /tmp/sports-digest-0.1.0.difypkg
```

The package build needs no API credentials. Uploading, publishing, and live API
checks are separate actions. Do not commit API keys or local environments.

Source: [package source](https://github.com/AIsa-team/aisa-plugins/tree/main/packages/sports-digest).
Support: [developer@aisa.one](mailto:developer@aisa.one).
