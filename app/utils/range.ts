/**
 * Check if a value falls within a range (inclusive on both ends).
 */
export function inRange(from: number, to: number, what: number): boolean {
  return what >= from && what <= to
}
