import { Provider, signal } from '@angular/core';

import { DatatableController } from '../lib/components/datatable-controller';

export const provideDatatableControllerMock = (
  table: Partial<ConstructorParameters<typeof DatatableController>[0]>
): Provider => ({
  provide: DatatableController,
  useValue: new DatatableController({
    offset: signal(0),
    pageSize: signal(10),
    externalPaging: signal(false),
    count: signal(0),
    _internalRows: signal([]),
    _internalGroupedRows: signal(undefined),
    ...table
  })
});
