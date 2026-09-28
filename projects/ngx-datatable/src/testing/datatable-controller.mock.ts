import { Provider } from '@angular/core';

import { DatatableController } from '../lib/components/datatable-controller';

export const provideDatatableControllerMock = (
  table: ConstructorParameters<typeof DatatableController>[0]
): Provider => ({
  provide: DatatableController,
  useValue: new DatatableController(table)
});
