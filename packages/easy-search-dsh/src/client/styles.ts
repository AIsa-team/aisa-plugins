const STYLE_ID = 'easy-search-settings-styles'

const CSS = `
.easy-search-card {
  --easy-blue: #4f8cff;
  --easy-violet: #8b7cf6;
  --easy-mint: #37c995;
  list-style: none;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-3);
  transition: border-color .16s ease, background .16s ease;
}
.easy-search-card:hover { border-color: var(--dsw-alias-label-dimmed); }
.easy-search-card--open {
  border-color: color-mix(in srgb, var(--easy-blue) 28%, var(--dsw-alias-border-l2));
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-card * { box-sizing: border-box; }
.easy-search-card button,
.easy-search-card input,
.easy-search-card select { font: inherit; }
.easy-search-card :is(button, input, select):focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.easy-search-header {
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 14px;
  padding: 13px 16px;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.easy-search-logo {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--easy-blue) 28%, var(--dsw-alias-border-l2));
  border-radius: 10px;
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 9%, transparent);
}
.easy-search-head-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.easy-search-title { font-size: 15px; font-weight: 650; line-height: 1.35; }
.easy-search-description {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-unsaved,
.easy-search-mode-badge,
.easy-search-key-status,
.easy-search-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  line-height: 19px;
}
.easy-search-unsaved {
  padding: 0 8px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-module-platform);
}
.easy-search-mode-badge { padding: 0 9px; }
.easy-search-mode-badge--aisa {
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 11%, transparent);
}
.easy-search-mode-badge--hybrid {
  color: color-mix(in srgb, var(--easy-violet) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-violet) 11%, transparent);
}
.easy-search-mode-badge--byok {
  color: color-mix(in srgb, var(--easy-mint) 80%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-mint) 11%, transparent);
}
.easy-search-chevron {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform .16s ease;
}
.easy-search-chevron--open { transform: rotate(180deg); }
.easy-search-body {
  margin: 0 16px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding: 14px 0 8px;
}
.easy-search-notice {
  margin: 0 0 12px;
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-module-platform);
  font-size: 12px;
}
.easy-search-section { padding: 2px 0 16px; }
.easy-search-section + .easy-search-section {
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding-top: 14px;
}
.easy-search-section-head {
  min-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}
.easy-search-section-head h3 {
  flex: 1;
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.4;
}
.easy-search-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-3);
}
.easy-search-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.easy-search-mode {
  min-width: 0;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 9px 11px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-3);
  text-align: left;
  cursor: pointer;
  transition: border-color .14s ease, background .14s ease, color .14s ease;
}
.easy-search-mode > svg { flex: none; }
.easy-search-mode > span { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.easy-search-mode strong { color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.35; }
.easy-search-mode small {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-mode:hover:not(:disabled) { border-color: var(--dsw-alias-label-dimmed); }
.easy-search-mode--aisa.is-selected {
  border-color: color-mix(in srgb, var(--easy-blue) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-blue);
  background: color-mix(in srgb, var(--easy-blue) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode--hybrid.is-selected {
  border-color: color-mix(in srgb, var(--easy-violet) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-violet);
  background: color-mix(in srgb, var(--easy-violet) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode--byok.is-selected {
  border-color: color-mix(in srgb, var(--easy-mint) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-mint);
  background: color-mix(in srgb, var(--easy-mint) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode:disabled { cursor: default; opacity: .55; }
.easy-search-credentials {
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-3);
}
.easy-search-credential {
  min-height: 54px;
  display: grid;
  grid-template-columns: 32px minmax(104px, 148px) minmax(150px, 1fr) auto 30px;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
}
.easy-search-credential + .easy-search-credential { border-top: 1px solid var(--dsw-alias-border-l2); }
.easy-search-provider-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-provider-copy { min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.easy-search-provider-name {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-provider-role { color: var(--dsw-alias-label-tertiary); font-size: 11px; line-height: 1.35; }
.easy-search-key-field { min-width: 0; }
.easy-search-key-field input,
.easy-search-advanced-grid input,
.easy-search-advanced-grid select {
  width: 100%;
  height: 34px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  padding: 0 10px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-key-field input::placeholder { color: var(--dsw-alias-label-tertiary); }
.easy-search-key-field input[aria-invalid="true"],
.easy-search-advanced-grid input[aria-invalid="true"] { border-color: var(--dsw-alias-label-error); }
.easy-search-key-field input:disabled,
.easy-search-advanced-grid :is(input, select):disabled { cursor: default; opacity: .55; }
.easy-search-key-status {
  gap: 4px;
  padding: 0 7px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-key-status--configured {
  color: color-mix(in srgb, var(--easy-mint) 80%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-mint) 9%, transparent);
}
.easy-search-key-status--pending {
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 9%, transparent);
}
.easy-search-key-status--willRemove { color: var(--dsw-alias-label-error); }
.easy-search-key-action {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 7px;
  padding: 0;
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  cursor: pointer;
}
.easy-search-key-action:hover:not(:disabled) { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
.easy-search-key-action--danger:hover:not(:disabled) { color: var(--dsw-alias-label-error); }
.easy-search-key-action:disabled { opacity: .28; cursor: default; }
.easy-search-field-error {
  grid-column: 3 / -1;
  color: var(--dsw-alias-label-error);
  font-size: 11px;
  line-height: 1.35;
}
.easy-search-advanced {
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding: 12px 0 14px;
}
.easy-search-advanced summary {
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  list-style: none;
  font-size: 12px;
  font-weight: 600;
}
.easy-search-advanced summary::-webkit-details-marker { display: none; }
.easy-search-advanced summary > span:first-child { display: inline-flex; align-items: center; gap: 7px; }
.easy-search-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--easy-blue); }
.easy-search-advanced-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 11px;
}
.easy-search-advanced-grid label { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.easy-search-advanced-grid label > span:first-child {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 500;
}
.easy-search-endpoint { grid-column: 1 / -1; }
.easy-search-reset {
  border: 0;
  padding: 10px 0 0;
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  cursor: pointer;
  font-size: 11px;
}
.easy-search-reset:hover:not(:disabled) { color: var(--dsw-alias-label-primary); }
.easy-search-reset:disabled { cursor: default; opacity: .5; }
.easy-search-footer {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding-top: 10px;
}
.easy-search-footer-message {
  min-width: 0;
  flex: 1;
  color: var(--dsw-alias-label-error);
  font-size: 11px;
  line-height: 1.4;
}
.easy-search-button {
  min-height: 32px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 13px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 550;
}
.easy-search-button--ghost {
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.easy-search-button--primary {
  color: var(--dsw-alias-bg-layer-3);
  background: var(--dsw-alias-label-primary);
}
.easy-search-button:hover:not(:disabled) { filter: brightness(1.05); }
.easy-search-button:disabled { opacity: .4; cursor: default; }
.easy-search-sr-only {
  width: 1px;
  height: 1px;
  position: absolute;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
@media (max-width: 720px) {
  .easy-search-mode-badge { display: none; }
  .easy-search-modes { grid-template-columns: 1fr; }
  .easy-search-mode { min-height: 52px; }
  .easy-search-credential {
    grid-template-columns: 32px minmax(0, 1fr) auto 30px;
  }
  .easy-search-key-field { grid-column: 1 / -1; grid-row: 2; }
  .easy-search-key-status { grid-column: 3; grid-row: 1; }
  .easy-search-key-action { grid-column: 4; grid-row: 1; }
  .easy-search-field-error { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .easy-search-header { padding-inline: 12px; }
  .easy-search-description, .easy-search-unsaved { display: none; }
  .easy-search-body { margin-inline: 12px; }
  .easy-search-advanced-grid { grid-template-columns: 1fr; }
  .easy-search-endpoint { grid-column: auto; }
  .easy-search-footer { flex-wrap: wrap; }
  .easy-search-footer-message { flex-basis: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .easy-search-card,
  .easy-search-chevron,
  .easy-search-mode { transition: none; }
}
`

export function installStyles(): () => void {
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.dataset.plugin = '@aisa-plugins/easy-search'
  style.textContent = CSS
  document.head.append(style)
  return () => { style.remove() }
}
