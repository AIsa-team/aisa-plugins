import { describe, expect, it } from 'vitest'
import {
  credentialRefs,
  isRoutingMode,
  providersForMode,
  validApiKey,
  validOrigin,
} from '../src/client/model.ts'

describe('Easy Search settings model', () => {
  it('projects each route to exactly the credentials its controls need', () => {
    expect(providersForMode('aisa')).toEqual(['aisa'])
    expect(providersForMode('hybrid')).toEqual(['aisa', 'tavily', 'x', 'youtube', 'serpapi'])
    expect(providersForMode('byok')).toEqual(['tavily', 'x', 'youtube', 'serpapi'])
  })

  it('uses the shared default references while preserving declared references', () => {
    expect(credentialRefs(undefined)).toEqual({
      aisa: 'AISA_API_KEY',
      tavily: 'TAVILY_API_KEY',
      x: 'X_BEARER_TOKEN',
      youtube: 'YOUTUBE_API_KEY',
      serpapi: 'SERPAPI_API_KEY',
    })
    expect(credentialRefs({
      aisaApiKeyEnv: 'TEAM_AISA_KEY',
      tavilyApiKeyEnv: '',
      youtubeApiKeyEnv: 'TEAM_YOUTUBE_KEY',
    })).toMatchObject({
      aisa: 'TEAM_AISA_KEY',
      tavily: 'TAVILY_API_KEY',
      youtube: 'TEAM_YOUTUBE_KEY',
    })
  })

  it('accepts only the three routing values', () => {
    expect(isRoutingMode('aisa')).toBe(true)
    expect(isRoutingMode('hybrid')).toBe(true)
    expect(isRoutingMode('byok')).toBe(true)
    expect(isRoutingMode('auto')).toBe(false)
    expect(isRoutingMode(undefined)).toBe(false)
  })

  it('accepts a plain HTTP origin and rejects endpoint-shaped values', () => {
    expect(validOrigin('https://api.example.com')).toBe(true)
    expect(validOrigin('http://127.0.0.1:8080/')).toBe(true)

    for (const value of [
      'ftp://api.example.com',
      'https://user:secret@api.example.com',
      'https://api.example.com/v1',
      'https://api.example.com?debug=1',
      'not a URL',
    ]) {
      expect(validOrigin(value), value).toBe(false)
    }
  })

  it('accepts raw keys but catches common paste mistakes', () => {
    expect(validApiKey('')).toBe(true)
    expect(validApiKey('sk-live_123-ABC')).toBe(true)

    for (const value of [
      '   ',
      'sk-live 123',
      '"sk-live-123"',
      "'sk-live-123'",
      'AISA_API_KEY=sk-live-123',
    ]) {
      expect(validApiKey(value), value).toBe(false)
    }
  })
})
