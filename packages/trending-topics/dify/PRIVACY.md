# Privacy Policy

This plugin sends requests only to `https://api.aisa.one`, using the AIsa API key supplied through Dify's provider credential store. It does not implement its own persistent storage, analytics, telemetry, media downloads, or external logging.

The ranking request sends Japan's location identifier. For up to three returned topics, the plugin sends the topic text and time/language preferences to AIsa's X search, and optionally the topic text plus Japan/Japanese preferences to AIsa's YouTube search. AIsa forwards these requests to its configured Twitter API and SearchApi suppliers. Public posts, public author names/handles, engagement metrics, video metadata, and source URLs may contain personal information and are returned to your Dify workflow. Credentials are used in authorization headers and are not included in tool outputs.

No files, local paths, chat history, or complete workflow input are sent. Request metadata in outputs contains the operation name, status, request identifier, and any reported cost; it does not include authentication headers. The plugin does not call a language model. If you connect an LLM node downstream, the workflow operator controls what output is sent to that model provider and its retention settings.

Data is processed in memory for the invocation. Dify and upstream providers may store credentials, request records, and workflow outputs under their own policies. Do not place private or sensitive information in topic queries or retained outputs. For access or deletion of upstream records, contact the applicable service provider.

- [AIsa privacy policy](https://aisa.one/legal/privacy-policy)
- [Twitter API privacy policy](https://twitterapi.io/privacy)
- [SearchApi privacy policy](https://www.searchapi.io/legal/privacy)
- [X privacy policy](https://x.com/en/privacy)
- [Google privacy policy](https://policies.google.com/privacy)
- [Dify privacy policy](https://dify.ai/legal/privacy-policy)

Contact: [developer@aisa.one](mailto:developer@aisa.one).
