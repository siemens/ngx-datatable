import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChildren
} from '@angular/core';

import {
  DatatableDraggableDirective,
  DragEvent
} from '../../directives/datatable-draggable.directive';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import {
  ColumnResizeEventInternal,
  InnerSortEvent,
  ReorderEventInternal,
  SortableTableColumnInternal,
  TableColumnInternal
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
import { toPublicColumn } from '../../utils/column-helper';
import { DataTableHeaderCellComponent } from './header-cell.component';

@Component({
  selector: 'datatable-header',
  imports: [NgStyle, DataTableHeaderCellComponent, DatatableDraggableDirective],
  template: `
    @let _columnGroupWidths = this._columnGroupWidths();
    <div
      role="row"
      class="datatable-header-inner"
      [class.horizontal-overflow]="innerWidth() < _columnGroupWidths.total"
      [style.width.px]="_columnGroupWidths.total"
    >
      @for (colGroup of _columnsByPin(); track colGroup.type) {
        @if (colGroup.columns.length) {
          <div
            class="datatable-row-group"
            [class]="'datatable-row-' + colGroup.type"
            [ngStyle]="_styleByGroup()[colGroup.type]"
          >
            @for (column of colGroup.columns; track column.$$id) {
              <datatable-header-cell
                role="columnheader"
                dragStartDelay="500"
                [datatableDraggable]="reorderable() && column.draggable"
                [dragModel]="column"
                [isTarget]="targetColumn() === column"
                [targetMarkerTemplate]="targetMarkerTemplate()"
                [targetMarkerContext]="targetMarkerContext()"
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
                (dragStart)="onDragStart($event)"
                (dragMove)="onDragMove($event)"
                (dragEnd)="onDragEnd($event)"
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
export class DataTableHeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly scrollbarHelper = inject(ScrollbarHelper);
  private readonly headerCells = viewChildren(DataTableHeaderCellComponent, { read: ElementRef });

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
  readonly headerHeight = input.required<'auto' | number>();
  readonly columns = input.required<TableColumnInternal[]>();

  readonly sort = output<SortEvent>();
  readonly reorder = output<ReorderEventInternal>();
  readonly resize = output<ColumnResizeEventInternal>();
  readonly resizing = output<ColumnResizeEventInternal>();
  readonly select = output<void>();
  readonly columnContextmenu = output<{
    event: MouseEvent;
    column: TableColumnInternal;
  }>();

  readonly _columnsByPin = computed(() => columnsByPinArr(this.columns()));
  readonly _columnGroupWidths = computed(() => {
    const colsByPin = columnsByPin(this.columns());
    return columnGroupWidths(colsByPin, this.columns());
  });
  readonly _styleByGroup = computed(() => ({
    left: this.calcStylesByGroup('left'),
    center: this.calcStylesByGroup('center'),
    right: this.calcStylesByGroup('right')
  }));
  readonly headerWidth = computed(() => {
    if (this.scrollbarH()) {
      const width = this.verticalScrollVisible()
        ? this.innerWidth() - this.scrollbarHelper.width
        : this.innerWidth();
      return width + 'px';
    }

    return '100%';
  });
  readonly columnGroups = computed(() => this._columnsByPin());
  private readonly renderedColumns = computed(() =>
    this.columnGroups().flatMap(group => group.columns)
  );

  private dragInitialIndex?: number;
  private dragTargetIndex?: number;
  readonly targetColumn = signal<TableColumnInternal | undefined>(undefined);
  readonly targetMarkerContext = signal<{ class: string } | undefined>(undefined);

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
      prevValue: column.width(),
      newValue: width
    };
  }

  onDragStart({ model }: DragEvent): void {
    this.dragInitialIndex = model ? this.renderedColumns().indexOf(model) : undefined;
  }

  onDragMove(event: DragEvent): void {
    const targetIndex = this.getDragTargetIndex(event);
    if (targetIndex !== this.dragTargetIndex) {
      if (this.dragTargetIndex !== undefined) {
        this.targetColumn.set(undefined);
        this.targetMarkerContext.set(undefined);
      }

      if (targetIndex !== undefined && this.dragInitialIndex !== undefined) {
        this.targetColumn.set(this.renderedColumns()[targetIndex]);
        if (this.dragInitialIndex !== targetIndex) {
          this.targetMarkerContext.set({
            class: `targetMarker ${this.dragInitialIndex > targetIndex ? 'dragFromRight' : 'dragFromLeft'}`
          });
        }
      }
      this.dragTargetIndex = targetIndex;
    }

    event.element.style.transform = `translateX(${event.currentX - event.initialX}px)`;
  }

  onDragEnd(event: DragEvent): void {
    event.element.style.transform = '';

    const targetIndex = this.getDragTargetIndex(event);
    if (this.dragTargetIndex !== undefined) {
      this.targetColumn.set(undefined);
      this.targetMarkerContext.set(undefined);
    }

    if (event.model && this.dragInitialIndex !== undefined && targetIndex !== undefined) {
      this.reorder.emit({
        prevValue: this.dragInitialIndex,
        newValue: targetIndex,
        column: event.model
      });
    }

    this.dragInitialIndex = undefined;
    this.dragTargetIndex = undefined;
  }

  private getDragTargetIndex({ currentX, currentY, element }: DragEvent): number | undefined {
    const elementsAtPoint = this.document.elementsFromPoint(currentX, currentY);
    const index = this.headerCells().findIndex(
      cell => cell.nativeElement !== element && elementsAtPoint.includes(cell.nativeElement)
    );
    return index === -1 ? undefined : index;
  }

  onSort({ column, prevValue, newValue }: InnerSortEvent): void {
    // if we are dragging don't sort!
    if (column.dragging) {
      return;
    }

    const sorts = this.calcNewSorts(column, prevValue, newValue);
    this.sort.emit({
      sorts,
      column: toPublicColumn(column),
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
      if (this.sortType() === 'single') {
        sorts.splice(0, this.sorts().length);
      }

      sorts.push({ dir: newValue, prop: column.prop });
    }

    return sorts;
  }

  calcStylesByGroup(group: 'center' | 'right' | 'left'): NgStyle['ngStyle'] {
    const widths = this._columnGroupWidths();
    return { width: `${widths[group]}px` };
  }
}
