import { describe, expect, it } from 'vitest'
import { inRange } from '~/utils/range'

describe('inRange', () => {
  it('returns true when value is inside range', () => {
    expect(inRange(1, 10, 5)).toBe(true)
  })

  it('returns true on lower boundary', () => {
    expect(inRange(1, 10, 1)).toBe(true)
  })

  it('returns true on upper boundary', () => {
    expect(inRange(1, 10, 10)).toBe(true)
  })

  it('returns false when value is below range', () => {
    expect(inRange(1, 10, 0)).toBe(false)
  })

  it('returns false when value is above range', () => {
    expect(inRange(1, 10, 11)).toBe(false)
  })

  it('works with Infinity upper bound', () => {
    expect(inRange(100, Infinity, 999999)).toBe(true)
    expect(inRange(100, Infinity, 50)).toBe(false)
  })
})
