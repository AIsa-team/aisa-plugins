import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client'
import {
  createSnapshotStore,
  type SettingsScope,
  type SettingsScopeSnapshot,
  type SnapshotStore,
} from '@deepseek-ai/dsh-client-runtime/client'
import {
  CREDENTIAL_PROVIDERS,
  credentialRefs,
  isRoutingMode,
  validApiKey,
  validOrigin,
  type CredentialProvider,
  type EasySearchSettings,
  type EditableSetting,
  type RoutingMode,
} from './model.ts'

interface CredentialViewState {
  readonly ref: string
  readonly configured: boolean
  readonly writable: boolean
  readonly source?: string
}

export interface CredentialCardState extends CredentialViewState {
  readonly draft: string
  readonly removing: boolean
  readonly invalid: boolean
}

export interface EasySearchCardState {
  readonly available: boolean
  readonly writable: boolean
  readonly dirty: boolean
  readonly invalid: boolean
  readonly saving: boolean
  readonly failure: 'save' | 'credentials' | null
  readonly mode: RoutingMode
  readonly defaultMaxResults: number
  readonly requestTimeoutSeconds: number
  readonly aisaBaseUrl: string
  readonly aisaBaseUrlInvalid: boolean
  readonly advancedOverridden: boolean
  readonly credentials: Readonly<Record<CredentialProvider, CredentialCardState>>
}

export interface EasySearchCardFace {
  hooks: {
    easySearchCard: SnapshotStore<EasySearchCardState>
  }
  setMode: (mode: RoutingMode) => void
  setDefaultMaxResults: (value: number) => void
  setRequestTimeoutSeconds: (value: number) => void
  setAisaBaseUrl: (value: string) => void
  editKey: (provider: CredentialProvider, value: string) => void
  removeKey: (provider: CredentialProvider) => void
  keepKey: (provider: CredentialProvider) => void
  resetAdvanced: () => void
  discard: () => void
  save: () => void
}

type SettingDraft =
  | { readonly kind: 'set'; readonly value: unknown }
  | { readonly kind: 'clear' }

function record(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function sameValue(left: unknown, right: unknown): boolean {
  return Object.is(left, right)
}

export class EasySearchCardController {
  private readonly store: SnapshotStore<EasySearchCardState>
  private readonly settingDrafts = new Map<EditableSetting, SettingDraft>()
  private readonly keyDrafts = new Map<CredentialProvider, string>()
  private readonly keyRemovals = new Set<CredentialProvider>()
  private readonly credentialViews = new Map<CredentialProvider, CredentialViewState>()
  private readonly stopScope: () => void
  private credentialGeneration = 0
  private refSignature = ''
  private saving = false
  private failure: EasySearchCardState['failure'] = null

  constructor(
    private readonly scope: SettingsScope<EasySearchSettings>,
    private readonly api: Pick<IApiClient, 'credentials'>,
  ) {
    this.store = createSnapshotStore(this.project())
    this.refSignature = this.currentRefSignature()
    this.stopScope = scope.subscribe(() => {
      const signature = this.currentRefSignature()
      if (signature !== this.refSignature) {
        this.refSignature = signature
        void this.readCredentials()
      }
      this.publish()
    })
    void this.readCredentials()
  }

  dispose(): void {
    this.credentialGeneration += 1
    this.stopScope()
  }

  inject(): EasySearchCardFace {
    return {
      hooks: { easySearchCard: this.store },
      setMode: mode => { this.stage('routingMode', mode) },
      setDefaultMaxResults: value => { this.stage('defaultMaxResults', value) },
      setRequestTimeoutSeconds: value => { this.stage('requestTimeoutMs', value * 1_000) },
      setAisaBaseUrl: value => { this.stage('aisaBaseUrl', value) },
      editKey: (provider, value) => {
        if (value.length === 0) this.keyDrafts.delete(provider)
        else this.keyDrafts.set(provider, value)
        this.keyRemovals.delete(provider)
        this.failure = null
        this.publish()
      },
      removeKey: provider => {
        this.keyDrafts.delete(provider)
        this.keyRemovals.add(provider)
        this.failure = null
        this.publish()
      },
      keepKey: provider => {
        this.keyRemovals.delete(provider)
        this.failure = null
        this.publish()
      },
      resetAdvanced: () => {
        this.reset('aisaBaseUrl')
        this.reset('defaultMaxResults')
        this.reset('requestTimeoutMs')
      },
      discard: () => {
        this.settingDrafts.clear()
        this.keyDrafts.clear()
        this.keyRemovals.clear()
        this.failure = null
        this.publish()
      },
      save: () => { void this.save() },
    }
  }

  refreshCredential(ref: string): void {
    if (!Object.values(credentialRefs(this.snapshot().value)).includes(ref)) return
    void this.readCredentials()
  }

  private snapshot(): SettingsScopeSnapshot<EasySearchSettings> {
    return this.scope.getSnapshot()
  }

  private effective(field: EditableSetting): unknown {
    const draft = this.settingDrafts.get(field)
    if (draft?.kind === 'set') return draft.value
    if (draft?.kind === 'clear') return record(this.snapshot().base)?.[field]
    return this.snapshot().value?.[field]
  }

  private stage(field: EditableSetting, value: unknown): void {
    const current = this.snapshot().value?.[field]
    if (sameValue(value, current)) this.settingDrafts.delete(field)
    else this.settingDrafts.set(field, { kind: 'set', value })
    this.failure = null
    this.publish()
  }

  private reset(field: EditableSetting): void {
    if (Object.hasOwn(record(this.snapshot().user) ?? {}, field)) {
      this.settingDrafts.set(field, { kind: 'clear' })
    } else {
      this.settingDrafts.delete(field)
    }
    this.failure = null
    this.publish()
  }

  private settingsPlan(): Array<readonly [EditableSetting, SettingDraft]> {
    const user = record(this.snapshot().user) ?? {}
    return [...this.settingDrafts].filter(([field, draft]) =>
      draft.kind === 'clear'
        ? Object.hasOwn(user, field)
        : !sameValue(draft.value, this.snapshot().value?.[field]))
  }

  private projectCredential(provider: CredentialProvider): CredentialCardState {
    const ref = credentialRefs(this.snapshot().value)[provider]
    const current = this.credentialViews.get(provider)
    const draft = this.keyDrafts.get(provider) ?? ''
    return {
      ref,
      configured: current?.ref === ref ? current.configured : false,
      writable: current?.ref === ref ? current.writable : true,
      ...current?.ref === ref && current.source !== undefined ? { source: current.source } : {},
      draft,
      removing: this.keyRemovals.has(provider),
      invalid: !validApiKey(draft),
    }
  }

  private project(): EasySearchCardState {
    const modeValue = this.effective('routingMode')
    const mode = isRoutingMode(modeValue) ? modeValue : 'aisa'
    const defaultMaxResults = this.effective('defaultMaxResults')
    const timeout = this.effective('requestTimeoutMs')
    const endpoint = this.effective('aisaBaseUrl')
    const credentials = Object.fromEntries(
      CREDENTIAL_PROVIDERS.map(provider => [provider, this.projectCredential(provider)]),
    ) as Record<CredentialProvider, CredentialCardState>
    const aisaBaseUrl = typeof endpoint === 'string' ? endpoint : 'https://api.aisa.one'
    const invalidCredentials = CREDENTIAL_PROVIDERS.some(provider => credentials[provider].invalid)
    const user = record(this.snapshot().user) ?? {}
    return {
      available: this.snapshot().status === 'ready',
      writable: this.snapshot().writable,
      dirty: this.settingsPlan().length > 0 || this.keyDrafts.size > 0 || this.keyRemovals.size > 0,
      invalid: !validOrigin(aisaBaseUrl) || invalidCredentials,
      saving: this.saving,
      failure: this.failure,
      mode,
      defaultMaxResults: typeof defaultMaxResults === 'number' ? defaultMaxResults : 5,
      requestTimeoutSeconds: typeof timeout === 'number' ? timeout / 1_000 : 30,
      aisaBaseUrl,
      aisaBaseUrlInvalid: !validOrigin(aisaBaseUrl),
      advancedOverridden: ['aisaBaseUrl', 'defaultMaxResults', 'requestTimeoutMs']
        .some(field => Object.hasOwn(user, field)),
      credentials,
    }
  }

  private publish(): void {
    this.store.set(this.project())
  }

  private currentRefSignature(): string {
    return CREDENTIAL_PROVIDERS.map(provider => credentialRefs(this.snapshot().value)[provider]).join('\u0000')
  }

  private async readCredentials(): Promise<void> {
    const generation = ++this.credentialGeneration
    const refs = credentialRefs(this.snapshot().value)
    try {
      const response = await this.api.credentials.describe({ refs: [...new Set(Object.values(refs))] })
      if (generation !== this.credentialGeneration) return
      if (!response.result.ok) {
        this.failure = 'credentials'
        this.publish()
        return
      }
      for (const provider of CREDENTIAL_PROVIDERS) {
        const ref = refs[provider]
        const view = response.result.value.credentials[ref]
        this.credentialViews.set(provider, {
          ref,
          configured: view?.configured ?? false,
          writable: view?.writable ?? true,
          ...view?.source === undefined ? {} : { source: view.source },
        })
      }
      if (this.failure === 'credentials') this.failure = null
      this.publish()
    } catch (_transportFailure) {
      if (generation !== this.credentialGeneration) return
      this.failure = 'credentials'
      this.publish()
    }
  }

  private async save(): Promise<void> {
    const projected = this.project()
    if (!projected.dirty || projected.invalid || this.saving) return
    this.saving = true
    this.failure = null
    this.publish()
    try {
      for (const [field, draft] of this.settingsPlan()) {
        if (draft.kind === 'clear') await this.scope.unset(field)
        else await this.scope.set(field, draft.value)
        this.settingDrafts.delete(field)
      }

      const refs = credentialRefs(this.snapshot().value)
      for (const provider of CREDENTIAL_PROVIDERS) {
        if (this.keyRemovals.has(provider)) {
          const response = await this.api.credentials.unset({ ref: refs[provider] })
          if (!response.result.ok) throw new Error(response.result.error.message)
          this.keyRemovals.delete(provider)
        }
        const value = this.keyDrafts.get(provider)?.trim()
        if (value === undefined || value.length === 0) continue
        const response = await this.api.credentials.set({ ref: refs[provider], value })
        if (!response.result.ok) throw new Error(response.result.error.message)
        this.keyDrafts.delete(provider)
      }
      await this.readCredentials()
    } catch (_writeFailure) {
      // The UI reports one bounded failure state; credential literals never enter it.
      this.failure = 'save'
    } finally {
      this.saving = false
      this.publish()
    }
  }
}
