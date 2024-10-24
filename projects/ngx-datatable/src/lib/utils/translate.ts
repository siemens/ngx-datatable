export function translateXY(x: number, y: number): Record<string, string> {
  return { 'transform': `translate(${x}px, ${y}px)` };
}
