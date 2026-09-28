import { computed, Signal } from '@angular/core';

import type { DatatableComponent } from './datatable.component';

type DatatableControllerTable = {
  [K in keyof Pick<DatatableComponent, 'offset' | 'rowCount' | 'pageSize'>]: Signal<number>;
};

export class DatatableController {
  readonly offset = computed(() => {
    const offset = this.datatable.offset();
    const rowCount = this.datatable.rowCount();
    const pageSize = this.datatable.pageSize();
    return Math.max(Math.min(offset, Math.ceil(rowCount / pageSize) - 1), 0);
  });

  constructor(private readonly datatable: DatatableControllerTable) {}
}
