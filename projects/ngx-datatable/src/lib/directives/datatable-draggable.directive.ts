import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  DOCUMENT,
  effect,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  signal
} from '@angular/core';

import { TableColumnInternal } from '../types/internal.types';

export interface DragEvent {
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  element: HTMLElement;
  model?: TableColumnInternal;
}

@Directive({
  selector: '[datatableDraggable]',
  host: {
    '[class.draggable]': 'enabled()',
    '[class.dragging]': 'isDragging()',
    '[class.longpress]': 'isLongPressing()'
  }
})
export class DatatableDraggableDirective implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  readonly dragModel = input<TableColumnInternal>();
  readonly dragStartDelay = input(0, { transform: numberAttribute });
  readonly enabled = input(true, { transform: booleanAttribute, alias: 'datatableDraggable' });
  readonly dragMove = output<DragEvent>();
  readonly dragEnd = output<DragEvent>();
  readonly dragStart = output<DragEvent>();

  private timeoutId?: number;
  private pointerId?: number;
  private readonly startX = signal<number | undefined>(undefined);
  private readonly startY = signal<number | undefined>(undefined);
  private currentX?: number;
  private currentY?: number;
  protected readonly isLongPressing = computed(
    () => this.dragStartDelay() !== 0 && this.isDragging()
  );
  protected readonly isDragging = computed(() => this.startX() !== undefined);
  private removeEventListeners?: () => void;

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.element.addEventListener('pointerdown', this.pointerdown);
        this.element.addEventListener('contextmenu', this.contextmenu);
        this.removeEventListeners = () => {
          this.element.removeEventListener('pointerdown', this.pointerdown);
          this.element.removeEventListener('contextmenu', this.contextmenu);
        };
      } else {
        this.removeEventListeners?.();
        this.removeEventListeners = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.removeEventListeners?.();
    this.stopDragging();
  }

  protected readonly pointerdown = (event: PointerEvent): void => {
    if (this.pointerId !== undefined || !this.enabled()) {
      return;
    }
    event.stopPropagation();
    this.delay(this.dragStartDelay()).then(() => {
      if (this.pointerId !== event.pointerId) {
        return;
      }

      this.element.setPointerCapture(event.pointerId);
      this.starting(event.clientX, event.clientY);
      this.setDragging(true);
    });

    this.pointerId = event.pointerId;
    this.document.addEventListener('pointermove', this.pointermove);
    this.document.addEventListener('pointerup', this.ending);
    this.document.addEventListener('pointercancel', this.ending);
  };

  private pointermove = (event: PointerEvent): void => {
    if (event.pointerId === this.pointerId && this.isDragging()) {
      event.preventDefault();
      this.moving(event.clientX, event.clientY);
    }
  };

  // Prevent context menu on long-press drag. Since we don't call preventDefault() on
  // touchstart to allow click events (sorting), the browser would show a context menu
  // after a long press. We prevent this when dragging is active.
  private contextmenu = (event: MouseEvent): void => {
    if (this.isDragging()) {
      event.preventDefault();
    }
  };

  private starting(clientX: number, clientY: number): void {
    this.startX.set(clientX);
    this.startY.set(clientY);
    this.currentX = clientX;
    this.currentY = clientY;
    this.dragStart.emit(this.dragEvent());
  }

  private moving(clientX: number, clientY: number): void {
    this.currentX = clientX;
    this.currentY = clientY;
    this.dragMove.emit(this.dragEvent());
  }

  private ending = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) {
      return;
    }

    const dragged = this.isDragging();
    const dragEvent = dragged ? this.dragEvent() : undefined;
    this.stopDragging();
    // This function is also called if the long press was aborted before the delay.
    // In that case, we don't want to emit dragEnd.
    if (dragged) {
      this.setDragging(false);
      this.dragEnd.emit(dragEvent!);
    }
  };

  private dragEvent(): DragEvent {
    return {
      initialX: this.startX()!,
      initialY: this.startY()!,
      currentX: this.currentX!,
      currentY: this.currentY!,
      element: this.element,
      model: this.dragModel()
    };
  }

  private setDragging(dragging: boolean): void {
    const model = this.dragModel();
    if (model) {
      model.dragging = dragging;
    }
  }

  private stopDragging(): void {
    if (this.pointerId !== undefined) {
      if (this.element.hasPointerCapture(this.pointerId)) {
        this.element.releasePointerCapture(this.pointerId);
      }
    }
    this.document.removeEventListener('pointermove', this.pointermove);
    this.document.removeEventListener('pointerup', this.ending);
    this.document.removeEventListener('pointercancel', this.ending);
    this.pointerId = undefined;
    this.startX.set(undefined);
    this.startY.set(undefined);
    clearTimeout(this.timeoutId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => (this.timeoutId = window.setTimeout(() => resolve(), ms)));
  }
}
