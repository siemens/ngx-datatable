import { PipeTransform, TemplateRef } from '@angular/core';

import { CellContext, HeaderCellContext, Row } from './public.types';

/**
 * Column property that indicates how to retrieve this column's
 * value from a row.
 * 'a.deep.value', 'normalprop', 0 (numeric)
 */
export type TableColumnProp = string | number;

/**
 * Column Type
 */
export interface TableColumn<TRow extends Row = any> {
  /**
   * Whether the column displays a selection checkbox. Only applies when selection mode is `checkbox`.
   */
  checkboxable?: boolean;

  /**
   * Whether the column is frozen to the left. Default value: `false`.
   */
  frozenLeft?: boolean;

  /**
   * Whether the column is frozen to the right. Default value: `false`.
   */
  frozenRight?: boolean;

  /**
   * Grow factor relative to other columns. Available extra width is distributed
   * proportionally according to all columns' `flexGrow` values. Default value: `0`.
   */
  flexGrow?: number;

  /**
   * Minimum column width in pixels.
   */
  minWidth?: number;

  /**
   * Maximum column width in pixels.
   */
  maxWidth?: number;

  /**
   * Default column width in pixels. Default value: `150`.
   */
  width?: number;

  /**
   * Whether the user can manually resize the column. Default value: `true`.
   */
  resizeable?: boolean;

  /**
   * Custom client-side sort comparator. It receives cell values and their
   * respective rows; a standard two-argument comparison function is also supported.
   */
  comparator?: (valueA: any, valueB: any, rowA: TRow, rowB: TRow) => number;

  /**
   * Custom pipe used to transform cell values.
   */
  pipe?: PipeTransform;

  /**
   * Whether row values can be sorted by this column. Default value: `true`.
   */
  sortable?: boolean;

  /**
   * Whether the column can be dragged to reorder it. Default value: `true`.
   */
  draggable?: boolean;

  /**
   * Whether the column can automatically resize to fill extra space. Default value: `true`.
   */
  canAutoResize?: boolean;

  /**
   * Column label. When omitted, the property value is used and decamelized.
   */
  name?: string;

  /**
   * Property used to bind row values. It can be a nested property path or a numeric index.
   *
   * When omitted, the name is converted to camel case.
   */
  prop?: TableColumnProp;

  /**
   * By default, the property is bound using normal data binding `<span>{{content}}</span>`.
   * If this property is set to true, the property will be bound as `<span [innerHTML]="content" />`.
   *
   * **DANGER** If enabling this feature, make sure the source of the data is trusted. This can be a vector for HTML injection attacks.
   */
  bindAsUnsafeHtml?: boolean;

  /**
   * Template used to render body cells.
   */
  cellTemplate?: TemplateRef<CellContext<TRow>>;

  /**
   * Ghost Cell template ref
   */
  ghostCellTemplate?: TemplateRef<any>;

  /**
   * Template used to render header cells.
   */
  headerTemplate?: TemplateRef<HeaderCellContext>;

  /**
   * Tree toggle template ref
   */
  treeToggleTemplate?: any;

  /**
   * CSS classes to apply to the body cell.
   */
  cellClass?:
    | string
    | ((data: {
        row: TRow;
        group?: TRow[];
        column: TableColumn<TRow>;
        value: any;
        rowHeight: number;
      }) => string | Record<string, boolean>);

  /**
   * CSS classes to apply to the header cell.
   */
  headerClass?: string | ((data: { column: TableColumn }) => string | Record<string, boolean>);

  /**
   * Whether the header displays a selection checkbox. Only applies when selection mode is `checkbox`.
   */
  headerCheckboxable?: boolean;

  /**
   * Is tree displayed on this column
   */
  isTreeColumn?: boolean;

  /**
   * Width of the tree level indent
   */
  treeLevelIndent?: number;

  /**
   * Summary function
   *
   * Null and undefined have different meanings:
   *  - undefined will use the default summary function
   *  - null will not compute a summary
   */
  summaryFunc?: ((cells: any[]) => any) | null;

  /**
   * Summary cell template ref
   */
  summaryTemplate?: TemplateRef<any>;
}
