export const ROUTING_MODES = ['aisa', 'byok', 'hybrid'] as const
export type RoutingMode = typeof ROUTING_MODES[number]

export const CREDENTIAL_PROVIDERS = ['aisa', 'tavily', 'x', 'youtube', 'serpapi'] as const
export type CredentialProvider = typeof CREDENTIAL_PROVIDERS[number]

export const DEFAULT_AISA_BASE_URL = 'https://api.aisa.one'
export const DEFAULT_ROUTING_MODE: RoutingMode = 'aisa'
export const DEFAULT_AISA_API_KEY_ENV = 'AISA_API_KEY'
export const DEFAULT_TAVILY_API_KEY_ENV = 'TAVILY_API_KEY'
export const DEFAULT_X_BEARER_TOKEN_ENV = 'X_BEARER_TOKEN'
export const DEFAULT_YOUTUBE_API_KEY_ENV = 'YOUTUBE_API_KEY'
export const DEFAULT_SERPAPI_API_KEY_ENV = 'SERPAPI_API_KEY'
export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000
export const MAX_REQUEST_TIMEOUT_MS = 120_000
export const DEFAULT_MAX_RESPONSE_BYTES = 5 * 1024 * 1024
export const DEFAULT_MAX_RESULTS = 5
export const MAX_RESULTS = 10
export const DEFAULT_MAX_SNIPPET_CHARS = 1_200
export const DEFAULT_MAX_EXTRACT_CHARS = 100_000

export interface Config {
  readonly routingMode?: RoutingMode
  readonly aisaApiKeyEnv?: string
  readonly aisaBaseUrl?: string
  readonly tavilyApiKeyEnv?: string
  readonly xBearerTokenEnv?: string
  readonly youtubeApiKeyEnv?: string
  readonly serpApiKeyEnv?: string
  readonly requestTimeoutMs?: number
  readonly maxResponseBytes?: number
  readonly defaultMaxResults?: number
  readonly maxResults?: number
  readonly maxSnippetChars?: number
  readonly maxExtractChars?: number
}

export const CREDENTIAL_REF_FIELDS: Readonly<Record<CredentialProvider, keyof Config>> = {
  aisa: 'aisaApiKeyEnv',
  tavily: 'tavilyApiKeyEnv',
  x: 'xBearerTokenEnv',
  youtube: 'youtubeApiKeyEnv',
  serpapi: 'serpApiKeyEnv',
}

export const DEFAULT_CREDENTIAL_REFS: Readonly<Record<CredentialProvider, string>> = {
  aisa: DEFAULT_AISA_API_KEY_ENV,
  tavily: DEFAULT_TAVILY_API_KEY_ENV,
  x: DEFAULT_X_BEARER_TOKEN_ENV,
  youtube: DEFAULT_YOUTUBE_API_KEY_ENV,
  serpapi: DEFAULT_SERPAPI_API_KEY_ENV,
}
