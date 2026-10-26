import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client'
import type {
  SettingsScope,
  SettingsScopeSnapshot,
} from '@deepseek-ai/dsh-client-runtime/client'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@deepseek-ai/dsh-client-runtime/client', () => ({
  createSnapshotStore<T>(initial: T) {
    let snapshot = initial
    const listeners = new Set<() => void>()
    return {
      getSnapshot: () => snapshot,
      subscribe(listener: () => void) {
        listeners.add(listener)
        return () => { listeners.delete(listener) }
      },
      set(next: T) {
        snapshot = next
        for (const listener of listeners) listener()
      },
    }
  },
}))

import { EasySearchCardController } from '../src/client/controller.ts'
import { apply as applyClient } from '../src/client/index.tsx'
import type { EasySearchSettings } from '../src/client/model.ts'

class TestSettingsScope implements SettingsScope<EasySearchSettings> {
  private readonly listeners = new Set<() => void>()
  private snapshot: SettingsScopeSnapshot<EasySearchSettings> = {
    status: 'ready',
    value: { routingMode: 'aisa' },
    base: { routingMode: 'aisa' },
    user: {},
    revision: 0,
    writable: true,
    mode: 'host',
  }

  getSnapshot(): SettingsScopeSnapshot<EasySearchSettings> {
    return this.snapshot
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  async set(field: string, value: unknown): Promise<void> {
    this.replace({
      value: { ...this.snapshot.value, [field]: value },
      user: { ...object(this.snapshot.user), [field]: value },
    })
  }

  async unset(field: string): Promise<void> {
    const user = { ...object(this.snapshot.user) }
    delete user[field]
    const value = { ...this.snapshot.value }
    const inherited = object(this.snapshot.base)[field]
    if (inherited === undefined) delete value[field as keyof EasySearchSettings]
    else Object.assign(value, { [field]: inherited })
    this.replace({ value, user })
  }

  private replace(next: Pick<SettingsScopeSnapshot<EasySearchSettings>, 'value' | 'user'>): void {
    this.snapshot = {
      ...this.snapshot,
      ...next,
      revision: (this.snapshot.revision ?? 0) + 1,
    }
    for (const listener of this.listeners) listener()
  }
}

function object(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function success<T>(value: T) {
  return { rpcId: 'easy-search-test' as never, result: { ok: true as const, value } }
}

function credentialApi() {
  const values = new Set<string>()
  const credentials: Pick<IApiClient, 'credentials'>['credentials'] = {
    describe: vi.fn(async ({ refs }: { refs: string[] }) => success({
      credentials: Object.fromEntries(refs.map(ref => [ref, {
        configured: values.has(ref),
        writable: true,
      }])),
    })),
    set: vi.fn(async ({ ref }: { ref: string; value: string }) => {
      values.add(ref)
      return success({})
    }),
    unset: vi.fn(async ({ ref }: { ref: string }) => {
      values.delete(ref)
      return success({})
    }),
  }
  return { api: { credentials }, credentials }
}

describe('EasySearchCardController', () => {
  it('commits settings and credentials together without retaining the key', async () => {
    const scope = new TestSettingsScope()
    const { api, credentials } = credentialApi()
    const controller = new EasySearchCardController(scope, api)
    const face = controller.inject()

    await vi.waitFor(() => { expect(credentials.describe).toHaveBeenCalledOnce() })

    face.setMode('hybrid')
    face.editKey('tavily', 'tavily-test-secret')
    expect(face.hooks.easySearchCard.getSnapshot()).toMatchObject({
      mode: 'hybrid',
      dirty: true,
      saving: false,
    })

    face.save()
    await vi.waitFor(() => {
      expect(credentials.set).toHaveBeenCalledWith({
        ref: 'TAVILY_API_KEY',
        value: 'tavily-test-secret',
      })
      expect(face.hooks.easySearchCard.getSnapshot().saving).toBe(false)
    })

    const saved = face.hooks.easySearchCard.getSnapshot()
    expect(scope.getSnapshot().value?.routingMode).toBe('hybrid')
    expect(saved.credentials.tavily).toMatchObject({
      configured: true,
      draft: '',
      removing: false,
    })
    expect(saved.dirty).toBe(false)
    expect(JSON.stringify(saved)).not.toContain('tavily-test-secret')

    controller.dispose()
  })

  it('contributes one ordered card to the native plugin settings slot', () => {
    const scope = new TestSettingsScope()
    const { api } = credentialApi()
    const register = vi.fn(() => () => {})
    const inject = vi.fn((_slot: string, contribution: () => unknown) => contribution())
    const bind = vi.fn(() => scope)
    const ctx = {
      get: vi.fn(() => api),
      settingsScope: { bind },
      effect: vi.fn(),
      locale: { register: vi.fn() },
      remote: { $on: vi.fn() },
      slots: { inject, register },
    }

    applyClient(ctx as never)

    expect(bind).toHaveBeenCalledWith({ namespace: 'easy-search' })
    expect(inject).toHaveBeenCalledWith('settings.plugin.item', expect.any(Function))
    expect(register).toHaveBeenCalledWith(expect.objectContaining({
      name: 'settings.plugin.item',
      key: 'easy-search',
      priority: 30,
      locale: 'easy-search.settings',
    }), expect.any(Function))
  })
})
