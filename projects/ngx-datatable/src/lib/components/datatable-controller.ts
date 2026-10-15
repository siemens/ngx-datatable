import { computed, Signal, signal } from '@angular/core';

import { Row } from '../types/public.types';
import type { DatatableComponent } from './datatable.component';

type DatatableControllerTable<TRow extends Row> = {
  [
    K in keyof Pick<
      DatatableComponent<TRow>,
      | 'offset'
      | 'scrollbarV'
      | 'virtualization'
      | 'bodyHeight'
      | 'rowHeight'
      | 'limit'
      | 'externalPaging'
      | 'count'
      | '_internalRows'
      | '_internalGroupedRows'
      | 'rowIdentity'
    >
  ]: Signal<ReturnType<DatatableComponent<TRow>[K]>>;
};

export class DatatableController<TRow extends Row = any> {
  readonly rowExpansions = signal<TRow[]>([]);

  readonly viewportRowCount = computed(() => {
    const size = Math.ceil(this.datatable.bodyHeight() / (this.datatable.rowHeight() as number));
    return Math.max(size, 0);
  });

  readonly pageSize = computed(() => {
    if (this.datatable.scrollbarV() && this.datatable.virtualization()) {
      return this.viewportRowCount();
    }

    return this.datatable.limit() ?? this.datatable._internalRows().length;
  });

  readonly rowCount = computed(() => {
    if (this.datatable.externalPaging()) {
      return this.datatable.count();
    }

    return this.datatable._internalGroupedRows()?.length ?? this.datatable._internalRows().length;
  });

  readonly offset = computed(() => {
    const offset = this.datatable.offset();
    const rowCount = this.rowCount();
    const pageSize = this.pageSize();
    return Math.max(Math.min(offset, Math.ceil(rowCount / pageSize) - 1), 0);
  });

  constructor(private readonly datatable: DatatableControllerTable<TRow>) {}

  toggleRowExpansion(row: TRow): void {
    const rowExpandedIdx = this.getExpandedRowIdx(row);
    this.rowExpansions.update(expansions =>
      rowExpandedIdx > -1
        ? expansions.filter((_, index) => index !== rowExpandedIdx)
        : [...expansions, row]
    );
  }

  toggleAllRows(expanded: boolean): void {
    // TODO requires fixing. This still does not work with groups.
    this.rowExpansions.set(expanded ? [...(this.datatable._internalRows() as TRow[])] : []);
  }

  getRowExpanded(row: TRow): boolean {
    return this.getExpandedRowIdx(row) > -1;
  }

  private getExpandedRowIdx(row: TRow): number {
    const expansions = this.rowExpansions();
    if (!expansions.length) {
      return -1;
    }

    const rowIdentity = this.datatable.rowIdentity();
    const rowId = rowIdentity(row);
    return expansions.findIndex(expandedRow => rowIdentity(expandedRow) === rowId);
  }
}
