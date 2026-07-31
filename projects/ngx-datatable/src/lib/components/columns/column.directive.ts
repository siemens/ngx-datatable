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
  /**
   * Column label. When omitted, the property value is used and decamelized.
   */
  readonly name = input<string>();

  /**
   * Property used to bind row values. When omitted, the name is converted to camel case.
   */
  readonly prop = input<TableColumnProp>();

  readonly bindAsUnsafeHtml = input(false, { transform: booleanAttribute });

  /**
   * Whether the column is frozen to the left. Default value: `false`.
   */
  readonly frozenLeft = input(false, { transform: booleanAttribute });

  /**
   * Whether the column is frozen to the right. Default value: `false`.
   */
  readonly frozenRight = input(false, { transform: booleanAttribute });

  /**
   * Grow factor relative to other columns. Available extra width is distributed
   * proportionally according to all columns' `flexGrow` values. Default value: `0`.
   */
  readonly flexGrow = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });

  /**
   * Whether the user can manually resize the column. Default value: `true`.
   */
  readonly resizeable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });

  /**
   * Custom client-side sort comparator. It receives cell values and their
   * respective rows; a standard two-argument comparison function is also supported.
   */
  readonly comparator = input<
    ((valueA: any, valueB: any, rowA: TRow, rowB: TRow) => number) | undefined
  >();

  /**
   * Custom pipe used to transform cell values.
   */
  readonly pipe = input<PipeTransform | undefined>();

  /**
   * Whether row values can be sorted by this column. Default value: `true`.
   */
  readonly sortable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });

  /**
   * Whether the column can be dragged to reorder it. Default value: `true`.
   */
  readonly draggable = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });

  /**
   * Whether the column can automatically resize to fill extra space. Default value: `true`.
   */
  readonly canAutoResize = input<boolean, boolean | string | undefined>(undefined, {
    transform: booleanAttribute
  });

  /**
   * Minimum column width in pixels.
   */
  readonly minWidth = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });

  /**
   * Default column width in pixels. Default value: `150`.
   */
  readonly width = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });

  /**
   * Maximum column width in pixels.
   */
  readonly maxWidth = input<number, number | string | undefined>(undefined, {
    transform: numberAttribute
  });

  /**
   * Whether the column displays a selection checkbox. Only applies when selection mode is `checkbox`.
   */
  readonly checkboxable = input(false, { transform: booleanAttribute });

  /**
   * Whether the header displays a selection checkbox. Only applies when selection mode is `checkbox`.
   */
  readonly headerCheckboxable = input(false, { transform: booleanAttribute });

  /**
   * CSS classes to apply to the header cell.
   */
  readonly headerClass = input<
    string | ((data: { column: TableColumn }) => string | Record<string, boolean>) | undefined
  >();

  /**
   * CSS classes to apply to the body cell.
   */
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
  readonly isTreeColumn = input(false, { transform: booleanAttribute });
  readonly treeLevelIndent = input<number | undefined>();
  readonly summaryFunc = input<((cells: any[]) => any) | undefined>();
  readonly summaryTemplate = input<TemplateRef<any> | undefined>();

  /**
   * Template used to render body cells.
   */
  readonly cellTemplateInput = input<TemplateRef<CellContext<TRow>> | undefined>(undefined, {
    alias: 'cellTemplate'
  });
  readonly cellTemplateQuery = contentChild(DataTableColumnCellDirective, { read: TemplateRef });

  /**
   * Template used to render header cells.
   */
  readonly headerTemplateInput = input<TemplateRef<HeaderCellContext> | undefined>(undefined, {
    alias: 'headerTemplate'
  });
  readonly headerTemplateQuery = contentChild(DataTableColumnHeaderDirective, {
    read: TemplateRef
  });

  readonly treeToggleTemplateInput = input<TemplateRef<any> | undefined>(undefined, {
    alias: 'treeToggleTemplate'
  });
  readonly treeToggleTemplateQuery = contentChild(DataTableColumnCellTreeToggle, {
    read: TemplateRef
  });

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
