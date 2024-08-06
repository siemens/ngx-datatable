import { Directive, ElementRef, EventEmitter, HostBinding, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Observable, Subscriber } from 'rxjs';

/**
 * Visibility Observer Directive
 *
 * Usage:
 *
 * 		<div
 * 			visibilityObserver
 * 			(visible)="onVisible($event)">
 * 		</div>
 *
 */
@Directive({ selector: '[visibilityObserver]' })
export class VisibilityDirective implements OnInit, OnDestroy {
  @HostBinding('class.visible')
    isVisible = false;

  @Output() visible: EventEmitter<any> = new EventEmitter();

  observer!: ResizeObserver;

  /**
   * Throttle time in ms. Will emit this time after the resize.
   */
  @Input() resizeThrottle = 100;
  /**
   * Emit the initial visibility without waiting throttle time.
   */
  @Input() emitInitial = true;

  private previousOffsetHeight = 0;
  private previousOffsetWidth = 0;


  constructor(private element: ElementRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.runCheck();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  onVisibilityChange(): void {
    // trigger zone recalc for columns
    this.zone.run(() => {
      this.isVisible = true;
      this.visible.emit(true);
    });
  }

  runCheck(): void {
    const resizeEvent = new Observable((subscriber: Subscriber<ResizeObserverEntry[]>) => {
      this.observer = new ResizeObserver(_entries => {
        const { offsetHeight, offsetWidth } = this.element.nativeElement;
        if ((offsetWidth && offsetHeight) && ((offsetHeight !== this.previousOffsetHeight) || (offsetWidth !== this.previousOffsetWidth))) {
          // First time emit immediately once table is visible
          if (!this.isVisible && this.emitInitial) {
            this.onVisibilityChange();
          } else {
            subscriber.next();
          }
        }
        this.previousOffsetHeight = offsetHeight;
        this.previousOffsetWidth = offsetWidth;
      });
      
      this.observer.observe(this.element.nativeElement);
    });

    resizeEvent.pipe(
      debounceTime(this.resizeThrottle)
    ).subscribe(() => {
      this.onVisibilityChange();
    });
  }
}
