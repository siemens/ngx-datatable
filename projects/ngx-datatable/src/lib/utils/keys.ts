/**
 * @deprecated The constant `Keys` should no longer be used. Instead use the value directly:
 * ```
 * // old
 * const keys: Keys = Keys.up;
 * // new
 * const keys: Keys = 'up';
 * ```
 */
export const KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  return: 'Enter',
  escape: 'Escape',
  left: 'ArrowLeft',
  right: 'ArrowRight'
} as const;

export type Keys = (typeof KEYS)[keyof typeof KEYS];
