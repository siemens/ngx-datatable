import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  signal,
  TemplateRef
} from '@angular/core';
import { columnGroupWidths, columnsByPin, columnsByPinArr } from '../../utils/column';
import {
  ColumnResizeEvent,
  InnerSortEvent,
  ReorderEvent,
  SelectionType,
  SortDirection,
  SortEvent,
  SortPropDir,
  SortType
} from '../../types/public.types';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { TableColumn } from '../../types/table-column.type';
import {
  ColumnGroupWidth,
  OrderableReorderEvent,
  PinnedColumns,
  TargetChangedEvent
} from '../../types/internal.types';
import { DraggableDirective } from '../../directives/draggable.directive';
import { LongPressDirective } from '../../directives/long-press.directive';
import { ResizeableDirective } from '../../directives/resizeable.directive';
import { DataTableHeaderCellComponent } from './header-cell.component';
import { OrderableDirective } from '../../directives/orderable.directive';

@Component({
  selector: 'datatable-header',
  template: `
    <div
      role="row"
      orderable
      (reorder)="onColumnReordered($event)"
      (targetChanged)="onTargetChanged($event)"
      [style.width.px]="_columnGroupWidths().total"
      class="datatable-header-inner"
    >
      @for (colGroup of _columnsByPin; track colGroup.type) {
        <div
          [class]="'datatable-row-' + colGroup.type"
          [style.width.px]="_columnGroupWidths()[colGroup.type]"
        >
          @for (column of colGroup.columns; track column.$$id) {
            <datatable-header-cell
              role="columnheader"
              resizeable
              [resizeEnabled]="column.resizeable"
              (resize)="onColumnResized($event, column)"
              (resizing)="onColumnResizing($event, column)"
              long-press
              [pressModel]="column"
              [pressEnabled]="reorderable && column.draggable"
              (longPressStart)="onLongPressStart($event)"
              (longPressEnd)="onLongPressEnd($event)"
              draggable
              [dragX]="reorderable && column.draggable && column.dragging"
              [dragY]="false"
              [dragModel]="column"
              [dragEventTarget]="dragEventTarget"
              [headerHeight]="headerHeight"
              [isTarget]="column.isTarget"
              [targetMarkerTemplate]="targetMarkerTemplate"
              [targetMarkerContext]="column.targetMarkerContext"
              [column]="column"
              [sortType]="sortType"
              [sorts]="sorts"
              [selectionType]="selectionType"
              [sortAscendingIcon]="sortAscendingIcon"
              [sortDescendingIcon]="sortDescendingIcon"
              [sortUnsetIcon]="sortUnsetIcon"
              [allRowsSelected]="allRowsSelected"
              [enableClearingSortState]="enableClearingSortState"
              (sort)="onSort($event)"
              (select)="select.emit($event)"
              (columnContextmenu)="columnContextmenu.emit($event)"
            >
            </datatable-header-cell>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'datatable-header'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    OrderableDirective,
    DataTableHeaderCellComponent,
    ResizeableDirective,
    LongPressDirective,
    DraggableDirective
  ]
})
export class DataTableHeaderComponent {
  private scrollbarHelper = inject(ScrollbarHelper);

  @Input() sortAscendingIcon: string;
  @Input() sortDescendingIcon: string;
  @Input() sortUnsetIcon: string;
  @Input() scrollbarH: boolean;
  @Input() dealsWithGroup: boolean;
  @Input() targetMarkerTemplate: TemplateRef<unknown>;
  @Input() enableClearingSortState = false;

  @Input() set innerWidth(val: number) {
    this._innerWidth = val;
    setTimeout(() => {
      if (this._columns) {
        const colByPin = columnsByPin(this._columns);
        this._columnGroupWidths.set(columnGroupWidths(colByPin, this._columns));
      }
    });
  }

  get innerWidth(): number {
    return this._innerWidth;
  }

  @Input() sorts: SortPropDir[];
  @Input() sortType: SortType;
  @Input() allRowsSelected: boolean;
  @Input() selectionType: SelectionType;
  @Input() reorderable: boolean;
  @Input() verticalScrollVisible = false;

  dragEventTarget?: MouseEvent;

  @HostBinding('style.height')
  @Input()
  set headerHeight(val: any) {
    if (val !== 'auto') {
      this._headerHeight = `${val}px`;
    } else {
      this._headerHeight = val;
    }
  }

  get headerHeight(): any {
    return this._headerHeight;
  }

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;

    const colsByPin = columnsByPin(val);
    this._columnsByPin = columnsByPinArr(val);
    setTimeout(() => {
      this._columnGroupWidths.set(columnGroupWidths(colsByPin, val));
    });
  }

  get columns(): any[] {
    return this._columns;
  }

  @Output() sort: EventEmitter<SortEvent> = new EventEmitter();
  @Output() reorder: EventEmitter<ReorderEvent> = new EventEmitter();
  @Output() resize: EventEmitter<ColumnResizeEvent> = new EventEmitter();
  @Output() resizing: EventEmitter<ColumnResizeEvent> = new EventEmitter();
  @Output() select: EventEmitter<void> = new EventEmitter();
  @Output() columnContextmenu = new EventEmitter<{ event: MouseEvent; column: TableColumn }>(false);

  _columnsByPin: PinnedColumns[];
  _columnGroupWidths = signal<ColumnGroupWidth>({
    left: 0,
    center: 0,
    right: 0,
    total: 100
  });
  _innerWidth: number;
  _columns: TableColumn[];
  _headerHeight: string;

  onLongPressStart({ event, model }: { event: MouseEvent; model: TableColumn }) {
    model.dragging = true;
    this.dragEventTarget = event;
  }

  onLongPressEnd({ model }: { model: TableColumn }) {
    this.dragEventTarget = undefined;

    // delay resetting so sort can be
    // prevented if we were dragging
    setTimeout(() => {
      // datatable component creates copies from columns on reorder
      // set dragging to false on new objects
      const column = this._columns.find(c => c.$$id === model.$$id);
      if (column && 'dragging' in column) {
        column.dragging = false;
      }
    }, 5);
  }

  @HostBinding('style.width')
  get headerWidth(): string {
    if (this.scrollbarH) {
      const width = this.verticalScrollVisible
        ? this.innerWidth - this.scrollbarHelper.width
        : this.innerWidth;
      return width + 'px';
    }

    return '100%';
  }

  onColumnResized(width: number, column: TableColumn): void {
    this.resize.emit(this.makeResizeEvent(width, column));
  }

  onColumnResizing(width: number, column: TableColumn): void {
    this.resizing.emit(this.makeResizeEvent(width, column));
  }

  private makeResizeEvent(width: number, column: TableColumn): ColumnResizeEvent {
    if (width <= column.minWidth) {
      width = column.minWidth;
    } else if (width >= column.maxWidth) {
      width = column.maxWidth;
    }
    return {
      column,
      prevValue: column.width,
      newValue: width
    };
  }

  onColumnReordered({ prevIndex, newIndex, model }: OrderableReorderEvent): void {
    const column = this.getColumn(newIndex);
    column.isTarget = false;
    column.targetMarkerContext = undefined;
    this.reorder.emit({
      column: model,
      prevValue: prevIndex,
      newValue: newIndex
    });
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
    column: TableColumn,
    prevValue: SortDirection,
    newValue: SortDirection
  ): SortPropDir[] {
    let idx = 0;

    if (!this.sorts) {
      this.sorts = [];
    }

    const sorts = this.sorts.map((s, i) => {
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
      if (this.sortType === SortType.single) {
        sorts.splice(0, this.sorts.length);
      }

      sorts.push({ dir: newValue, prop: column.prop });
    }

    return sorts;
  }
}
