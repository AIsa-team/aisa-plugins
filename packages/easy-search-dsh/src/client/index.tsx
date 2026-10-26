import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings-plugins/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import {
  EASY_SEARCH_LOCALE_NAMESPACE,
  EasySearchCard,
} from './card.tsx'
import { EasySearchCardController } from './controller.ts'
import { en, zh } from './locales.ts'
import type { EasySearchSettings } from './model.ts'
import { installStyles } from './styles.ts'

export const name = 'client-ui-easy-search'
export const inject = ['slots', 'locale', 'connection', 'remote', 'settingsScope']

export function apply(ctx: ClientContext): void {
  const { api } = ctx.get('connection') as ConnectionHandle
  const scope = ctx.settingsScope.bind<EasySearchSettings>({ namespace: 'easy-search' })
  const controller = new EasySearchCardController(scope, api)

  ctx.effect(() => ctx.locale.register(EASY_SEARCH_LOCALE_NAMESPACE, { zh, en }), 'easy-search: locale')
  ctx.effect(installStyles, 'easy-search: styles')
  ctx.effect(() => () => { controller.dispose() }, 'easy-search: controller')
  ctx.effect(
    () => ctx.remote.$on('credentials/reference-updated', ref => { controller.refreshCredential(ref) }),
    'easy-search: credential invalidation',
  )

  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: 'easy-search',
    priority: 30,
    locale: EASY_SEARCH_LOCALE_NAMESPACE,
    inject: () => controller.inject(),
  }, EasySearchCard))
}
