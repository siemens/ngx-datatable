import { computed, linkedSignal, signal } from '@angular/core';

import {
  Group,
  Row,
  RowOrGroup,
  SelectionType,
  SortPropDir,
  SortType
} from '../types/public.types';
import { TableColumn } from '../types/table-column.type';
import {
  gridColumnTemplate,
  columnGroupWidths,
  columnsByPin,
  columnsByPinArr
} from '../utils/column';
import { toInternalColumn } from '../utils/column-helper';
import { RowHeightCache } from '../utils/row-height-cache';
import { sortGroupedRows, sortRows } from '../utils/sort';
import { groupRowsByParents, optionalGetterForProp } from '../utils/tree';
import type { DatatableComponent } from './datatable.component';

/**
 * Internal source of truth for table data, paging, dimensions, and viewport projection.
 * This class deliberately is not part of the library's public API.
 */
/** @internal */
export class TableController<TRow extends Row = any> {
  readonly dimensions = signal<Pick<DOMRect, 'width' | 'height'>>(
    { height: 0, width: 0 },
    { equal: (a, b) => a.width === b.width && a.height === b.height }
  );
  readonly offsetX = signal(0);
  readonly offsetY = signal(0);
  readonly verticalScrollVisible = signal(false);
  readonly rowExpansions = signal<TRow[]>([]);
  readonly groupExpansions = signal<Group<TRow>[]>([]);

  private readonly rowChangeVersion = signal(0);
  private readonly measuredHeaderHeight = signal(0);

  readonly columns = linkedSignal(() =>
    toInternalColumn(
      this.datatable.columnTemplates().length
        ? this.datatable.columnTemplates().map(column => column.column())
        : (this.datatable.columns() ?? []),
      this.datatable.datatableConfiguration.configuration().defaultColumnWidth
    )
  );

  readonly innerWidth = computed(() => this.dimensions().width);
  readonly bodyHeight = computed(() => {
    if (!this.datatable.scrollbarV()) {
      return 0;
    }
    const configuredHeaderHeight = this.datatable.headerHeight();
    const headerHeight =
      configuredHeaderHeight === 'auto' ? this.measuredHeaderHeight() : configuredHeaderHeight;
    return this.dimensions().height - headerHeight - this.datatable.footerHeight();
  });
  readonly viewportRowCount = computed(() => {
    const rowHeight = this.datatable.rowHeight();
    if (typeof rowHeight !== 'number') {
      return 0;
    }
    return Math.max(Math.ceil(this.bodyHeight() / rowHeight), 0);
  });

  readonly rows = computed(() => {
    this.rowChangeVersion();
    let rows = this.datatable.rows()?.slice() ?? [];
    const sorts = this.datatable.sorts();

    if (sorts.length && !this.datatable.externalSorting()) {
      rows = sortRows(rows, this.columns(), sorts);
    }

    const treeFromRelation = this.datatable.treeFromRelation();
    const treeToRelation = this.datatable.treeToRelation();
    if (treeFromRelation && treeToRelation) {
      rows = groupRowsByParents(
        rows,
        optionalGetterForProp(treeFromRelation),
        optionalGetterForProp(treeToRelation)
      );
    }

    if (
      this.datatable.ghostLoadingIndicator() &&
      this.datatable.scrollbarV() &&
      !this.datatable.externalPaging()
    ) {
      const ghostRowCount = Math.max(this.viewportRowCount() - rows.length, 1);
      for (let i = 0; i < ghostRowCount; i++) {
        rows.push(undefined);
      }
    }

    return rows;
  });

  readonly groupedRows = computed(() => {
    let groupedRows = this.datatable.groupedRows();
    const groupRowsBy = this.datatable.groupRowsBy();

    if (!groupedRows && groupRowsBy) {
      this.rowChangeVersion();
      groupedRows = this.groupArrayBy(this.datatable.rows() ?? [], groupRowsBy);
    }
    if (!groupedRows) {
      return undefined;
    }

    const sorts = this.datatable.sorts();
    if (sorts.length && !this.datatable.externalSorting() && groupedRows.length) {
      groupedRows = sortGroupedRows(
        groupedRows,
        this.columns(),
        sorts,
        sorts.find(sortColumn => sortColumn.prop === groupRowsBy)
      );
    }
    return groupedRows;
  });

  readonly rowCount = computed(() => {
    if (this.datatable.externalPaging()) {
      return this.datatable.count();
    }
    return this.groupedRows()?.length ?? this.rows().length;
  });

  readonly pageSize = computed(() => {
    if (this.datatable.scrollbarV() && this.datatable.virtualization()) {
      return this.viewportRowCount();
    }
    return this.datatable.limit() ?? this.rows().length;
  });

  readonly offset = computed(() => {
    const pageSize = this.pageSize();
    return Math.max(
      Math.min(this.datatable.offset(), Math.ceil(this.rowCount() / pageSize) - 1),
      0
    );
  });

  readonly rowHeightsCache = computed(() => {
    const cache = new RowHeightCache<TRow>();
    if (!this.datatable.scrollbarV() || !this.datatable.virtualization()) {
      return cache;
    }

    const rows = this.rows();
    if (rows.length) {
      cache.initCache({
        rows: rows as TRow[],
        rowHeight: this.datatable.rowHeight(),
        detailRowHeight: this.detailRowHeight(),
        externalVirtual: this.datatable.externalPaging(),
        indexOffset: this.datatable.externalPaging() ? this.offset() * this.pageSize() : 0,
        rowCount: this.rowCount(),
        rowExpansions: new Set(this.datatable.rowDetail ? this.rowExpansions() : [])
      });
    }
    return cache;
  });

  readonly indexes = computed(() => {
    let first = 0;
    let last = this.rowCount();

    if (this.datatable.scrollbarV() && this.datatable.virtualization()) {
      first = this.rowHeightsCache().getRowIndex(this.offsetY());
      last = this.rowHeightsCache().getRowIndex(this.bodyHeight() + this.offsetY()) + 1;
    } else if (!this.datatable.scrollbarV()) {
      if (!this.datatable.externalPaging()) {
        first = Math.max(this.offset() * this.pageSize(), 0);
      }
      last = Math.min(first + this.pageSize(), this.rowCount());
    }

    return { first, last };
  });

  readonly rowsToRender = computed<(RowOrGroup<TRow> | undefined)[]>(() => {
    const { first, last } = this.indexes();
    const groupedRows = this.groupedRows();
    const rows = groupedRows
      ? groupedRows.slice(first, Math.min(last, groupedRows.length))
      : this.rows().slice(first, Math.min(last, this.rowCount()));
    rows.length = last - first;
    return rows;
  });

  readonly scrollHeight = computed(() => {
    if (this.datatable.scrollbarV() && this.datatable.virtualization() && this.rowCount()) {
      return this.rowHeightsCache().query(this.rowCount() - 1);
    }
    return undefined;
  });

  readonly renderOffset = computed(() =>
    this.datatable.scrollbarV() && this.datatable.virtualization()
      ? `translateY(${this.rowHeightsCache().query(this.indexes().first - 1)}px)`
      : ''
  );

  readonly gridTemplateColumns = computed(() =>
    gridColumnTemplate(columnsByPinArr(this.columns()))
  );
  readonly totalColumnGroupWidths = computed(() => {
    const columns = this.columns();
    return columnGroupWidths(columnsByPin(columns), columns).total;
  });

  get selected() {
    return this.datatable.selected;
  }

  readonly scrollbarV = computed(() => this.datatable.scrollbarV());
  readonly scrollbarH = computed(() => this.datatable.scrollbarH());
  readonly loadingIndicator = computed(() => this.datatable.loadingIndicator());
  readonly ghostLoadingIndicator = computed(() => this.datatable.ghostLoadingIndicator());
  readonly externalPaging = computed(() => this.datatable.externalPaging());
  readonly virtualization = computed(() => this.datatable.virtualization());
  readonly selectionType = computed<SelectionType | undefined>(() =>
    this.datatable.selectionType()
  );
  readonly sorts = computed<SortPropDir[]>(() => this.datatable.sorts());
  readonly rowIdentity = computed(() => this.datatable.rowIdentity());
  readonly selectCheck = computed(() => this.datatable.selectCheck());
  readonly displayCheck = computed<
    ((row: TRow, column: TableColumn, value?: any) => boolean) | undefined
  >(() => this.datatable.displayCheck());
  readonly trackByProp = computed(() => this.datatable.trackByProp());
  readonly rowClass = computed(() => this.datatable.rowClass());
  readonly groupExpansionDefault = computed(() => this.datatable.groupExpansionDefault());
  readonly summaryRow = computed(() => this.datatable.summaryRow());
  readonly summaryHeight = computed(() => this.datatable.summaryHeight());
  readonly summaryPosition = computed(() => this.datatable.summaryPosition());
  readonly rowDraggable = computed(() => this.datatable.rowDraggable());
  readonly disableRowCheck = computed(() => this.datatable.disableRowCheck());
  readonly checkRowPropertyChanges = computed(() => this.datatable.checkRowPropertyChanges());
  readonly sortType = computed<SortType>(() => this.datatable.sortType());
  readonly reorderable = computed(() => this.datatable.reorderable());
  readonly enableClearingSortState = computed(() => this.datatable.enableClearingSortState());
  readonly hasGroupedRows = computed(() => this.groupedRows() !== undefined);
  readonly allRowsSelected = computed(() => {
    let allRowsSelected = this.selected().length === this.datatable.rows()?.length;
    if (this.datatable.selectAllRowsOnPage()) {
      const { first, last } = this.indexes();
      allRowsSelected = this.selected().length === last - first;
    }
    return !!(this.selected() && this.datatable.rows()?.length !== 0 && allRowsSelected);
  });
  readonly footerRowCount = computed(() =>
    this.hasGroupedRows() ? this.rows().length : this.rowCount()
  );
  readonly groupCount = computed(() => (this.hasGroupedRows() ? this.rowCount() : undefined));
  readonly selectedCount = computed(() => this.selected().length);
  readonly showSelectedMessage = computed(() => !!this.selectionType());
  readonly currentPage = computed(() => this.offset() + 1);
  readonly paginationCount = computed(() => this.groupCount() ?? this.footerRowCount());

  constructor(private readonly datatable: DatatableComponent<TRow>) {}

  markRowsChanged(): void {
    this.rowChangeVersion.update(value => value + 1);
  }

  setDimensions(dimensions: Pick<DOMRect, 'width' | 'height'>, measuredHeaderHeight = 0): void {
    this.dimensions.set(dimensions);
    this.measuredHeaderHeight.set(measuredHeaderHeight);
  }

  setScrollOffset(offsetX: number, offsetY: number): void {
    this.offsetX.set(offsetX);
    this.offsetY.set(offsetY);
  }

  selectPage(page: number): void {
    this.datatable.onFooterPage({ page });
  }

  groupArrayBy(originalArray: (TRow | undefined)[], groupBy: keyof TRow): Group<TRow>[] {
    const groups = new Map<TRow[keyof TRow], TRow[]>();
    for (const item of originalArray) {
      if (!item) {
        continue;
      }
      const key = item[groupBy];
      const group = groups.get(key);
      if (group) {
        group.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return Array.from(groups, ([key, value]) => ({ key, value }));
  }

  private detailRowHeight(): number | ((row: TRow, index: number) => number) {
    const rowHeight = this.datatable.rowDetail?.rowHeight() ?? 0;
    return typeof rowHeight === 'function' ? (row, index) => rowHeight(row, index) : rowHeight;
  }
}
