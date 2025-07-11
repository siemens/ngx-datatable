import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  input,
  output,
  numberAttribute,
  computed,
  booleanAttribute
} from '@angular/core';
import { fromEvent, Subscription, takeUntil } from 'rxjs';

import {
  InnerSortEvent,
  SortableTableColumnInternal,
  TableColumnInternal
} from '../../types/internal.types';
import {
  HeaderCellContext,
  SelectionType,
  SortDirection,
  SortPropDir,
  SortType
} from '../../types/public.types';
import { getPositionFromEvent } from '../../utils/events';
import { nextSortDir } from '../../utils/sort';

@Component({
  selector: 'datatable-header-cell',
  imports: [NgTemplateOutlet],
  template: `
    <div class="datatable-header-cell-template-wrap">
      @if (isTarget()) {
        <ng-template
          [ngTemplateOutlet]="targetMarkerTemplate()!"
          [ngTemplateOutletContext]="targetMarkerContext()"
        />
      }
      @if (isCheckboxable()) {
        <label class="datatable-checkbox">
          <input
            type="checkbox"
            [attr.aria-label]="ariaHeaderCheckboxMessage()"
            [checked]="allRowsSelected()"
            (change)="select.emit()"
          />
        </label>
      }
      @let column = this.column();
      @if (column.headerTemplate) {
        <ng-template
          [ngTemplateOutlet]="column.headerTemplate"
          [ngTemplateOutletContext]="cellContext()"
        />
      } @else {
        <span class="datatable-header-cell-wrapper">
          <span class="datatable-header-cell-label draggable" (click)="onSort()">
            {{ name() }}
          </span>
        </span>
      }
      <span [class]="sortClass()" (click)="onSort()"> </span>
    </div>
    @if (showResizeHandle()) {
      <span
        class="resize-handle"
        (mousedown)="onMousedown($event)"
        (touchstart)="onMousedown($event)"
      ></span>
    }
  `,
  styleUrl: './header-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.resizeable]': 'showResizeHandle()',
    '[attr.title]': 'name()',
    '[attr.tabindex]': 'column().sortable ? 0 : -1',
    '[class]': 'columnCssClasses()',
    '[style.height.px]': 'headerHeight()',
    '[style.minWidth.px]': 'column().minWidth',
    '[style.maxWidth.px]': 'column().maxWidth',
    '[style.width.px]': 'column().width',
    '(contextmenu)': 'onContextmenu($event)',
    '(keydown.enter)': 'enter()'
  }
})
export class DataTableHeaderCellComponent implements OnInit, OnDestroy {
  readonly sortType = input.required<SortType>();
  readonly sortAscendingIcon = input<string>();
  readonly sortDescendingIcon = input<string>();
  readonly sortUnsetIcon = input<string>();

  readonly isTarget = input<boolean>();
  readonly showResizeHandle = input<boolean | undefined>(true);
  readonly targetMarkerTemplate = input<TemplateRef<any>>();
  readonly targetMarkerContext = input<any>();
  readonly enableClearingSortState = input(false);
  readonly ariaHeaderCheckboxMessage = input.required<string>();
  readonly allRowsSelected = input(false, { transform: booleanAttribute });
  readonly selectionType = input<SelectionType>();
  readonly column = input.required<TableColumnInternal>();
  readonly headerHeight = input.required<number, number>({
    transform: numberAttribute
  });
  readonly sorts = input<SortPropDir[]>([]);

  readonly sort = output<InnerSortEvent>();
  readonly select = output<void>();
  readonly columnContextmenu = output<{
    event: MouseEvent;
    column: TableColumnInternal;
  }>();
  readonly resize = output<{ width: number; column: TableColumnInternal }>();
  readonly resizing = output<{ width: number; column: TableColumnInternal }>();

  protected readonly columnCssClasses = computed(() => {
    let cls = 'datatable-header-cell';
    const column = this.column();
    if (column.sortable) {
      cls += ' sortable';
    }
    if (this.showResizeHandle()) {
      cls += ' resizeable';
    }
    if (column.headerClass) {
      if (typeof column.headerClass === 'string') {
        cls += ' ' + column.headerClass;
      } else if (typeof column.headerClass === 'function') {
        const res = column.headerClass({
          column
        });

        if (typeof res === 'string') {
          cls += ' ' + res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) {
              cls += ` ${k}`;
            }
          }
        }
      }
    }

    const sortDir = this.sortDir();
    if (sortDir) {
      cls += ` sort-active sort-${sortDir}`;
    }

    return cls;
  });

  protected readonly name = computed(() => {
    // guaranteed to have a value by setColumnDefaults() in column-helper.ts
    return this.column().headerTemplate === undefined ? this.column().name : undefined;
  });

  protected readonly isCheckboxable = computed(() => this.column().headerCheckboxable);

  protected readonly sortClass = computed<string | undefined>(() => {
    return this.calcSortClass(this.sortDir());
  });
  private readonly sortDir = computed<SortDirection | undefined>(() => {
    return this.calcSortDir(this.sorts());
  });

  protected readonly cellContext = computed<HeaderCellContext>(() => {
    return {
      column: this.column(),
      sortDir: this.sortDir(),
      sortFn: () => this.onSort(),
      allRowsSelected: this.allRowsSelected(),
      selectFn: () => this.select.emit()
    };
  });

  private element = inject(ElementRef).nativeElement;
  private subscription?: Subscription;

  protected onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({ event: $event, column: this.column() });
    if (this.column().draggable) {
      $event.preventDefault();
    }
  }

  protected enter(): void {
    this.onSort();
  }

  ngOnInit() {
    // If there is already a default sort then start the counter with 1.
    if (this.sortDir()) {
      this.totalSortStatesApplied = 1;
    }
  }

  ngOnDestroy() {
    this.destroySubscription();
  }

  private calcSortDir(sorts: SortPropDir[]): any {
    if (sorts && this.column()) {
      const sort = sorts.find((s: any) => s.prop === this.column().prop);

      if (sort) {
        return sort.dir;
      }
    }
  }
  // Counter to reset sort once user sort asc and desc.
  private totalSortStatesApplied = 0;
  protected onSort(): void {
    if (!this.column().sortable) {
      return;
    }

    this.totalSortStatesApplied++;
    let newValue = nextSortDir(this.sortType(), this.sortDir());
    // User has done both direction sort so we reset the next sort.
    if (this.enableClearingSortState() && this.totalSortStatesApplied === 3) {
      newValue = undefined;
      this.totalSortStatesApplied = 0;
    }
    this.sort.emit({
      column: this.column() as SortableTableColumnInternal<any>,
      prevValue: this.sortDir(),
      newValue
    });
  }

  private calcSortClass(sortDir: SortDirection | undefined): string | undefined {
    if (!this.cellContext().column.sortable) {
      return undefined;
    }
    if (sortDir === SortDirection.asc) {
      return `sort-btn sort-asc ${this.sortAscendingIcon() ?? 'datatable-icon-up'}`;
    } else if (sortDir === SortDirection.desc) {
      return `sort-btn sort-desc ${this.sortDescendingIcon() ?? 'datatable-icon-down'}`;
    } else {
      return `sort-btn ${this.sortUnsetIcon() ?? 'datatable-icon-sort-unset'}`;
    }
  }

  protected onMousedown(event: MouseEvent | TouchEvent): void {
    const isMouse = event instanceof MouseEvent || event.type === 'mousedown';
    const initialWidth = this.element.clientWidth;
    const { screenX } = getPositionFromEvent(event);
    event.stopPropagation();

    const mouseup = fromEvent<MouseEvent | TouchEvent>(document, isMouse ? 'mouseup' : 'touchend');
    this.subscription = mouseup.subscribe(() => this.onMouseup());

    const mouseMoveSub = fromEvent<MouseEvent | TouchEvent>(
      document,
      isMouse ? 'mousemove' : 'touchmove'
    )
      .pipe(takeUntil(mouseup))
      .subscribe((e: MouseEvent | TouchEvent) => this.move(e, initialWidth, screenX));

    this.subscription.add(mouseMoveSub);
  }

  private onMouseup(): void {
    if (this.subscription && !this.subscription.closed) {
      this.destroySubscription();
      this.resize.emit({ width: this.element.clientWidth, column: this.column() });
    }
  }

  private move(
    event: MouseEvent | TouchEvent,
    initialWidth: number,
    mouseDownScreenX: number
  ): void {
    const movementX = getPositionFromEvent(event).screenX - mouseDownScreenX;
    const newWidth = initialWidth + movementX;
    this.resizing.emit({ width: newWidth, column: this.column() });
  }

  private destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
