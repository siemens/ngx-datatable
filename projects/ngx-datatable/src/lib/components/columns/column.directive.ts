import {
  booleanAttribute,
  computed,
  contentChild,
  Directive,
  input,
  numberAttribute,
  PipeTransform,
  Signal,
  TemplateRef
} from '@angular/core';

import { CellContext, HeaderCellContext, Row } from '../../types/public.types';
import { TableColumn, TableColumnProp } from '../../types/table-column.type';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnGhostCellDirective } from './column-ghost-cell.directive';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';

@Directive({
  selector: 'ngx-datatable-column'
})
export class DataTableColumnDirective<TRow extends Row> {
  /** Column label. If omitted, the property name is used and decamelized. */
  readonly name = input<string>();
  /** Row property to display. If omitted, it is derived from the column name. */
  readonly prop = input<TableColumnProp>();
  /** Render cell values as HTML. Only use with trusted content. */
  readonly bindAsUnsafeHtml = input(false, { transform: booleanAttribute });
  /** Pin this column to the left edge. */
  readonly frozenLeft = input(false, { transform: booleanAttribute });
  /** Pin this column to the right edge. */
  readonly frozenRight = input(false, { transform: booleanAttribute });
  /** Relative share of extra width in `flex` column mode. */
  readonly flexGrow = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });
  /** Allow users to resize this column. */
  readonly resizeable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });
  /** Custom client-side sort comparator. */
  readonly comparator = input<
    ((valueA: any, valueB: any, rowA: TRow, rowB: TRow) => number) | undefined
  >();
  /** Transform displayed cell values with an Angular pipe. */
  readonly pipe = input<PipeTransform | undefined>();
  /** Allow sorting by this column. */
  readonly sortable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });
  /** Allow dragging this column to reorder it. */
  readonly draggable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });
  /** Allow this column to resize automatically when the table width changes. */
  readonly canAutoResize = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });
  /** Minimum column width in pixels. */
  readonly minWidth = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });
  /** Column width in pixels. */
  readonly width = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });
  /** Maximum column width in pixels. */
  readonly maxWidth = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });
  /** Show a selection checkbox in each cell. */
  readonly checkboxable = input(false, { transform: booleanAttribute });
  /** Show a selection checkbox in the header. */
  readonly headerCheckboxable = input(false, { transform: booleanAttribute });
  /** CSS classes for the header cell. */
  readonly headerClass = input<
    string | ((data: { column: TableColumn }) => string | Record<string, boolean>) | undefined
  >();
  /** CSS classes for body cells. */
  readonly cellClass = input<
    | string
    | ((data: {
        row: TRow;
        group?: TRow[];
        column: TableColumn<TRow>;
        value: any;
        rowHeight: number;
      }) => string | Record<string, boolean>)
    | undefined
  >();
  /** Treat this column as the tree expand/collapse column. */
  readonly isTreeColumn = input(false, { transform: booleanAttribute });
  /** Indentation in pixels for each tree level. */
  readonly treeLevelIndent = input<number | undefined>();
  /** Function that computes the summary value for this column. */
  readonly summaryFunc = input<((cells: any[]) => any) | undefined>();
  /** Template for the summary cell. */
  readonly summaryTemplate = input<TemplateRef<any> | undefined>();

  /** Template for body cells. */
  readonly cellTemplateInput = input<TemplateRef<CellContext<TRow>> | undefined>(undefined, {
    alias: 'cellTemplate'
  });
  readonly cellTemplateQuery = contentChild(DataTableColumnCellDirective, { read: TemplateRef });

  /** Template for the header cell. */
  readonly headerTemplateInput = input<TemplateRef<HeaderCellContext> | undefined>(undefined, {
    alias: 'headerTemplate'
  });
  readonly headerTemplateQuery = contentChild(DataTableColumnHeaderDirective, {
    read: TemplateRef
  });

  /** Template for the tree toggle in body cells. */
  readonly treeToggleTemplateInput = input<TemplateRef<any> | undefined>(undefined, {
    alias: 'treeToggleTemplate'
  });
  readonly treeToggleTemplateQuery = contentChild(DataTableColumnCellTreeToggle, {
    read: TemplateRef
  });

  /** Template shown while a ghost loader is active. */
  readonly ghostCellTemplateInput = input<TemplateRef<void> | undefined>(undefined, {
    alias: 'ghostCellTemplate'
  });
  readonly ghostCellTemplateQuery = contentChild(DataTableColumnGhostCellDirective, {
    read: TemplateRef
  });

  /**
   * Computed property that returns the column configuration as a TableColumn object
   */
  readonly column: Signal<TableColumn<TRow>> = computed(() => ({
    name: this.name(),
    prop: this.prop(),
    bindAsUnsafeHtml: this.bindAsUnsafeHtml(),
    frozenLeft: this.frozenLeft(),
    frozenRight: this.frozenRight(),
    flexGrow: this.flexGrow(),
    resizeable: this.resizeable(),
    comparator: this.comparator(),
    pipe: this.pipe(),
    sortable: this.sortable(),
    draggable: this.draggable(),
    canAutoResize: this.canAutoResize(),
    minWidth: this.minWidth(),
    width: this.width(),
    maxWidth: this.maxWidth(),
    checkboxable: this.checkboxable(),
    headerCheckboxable: this.headerCheckboxable(),
    headerClass: this.headerClass(),
    cellClass: this.cellClass(),
    isTreeColumn: this.isTreeColumn(),
    treeLevelIndent: this.treeLevelIndent(),
    summaryFunc: this.summaryFunc(),
    summaryTemplate: this.summaryTemplate(),
    cellTemplate: this.cellTemplateInput() ?? this.cellTemplateQuery(),
    headerTemplate: this.headerTemplateInput() ?? this.headerTemplateQuery(),
    treeToggleTemplate: this.treeToggleTemplateInput() ?? this.treeToggleTemplateQuery(),
    ghostCellTemplate: this.ghostCellTemplateInput() ?? this.ghostCellTemplateQuery()
  }));
}
