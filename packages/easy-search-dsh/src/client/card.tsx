import { useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconBrandX,
  IconBrandYoutube,
  IconCheck,
  IconChevronDown,
  IconKey,
  IconRoute,
  IconRestore,
  IconSchool,
  IconTrash,
  IconWorldSearch,
  IconArrowsShuffle,
} from '@tabler/icons-react'
import type {
  InjectFace,
  PropsLocale,
  PropsRuntime,
} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type { EasySearchCardFace, EasySearchCardState } from './controller.ts'
import type { EasySearchLocaleKey } from './locales.ts'
import {
  CREDENTIAL_PROVIDERS,
  providersForMode,
  type CredentialProvider,
  type RoutingMode,
} from './model.ts'

export const EASY_SEARCH_LOCALE_NAMESPACE = 'easy-search.settings'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'easy-search.settings': EasySearchLocaleKey
  }
}

export type EasySearchCardProps =
  PropsRuntime<'settings.plugin.item'>
  & PropsLocale<typeof EASY_SEARCH_LOCALE_NAMESPACE>
  & InjectFace<EasySearchCardFace>

interface ModeOption {
  readonly mode: RoutingMode
  readonly label: EasySearchLocaleKey
  readonly meta: EasySearchLocaleKey
  readonly icon: typeof IconRoute
}

const MODE_BY_ID = {
  aisa: { mode: 'aisa', label: 'modeAisa', meta: 'modeAisaMeta', icon: IconRoute },
  hybrid: { mode: 'hybrid', label: 'modeHybrid', meta: 'modeHybridMeta', icon: IconArrowsShuffle },
  byok: { mode: 'byok', label: 'modeByok', meta: 'modeByokMeta', icon: IconKey },
} as const satisfies Readonly<Record<RoutingMode, ModeOption>>

const MODES: readonly ModeOption[] = Object.values(MODE_BY_ID)

interface ProviderMeta {
  readonly name: EasySearchLocaleKey
  readonly role: EasySearchLocaleKey
  readonly icon: typeof IconRoute
}

const PROVIDERS: Readonly<Record<CredentialProvider, ProviderMeta>> = {
  aisa: { name: 'providerAisa', role: 'providerAisaRole', icon: IconRoute },
  tavily: { name: 'providerTavily', role: 'providerTavilyRole', icon: IconWorldSearch },
  x: { name: 'providerX', role: 'providerXRole', icon: IconBrandX },
  youtube: { name: 'providerYoutube', role: 'providerYoutubeRole', icon: IconBrandYoutube },
  serpapi: { name: 'providerSerpapi', role: 'providerSerpapiRole', icon: IconSchool },
}

function translated(t: EasySearchCardProps['t'], key: EasySearchLocaleKey, value: string): string {
  return t(key).replace('{value}', value)
}

function statusLabel(
  t: EasySearchCardProps['t'],
  credential: EasySearchCardState['credentials'][CredentialProvider],
): EasySearchLocaleKey {
  if (credential.removing) return 'willRemove'
  if (credential.draft.length > 0) return 'pending'
  return credential.configured ? 'configured' : 'missing'
}

function CredentialRow(props: {
  provider: CredentialProvider
  state: EasySearchCardState
  t: EasySearchCardProps['t']
  editKey: EasySearchCardProps['editKey']
  removeKey: EasySearchCardProps['removeKey']
  keepKey: EasySearchCardProps['keepKey']
}) {
  const meta = PROVIDERS[props.provider]
  const credential = props.state.credentials[props.provider]
  const ProviderIcon = meta.icon
  const disabled = props.state.saving || !credential.writable || credential.removing
  const status = statusLabel(props.t, credential)
  return (
    <div className="easy-search-credential">
      <div className="easy-search-provider-mark" aria-hidden>
        <ProviderIcon size={18} stroke={1.8} />
      </div>
      <div className="easy-search-provider-copy">
        <span className="easy-search-provider-name">{props.t(meta.name)}</span>
        <span className="easy-search-provider-role">{props.t(meta.role)}</span>
      </div>
      <label className="easy-search-key-field">
        <span className="easy-search-sr-only">{props.t(meta.name)}</span>
        <input
          type="password"
          autoComplete="off"
          value={credential.draft}
          placeholder={credential.removing ? props.t('willRemove') : props.t('keyPlaceholder')}
          aria-invalid={credential.invalid || undefined}
          disabled={disabled}
          onChange={(event) => { props.editKey(props.provider, event.target.value) }}
        />
      </label>
      <span
        className={`easy-search-key-status easy-search-key-status--${status}`}
        title={!credential.writable && credential.configured ? props.t('sourceEnvironment') : undefined}
      >
        {status === 'configured' ? <IconCheck size={13} stroke={2.2} aria-hidden /> : null}
        {props.t(status)}
      </span>
      {credential.removing
        ? (
          <button
            type="button"
            className="easy-search-key-action"
            title={props.t('undoRemove')}
            aria-label={`${props.t('undoRemove')}: ${props.t(meta.name)}`}
            onClick={() => { props.keepKey(props.provider) }}
          >
            <IconRestore size={16} stroke={1.8} />
          </button>
        )
        : (
          <button
            type="button"
            className="easy-search-key-action easy-search-key-action--danger"
            title={props.t('removeKey')}
            aria-label={`${props.t('removeKey')}: ${props.t(meta.name)}`}
            disabled={!credential.configured || !credential.writable || props.state.saving}
            onClick={() => { props.removeKey(props.provider) }}
          >
            <IconTrash size={16} stroke={1.8} />
          </button>
        )}
      {credential.invalid
        ? <span className="easy-search-field-error">{props.t('invalidKey')}</span>
        : null}
    </div>
  )
}

export function EasySearchCard(props: EasySearchCardProps) {
  const [open, setOpen] = useState(false)
  const state = props.useEasySearchCard(snapshot => snapshot)
  if (!state.available) return null
  const routeProviders = providersForMode(state.mode)
  const visibleProviders = CREDENTIAL_PROVIDERS.filter(provider =>
    routeProviders.includes(provider)
    || state.credentials[provider].draft.length > 0
    || state.credentials[provider].removing,
  )
  const mode = MODE_BY_ID[state.mode]
  const resultOptions = [...new Set([3, 5, 8, 10, state.defaultMaxResults])].sort((a, b) => a - b)
  const timeoutOptions = [...new Set([15, 30, 60, 120, state.requestTimeoutSeconds])].sort((a, b) => a - b)
  const saveDisabled = !state.dirty || state.invalid || state.saving
  return (
    <li className={`easy-search-card${open ? ' easy-search-card--open' : ''}`}>
      <button
        type="button"
        className="easy-search-header"
        aria-expanded={open}
        aria-label={props.t(open ? 'collapse' : 'expand')}
        onClick={() => { setOpen(current => !current) }}
      >
        <span className="easy-search-logo" aria-hidden><IconWorldSearch size={19} stroke={1.8} /></span>
        <span className="easy-search-head-copy">
          <span className="easy-search-title">{props.t('title')}</span>
          <span className="easy-search-description">{props.t('description')}</span>
        </span>
        {state.dirty ? <span className="easy-search-unsaved">{props.t('unsaved')}</span> : null}
        <span className={`easy-search-mode-badge easy-search-mode-badge--${state.mode}`}>{props.t(mode.label)}</span>
        <IconChevronDown
          size={17}
          stroke={1.8}
          className={`easy-search-chevron${open ? ' easy-search-chevron--open' : ''}`}
          aria-hidden
        />
      </button>

      {open
        ? (
          <div className="easy-search-body">
            {!state.writable ? <p className="easy-search-notice">{props.t('readOnly')}</p> : null}

            <section className="easy-search-section" aria-labelledby="easy-search-route-label">
              <div className="easy-search-section-head">
                <h3 id="easy-search-route-label">{props.t('modeLabel')}</h3>
              </div>
              <div className="easy-search-modes" role="radiogroup" aria-label={props.t('modeLabel')}>
                {MODES.map((option) => {
                  const ModeIcon = option.icon
                  const selected = option.mode === state.mode
                  return (
                    <button
                      key={option.mode}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`easy-search-mode easy-search-mode--${option.mode}${selected ? ' is-selected' : ''}`}
                      disabled={!state.writable || state.saving}
                      onClick={() => { props.setMode(option.mode) }}
                    >
                      <ModeIcon size={18} stroke={1.8} aria-hidden />
                      <span>
                        <strong>{props.t(option.label)}</strong>
                        <small>{props.t(option.meta)}</small>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="easy-search-section" aria-labelledby="easy-search-credentials-label">
              <div className="easy-search-section-head">
                <h3 id="easy-search-credentials-label">{props.t('credentials')}</h3>
                <span className="easy-search-count">{String(visibleProviders.length)}</span>
              </div>
              <div className="easy-search-credentials">
                {visibleProviders.map(provider => (
                  <CredentialRow
                    key={provider}
                    provider={provider}
                    state={state}
                    t={props.t}
                    editKey={props.editKey}
                    removeKey={props.removeKey}
                    keepKey={props.keepKey}
                  />
                ))}
              </div>
            </section>

            <details className="easy-search-advanced">
              <summary>
                <span><IconAdjustmentsHorizontal size={16} stroke={1.8} aria-hidden />{props.t('advanced')}</span>
                {state.advancedOverridden ? <span className="easy-search-dot" aria-hidden /> : null}
              </summary>
              <div className="easy-search-advanced-grid">
                <label>
                  <span>{props.t('resultCount')}</span>
                  <select
                    value={state.defaultMaxResults}
                    disabled={!state.writable || state.saving}
                    onChange={(event) => { props.setDefaultMaxResults(Number(event.target.value)) }}
                  >
                    {resultOptions.map(value => <option key={value} value={value}>{String(value)}</option>)}
                  </select>
                </label>
                <label>
                  <span>{props.t('timeout')}</span>
                  <select
                    value={state.requestTimeoutSeconds}
                    disabled={!state.writable || state.saving}
                    onChange={(event) => { props.setRequestTimeoutSeconds(Number(event.target.value)) }}
                  >
                    {timeoutOptions.map(value => (
                      <option key={value} value={value}>{translated(props.t, 'seconds', String(value))}</option>
                    ))}
                  </select>
                </label>
                {state.mode === 'byok'
                  ? null
                  : (
                    <label className="easy-search-endpoint">
                      <span>{props.t('aisaEndpoint')}</span>
                      <input
                        type="url"
                        value={state.aisaBaseUrl}
                        aria-invalid={state.aisaBaseUrlInvalid || undefined}
                        disabled={!state.writable || state.saving}
                        onChange={(event) => { props.setAisaBaseUrl(event.target.value) }}
                      />
                      {state.aisaBaseUrlInvalid
                        ? <span className="easy-search-field-error">{props.t('invalidEndpoint')}</span>
                        : null}
                    </label>
                  )}
              </div>
              <button
                type="button"
                className="easy-search-reset"
                disabled={!state.writable || state.saving}
                onClick={props.resetAdvanced}
              >
                {props.t('resetAdvanced')}
              </button>
            </details>

            <footer className="easy-search-footer">
              <span className="easy-search-footer-message" role="status">
                {state.failure === 'save'
                  ? props.t('saveFailed')
                  : state.failure === 'credentials' ? props.t('credentialLoadFailed') : ''}
              </span>
              <button
                type="button"
                className="easy-search-button easy-search-button--ghost"
                disabled={!state.dirty || state.saving}
                onClick={props.discard}
              >
                {props.t('discard')}
              </button>
              <button
                type="button"
                className="easy-search-button easy-search-button--primary"
                disabled={saveDisabled}
                onClick={props.save}
              >
                {props.t(state.saving ? 'saving' : 'save')}
              </button>
            </footer>
          </div>
        )
        : null}
    </li>
  )
}
