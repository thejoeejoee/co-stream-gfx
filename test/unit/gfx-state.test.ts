import { describe, expect, it } from 'vitest'
import { createDefaultState, eventMap, exclusions, type GfxState } from '~/utils/gfx-state'

describe('createDefaultState', () => {
  it('returns an object with all keys set to null', () => {
    const state = createDefaultState()
    for (const value of Object.values(state)) {
      expect(value).toBeNull()
    }
  })

  it('returns a fresh object on each call', () => {
    const a = createDefaultState()
    const b = createDefaultState()
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})

describe('eventMap', () => {
  it('maps every SSE event to a valid GfxState key', () => {
    const stateKeys = Object.keys(createDefaultState())
    for (const stateKey of Object.values(eventMap)) {
      expect(stateKeys).toContain(stateKey)
    }
  })

  it('covers all GfxState keys', () => {
    const stateKeys = new Set(Object.keys(createDefaultState()))
    const mappedKeys = new Set(Object.values(eventMap))
    expect(mappedKeys).toEqual(stateKeys)
  })
})

describe('exclusions', () => {
  it('are symmetric — if A excludes B, B excludes A', () => {
    for (const [key, excluded] of Object.entries(exclusions)) {
      expect(exclusions[excluded as keyof GfxState]).toBe(key)
    }
  })

  it('reference valid GfxState keys', () => {
    const stateKeys = Object.keys(createDefaultState())
    for (const [key, excluded] of Object.entries(exclusions)) {
      expect(stateKeys).toContain(key)
      expect(stateKeys).toContain(excluded)
    }
  })
})
