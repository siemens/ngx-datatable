import {
  booleanAttribute,
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  numberAttribute,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableColumn } from '../types/table-column.type';
import { getPositionFromEvent, isTouchEvent } from '../utils/events';

@Directive({
  selector: '[long-press]',
  standalone: true,
  host: {
    '(touchstart)': 'onMouseDown($event)',
    '(mousedown)': 'onMouseDown($event)'
  }
})
export class LongPressDirective implements OnDestroy {
  @Input({ transform: booleanAttribute }) pressEnabled = true;
  @Input() pressModel: TableColumn;
  @Input({ transform: numberAttribute }) duration = 500;

  @Output() longPressStart = new EventEmitter<{
    event: MouseEvent | TouchEvent;
    model: TableColumn;
  }>();
  @Output() longPressing = new EventEmitter<{
    event: MouseEvent | TouchEvent;
    model: TableColumn;
  }>();
  @Output() longPressEnd = new EventEmitter<{ model: TableColumn }>();

  pressing: boolean;
  isLongPressing: boolean;
  timeout: any;
  mouseX = 0;
  mouseY = 0;

  subscription: Subscription;

  @HostBinding('class.press')
  get press(): boolean {
    return this.pressing;
  }

  @HostBinding('class.longpress')
  get isLongPress(): boolean {
    return this.isLongPressing;
  }

  onMouseDown(event: MouseEvent | TouchEvent): void {
    const isTouch = isTouchEvent(event);

    if (!this.pressEnabled || (!isTouch && (event as MouseEvent).button !== 0)) {
      return;
    }

    // don't start drag if its on resize handle
    const target = event.target as HTMLElement;
    if (target.classList.contains('resize-handle')) {
      return;
    }

    const { clientX, clientY } = getPositionFromEvent(event);
    this.mouseX = clientX;
    this.mouseY = clientY;

    this.pressing = true;
    this.isLongPressing = false;

    const mouseup = fromEvent(document, isTouch ? 'touchend' : 'mouseup');
    this.subscription = mouseup.subscribe(() => this.onMouseup());

    this.timeout = setTimeout(() => {
      this.isLongPressing = true;
      this.longPressStart.emit({
        event,
        model: this.pressModel
      });

      this.subscription.add(
        fromEvent<MouseEvent | TouchEvent>(document, isTouch ? 'touchmove' : 'mousemove')
          .pipe(takeUntil(mouseup))
          .subscribe(mouseEvent => this.onMove(mouseEvent))
      );

      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  onMove(event: MouseEvent | TouchEvent): void {
    if (this.pressing && !this.isLongPressing) {
      const { clientX, clientY } = getPositionFromEvent(event);
      const xThres = Math.abs(clientX - this.mouseX) > 10;
      const yThres = Math.abs(clientY - this.mouseY) > 10;

      if (xThres || yThres) {
        this.endPress();
      }
    }
  }

  loop(event: MouseEvent | TouchEvent): void {
    if (this.isLongPressing) {
      this.timeout = setTimeout(() => {
        this.longPressing.emit({
          event,
          model: this.pressModel
        });
        this.loop(event);
      }, 50);
    }
  }

  endPress(): void {
    clearTimeout(this.timeout);
    this.isLongPressing = false;
    this.pressing = false;
    this._destroySubscription();

    this.longPressEnd.emit({
      model: this.pressModel
    });
  }

  onMouseup(): void {
    this.endPress();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this._destroySubscription();
  }

  private _destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
