import { computed, Signal } from '@angular/core';

import type { DatatableComponent } from './datatable.component';

type DatatableControllerTable = {
  [
    K in keyof Pick<
      DatatableComponent,
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
    >
  ]: Signal<ReturnType<DatatableComponent[K]>>;
};

export class DatatableController {
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

  constructor(private readonly datatable: DatatableControllerTable) {}
}
