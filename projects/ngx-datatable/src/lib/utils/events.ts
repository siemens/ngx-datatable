/**
 * Determines if the given event is of type TouchEvent.
 *
 * @param {MouseEvent | TouchEvent} event - The event object to check.
 * @return {boolean} - Returns true if the event is a TouchEvent, otherwise false.
 */
export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return 'touches' in event;
}

/**
 * Extracts the position (x, y coordinates) from a MouseEvent or TouchEvent.
 *
 * @param {MouseEvent | TouchEvent} event - The event object from which to extract the position. Can be either a MouseEvent or a TouchEvent.
 * @return {{ x: number, y: number }} An object containing the x and y coordinates of the event relative to the viewport.
 */
export function getPositionFromEvent(event: MouseEvent | TouchEvent): {
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
} {
  return isTouchEvent(event) ? (event.changedTouches[0] as Touch) : (event as MouseEvent);
}
