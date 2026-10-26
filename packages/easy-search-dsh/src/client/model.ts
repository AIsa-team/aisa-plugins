import {
  CREDENTIAL_PROVIDERS,
  CREDENTIAL_REF_FIELDS,
  DEFAULT_CREDENTIAL_REFS,
  ROUTING_MODES,
  type Config,
  type CredentialProvider,
  type RoutingMode,
} from '../settings.ts'

export { CREDENTIAL_PROVIDERS, ROUTING_MODES }
export type { CredentialProvider, RoutingMode }
export type EasySearchSettings = Config

export type EditableSetting = 'routingMode' | 'aisaBaseUrl' | 'defaultMaxResults' | 'requestTimeoutMs'

const PROVIDERS_BY_MODE: Readonly<Record<RoutingMode, readonly CredentialProvider[]>> = {
  aisa: ['aisa'],
  hybrid: CREDENTIAL_PROVIDERS,
  byok: ['tavily', 'x', 'youtube', 'serpapi'],
}

export function providersForMode(mode: RoutingMode): readonly CredentialProvider[] {
  return PROVIDERS_BY_MODE[mode]
}

export function credentialRefs(settings: EasySearchSettings | undefined): Record<CredentialProvider, string> {
  return Object.fromEntries(CREDENTIAL_PROVIDERS.map((provider) => {
    const value = settings?.[CREDENTIAL_REF_FIELDS[provider]]
    return [provider, typeof value === 'string' && value.length > 0 ? value : DEFAULT_CREDENTIAL_REFS[provider]]
  })) as Record<CredentialProvider, string>
}

export function isRoutingMode(value: unknown): value is RoutingMode {
  return typeof value === 'string' && ROUTING_MODES.includes(value as RoutingMode)
}

export function validOrigin(value: string): boolean {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return ['http:', 'https:'].includes(url.protocol)
    && url.username === ''
    && url.password === ''
    && url.pathname === '/'
    && url.search === ''
    && url.hash === ''
}

export function validApiKey(value: string): boolean {
  if (value.length === 0) return true
  const trimmed = value.trim()
  if (trimmed.length === 0 || !/^[\x21-\x7e]+$/.test(trimmed)) return false
  const first = trimmed[0]
  if ((first === '"' || first === "'" || first === '`') && trimmed.endsWith(first)) return false
  return !/^[A-Z][A-Z0-9_]*=[^=]/.test(trimmed)
}
