import { Provider, signal, WritableSignal } from '@angular/core';

import { TableController } from '../lib/components/table-controller';
import { Group, Row, SelectionType, SortPropDir, SortType } from '../lib/types/public.types';
import { TableColumn } from '../lib/types/table-column.type';

export interface TableControllerMockState<TRow extends Row> {
  rows: WritableSignal<(TRow | undefined)[]>;
  groupedRows: WritableSignal<Group<TRow>[] | undefined>;
  columns: WritableSignal<TableColumn<TRow>[]>;
  sorts: WritableSignal<SortPropDir[]>;
  selected: WritableSignal<TRow[]>;
  offset: WritableSignal<number>;
  limit: WritableSignal<number | undefined>;
  count: WritableSignal<number>;
  externalPaging: WritableSignal<boolean>;
  scrollbarV: WritableSignal<boolean>;
  virtualization: WritableSignal<boolean>;
  selectionType: WritableSignal<SelectionType | undefined>;
}

/** Creates the internal controller setup used by isolated component tests. */
export const createTableControllerMock = <TRow extends Row = any>() => {
  const state: TableControllerMockState<TRow> = {
    rows: signal([]),
    groupedRows: signal(undefined),
    columns: signal([]),
    sorts: signal([]),
    selected: signal([]),
    offset: signal(0),
    limit: signal(undefined),
    count: signal(0),
    externalPaging: signal(false),
    scrollbarV: signal(false),
    virtualization: signal(false),
    selectionType: signal(undefined)
  };
  const table = {
    ...state,
    columnTemplates: signal([]),
    datatableConfiguration: {
      configuration: signal({ defaultColumnWidth: 150 })
    },
    rowDetail: undefined,
    groupRowsBy: signal<keyof TRow | undefined>(undefined),
    externalSorting: signal(false),
    treeFromRelation: signal<string | undefined>(undefined),
    treeToRelation: signal<string | undefined>(undefined),
    ghostLoadingIndicator: signal(false),
    loadingIndicator: signal(false),
    scrollbarH: signal(false),
    rowHeight: signal<number | 'auto' | ((row: TRow) => number)>(30),
    headerHeight: signal<number | 'auto'>(30),
    footerHeight: signal(0),
    selectAllRowsOnPage: signal(false),
    rowIdentity: signal((row: TRow) => row),
    selectCheck: signal(undefined),
    displayCheck: signal(undefined),
    trackByProp: signal<keyof TRow | undefined>(undefined),
    rowClass: signal(undefined),
    groupExpansionDefault: signal(false),
    summaryRow: signal(false),
    summaryHeight: signal(30),
    summaryPosition: signal('top'),
    rowDraggable: signal(false),
    disableRowCheck: signal<((row: TRow) => boolean) | undefined>(undefined),
    checkRowPropertyChanges: signal(true),
    sortType: signal<SortType>('single'),
    reorderable: signal(true),
    enableClearingSortState: signal(false),
    onFooterPage: (_event: { page: number }): void => {}
  };
  const controller = new TableController<TRow>(table as any);

  return {
    controller,
    state,
    table,
    provider: { provide: TableController, useValue: controller } satisfies Provider
  };
};
