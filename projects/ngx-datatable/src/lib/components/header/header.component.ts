import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  input,
  numberAttribute,
  computed,
  output
} from '@angular/core';

import { DraggableDirective } from '../../directives/draggable.directive';
import { OrderableDirective } from '../../directives/orderable.directive';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import {
  ColumnResizeEventInternal,
  InnerSortEvent,
  PinnedColumns,
  ReorderEventInternal,
  SortableTableColumnInternal,
  TableColumnInternal,
  TargetChangedEvent
} from '../../types/internal.types';
import {
  Row,
  SelectionType,
  SortDirection,
  SortEvent,
  SortPropDir,
  SortType
} from '../../types/public.types';
import { columnGroupWidths, columnsByPin, columnsByPinArr } from '../../utils/column';
import { DataTableHeaderCellComponent } from './header-cell.component';

@Component({
  selector: 'datatable-header',
  imports: [OrderableDirective, NgStyle, DataTableHeaderCellComponent, NgClass, DraggableDirective],
  template: `
    <div
      role="row"
      orderable
      class="datatable-header-inner"
      [class.horizontal-overflow]="innerWidth() < _columnGroupWidths.total"
      [style.width.px]="_columnGroupWidths.total"
      (reorder)="onColumnReordered($event)"
      (targetChanged)="onTargetChanged($event)"
    >
      @for (colGroup of _columnsByPin; track colGroup.type) {
        @if (colGroup.columns.length) {
          <div
            class="datatable-row-group"
            [ngClass]="'datatable-row-' + colGroup.type"
            [ngStyle]="_styleByGroup[colGroup.type]"
          >
            @for (column of colGroup.columns; track column.$$id) {
              <datatable-header-cell
                role="columnheader"
                dragStartDelay="500"
                [draggable]="reorderable() && column.draggable"
                [dragModel]="column"
                [headerHeight]="headerHeight()"
                [isTarget]="column.isTarget"
                [targetMarkerTemplate]="targetMarkerTemplate()"
                [targetMarkerContext]="column.targetMarkerContext"
                [column]="column"
                [showResizeHandle]="lastColumnId() !== column.$$id && column.resizeable"
                [sortType]="sortType()"
                [sorts]="sorts()"
                [selectionType]="selectionType()"
                [sortAscendingIcon]="sortAscendingIcon()"
                [sortDescendingIcon]="sortDescendingIcon()"
                [sortUnsetIcon]="sortUnsetIcon()"
                [allRowsSelected]="allRowsSelected()"
                [enableClearingSortState]="enableClearingSortState()"
                [ariaHeaderCheckboxMessage]="ariaHeaderCheckboxMessage()"
                (resize)="onColumnResized($event)"
                (resizing)="onColumnResizing($event)"
                (sort)="onSort($event)"
                (select)="select.emit($event)"
                (columnContextmenu)="columnContextmenu.emit($event)"
              />
            }
          </div>
        }
      }
    </div>
  `,
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-header',
    '[style.height.px]': 'headerHeight()',
    '[style.width]': 'headerWidth()'
  }
})
export class DataTableHeaderComponent implements OnDestroy, OnChanges {
  private cd = inject(ChangeDetectorRef);
  private scrollbarHelper = inject(ScrollbarHelper);

  readonly lastColumnId = computed(() => this.columns().at(-1)?.$$id);

  readonly sortAscendingIcon = input<string>();
  readonly sortDescendingIcon = input<string>();
  readonly sortUnsetIcon = input<string>();
  readonly scrollbarH = input<boolean>();
  readonly dealsWithGroup = input<boolean>();
  readonly targetMarkerTemplate = input<TemplateRef<unknown>>();
  readonly enableClearingSortState = input(false);
  readonly innerWidth = input.required<number>();
  readonly sorts = input.required<SortPropDir[]>();
  readonly sortType = input.required<SortType>();
  readonly allRowsSelected = input<boolean>();
  readonly selectionType = input<SelectionType>();
  readonly reorderable = input<boolean>();
  readonly verticalScrollVisible = input(false);
  readonly ariaHeaderCheckboxMessage = input.required<string>();

  dragEventTarget?: MouseEvent | TouchEvent;

  readonly headerHeight = input.required({
    transform: numberAttribute
  });
  readonly columns = input.required<TableColumnInternal[]>();
  readonly offsetX = input<number>();

  readonly sort = output<SortEvent>();
  readonly reorder = output<ReorderEventInternal>();
  readonly resize = output<ColumnResizeEventInternal>();
  readonly resizing = output<ColumnResizeEventInternal>();
  readonly select = output<void>();
  readonly columnContextmenu = output<{
    event: MouseEvent;
    column: TableColumnInternal;
  }>();

  _columnsByPin!: PinnedColumns[];
  _columnGroupWidths: any = {
    total: 100
  };
  _styleByGroup: {
    left: NgStyle['ngStyle'];
    center: NgStyle['ngStyle'];
    right: NgStyle['ngStyle'];
  } = { left: {}, center: {}, right: {} };

  private destroyed = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.verticalScrollVisible) {
      this._styleByGroup.right = this.calcStylesByGroup('right');
      if (!this.destroyed) {
        this.cd.detectChanges();
      }
    }

    if (changes.offsetX) {
      this.setStylesByGroup();
    }

    if (changes.columns || changes.innerWidth) {
      const colsByPin = columnsByPin(this.columns());
      this._columnsByPin = columnsByPinArr(this.columns());
      //setTimeout(() => {
      this._columnGroupWidths = columnGroupWidths(colsByPin, this.columns());
      this.setStylesByGroup();
      //});
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  readonly headerWidth = computed(() => {
    if (this.scrollbarH()) {
      const width = this.verticalScrollVisible()
        ? this.innerWidth() - this.scrollbarHelper.width
        : this.innerWidth();
      return width + 'px';
    }

    return '100%';
  });

  onColumnResized({ width, column }: { width: number; column: TableColumnInternal }): void {
    this.resize.emit(this.makeResizeEvent(width, column));
  }

  onColumnResizing({ width, column }: { width: number; column: TableColumnInternal }): void {
    this.resizing.emit(this.makeResizeEvent(width, column));
  }

  private makeResizeEvent(
    width: number,
    column: TableColumnInternal<Row>
  ): ColumnResizeEventInternal {
    if (column.minWidth && width <= column.minWidth) {
      width = column.minWidth;
    } else if (column.maxWidth && width >= column.maxWidth) {
      width = column.maxWidth;
    }
    return {
      column,
      prevValue: column.width,
      newValue: width
    };
  }

  onColumnReordered(event: ReorderEventInternal): void {
    const column = this.getColumn(event.newValue);
    column.isTarget = false;
    column.targetMarkerContext = undefined;
    this.reorder.emit(event);
  }

  onTargetChanged({ prevIndex, newIndex, initialIndex }: TargetChangedEvent): void {
    if (prevIndex || prevIndex === 0) {
      const oldColumn = this.getColumn(prevIndex);
      oldColumn.isTarget = false;
      oldColumn.targetMarkerContext = undefined;
    }
    if (newIndex || newIndex === 0) {
      const newColumn = this.getColumn(newIndex);
      newColumn.isTarget = true;

      if (initialIndex !== newIndex) {
        newColumn.targetMarkerContext = {
          class: 'targetMarker '.concat(initialIndex > newIndex ? 'dragFromRight' : 'dragFromLeft')
        };
      }
    }
  }

  getColumn(index: number): any {
    const leftColumnCount = this._columnsByPin[0].columns.length;
    if (index < leftColumnCount) {
      return this._columnsByPin[0].columns[index];
    }

    const centerColumnCount = this._columnsByPin[1].columns.length;
    if (index < leftColumnCount + centerColumnCount) {
      return this._columnsByPin[1].columns[index - leftColumnCount];
    }

    return this._columnsByPin[2].columns[index - leftColumnCount - centerColumnCount];
  }

  onSort({ column, prevValue, newValue }: InnerSortEvent): void {
    // if we are dragging don't sort!
    if (column.dragging) {
      return;
    }

    const sorts = this.calcNewSorts(column, prevValue, newValue);
    this.sort.emit({
      sorts,
      column,
      prevValue,
      newValue
    });
  }

  calcNewSorts(
    column: SortableTableColumnInternal,
    prevValue: SortDirection | undefined,
    newValue: SortDirection | undefined
  ): SortPropDir[] {
    let idx = 0;

    const sorts = this.sorts().map((s, i) => {
      s = { ...s };
      if (s.prop === column.prop) {
        idx = i;
      }
      return s;
    });

    if (newValue === undefined) {
      sorts.splice(idx, 1);
    } else if (prevValue) {
      sorts[idx].dir = newValue;
    } else {
      if (this.sortType() === SortType.single) {
        sorts.splice(0, this.sorts().length);
      }

      sorts.push({ dir: newValue, prop: column.prop });
    }

    return sorts;
  }

  setStylesByGroup() {
    this._styleByGroup.left = this.calcStylesByGroup('left');
    this._styleByGroup.center = this.calcStylesByGroup('center');
    this._styleByGroup.right = this.calcStylesByGroup('right');
    if (!this.destroyed) {
      this.cd.detectChanges();
    }
  }

  calcStylesByGroup(group: 'center' | 'right' | 'left'): NgStyle['ngStyle'] {
    const widths = this._columnGroupWidths;

    if (group === 'center') {
      return {
        transform: `translateX(${(this.offsetX() ?? 0) * -1}px)`,
        width: `${widths[group]}px`,
        willChange: 'transform'
      };
    }

    return {
      width: `${widths[group]}px`
    };
  }
}
