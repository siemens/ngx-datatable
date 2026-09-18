import { ComponentHarness } from '@angular/cdk/testing';

export class DraggableHarness extends ComponentHarness {
  static readonly hostSelector = '.draggable';

  async mouseDown(x: number, y: number = 0): Promise<void> {
    return this.pointerDown(x, y, 'mouse');
  }

  async touchStart(x: number, y: number = 0): Promise<void> {
    return this.pointerDown(x, y, 'touch');
  }

  async mouseMove(x: number, y: number = 0): Promise<void> {
    document.dispatchEvent(this.pointerEvent('pointermove', x, y, 'mouse'));
  }

  async touchMove(x: number, y: number = 0): Promise<void> {
    document.dispatchEvent(this.pointerEvent('pointermove', x, y, 'touch'));
  }

  async mouseUp(): Promise<void> {
    document.dispatchEvent(this.pointerEvent('pointerup', 0, 0, 'mouse'));
  }

  async touchEnd(): Promise<void> {
    document.dispatchEvent(this.pointerEvent('pointerup', 0, 0, 'touch'));
  }

  private async pointerDown(x: number, y: number, pointerType: string): Promise<void> {
    return this.host().then(host =>
      host.dispatchEvent('pointerdown', { clientX: x, clientY: y, pointerId: 666, pointerType })
    );
  }

  private pointerEvent(type: string, clientX: number, clientY: number, pointerType: string): Event {
    return new PointerEvent(type, { clientX, clientY, pointerId: 666, pointerType });
  }
}
