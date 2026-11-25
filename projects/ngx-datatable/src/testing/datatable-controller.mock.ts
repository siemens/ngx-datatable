import { Provider, signal } from '@angular/core';

import { DatatableController } from '../lib/components/datatable-controller';

export const provideDatatableControllerMock = (
  table: Partial<ConstructorParameters<typeof DatatableController>[0]>
): Provider => ({
  provide: DatatableController,
  useValue: new DatatableController({
    offset: signal(0),
    scrollbarV: signal(false),
    virtualization: signal(true),
    bodyHeight: signal(0),
    rowHeight: signal(30),
    limit: signal(10),
    externalPaging: signal(false),
    count: signal(0),
    _internalRows: signal([]),
    _internalGroupedRows: signal(undefined),
    rowIdentity: signal(row => row),
    ...table
  })
});
