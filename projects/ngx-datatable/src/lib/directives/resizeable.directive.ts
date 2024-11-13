import { Directive, ElementRef, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Directive({
  selector: '[resizeable]',
  exportAs: 'resizeable'
})
export class ResizeableDirective implements OnDestroy {
  @Output() resize: EventEmitter<any> = new EventEmitter();
  @Output() resizing: EventEmitter<any> = new EventEmitter();

  element = inject(ElementRef).nativeElement;
  subscription: Subscription;

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  onMouseup(): void {
    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.resize.emit(this.element.clientWidth);
    }
  }

  onMousedown(event: MouseEvent): void {
    const initialWidth = this.element.clientWidth;
    const mouseDownScreenX = event.screenX;
    event.stopPropagation();

    const mouseup = fromEvent(document, 'mouseup');
    this.subscription = mouseup.subscribe((ev: MouseEvent) => this.onMouseup());

    const mouseMoveSub = fromEvent(document, 'mousemove')
      .pipe(takeUntil(mouseup))
      .subscribe((e: MouseEvent) => this.move(e, initialWidth, mouseDownScreenX));

    this.subscription.add(mouseMoveSub);
  }

  move(event: MouseEvent, initialWidth: number, mouseDownScreenX: number): void {
    const movementX = event.screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;
    this.resizing.emit(newWidth);
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
