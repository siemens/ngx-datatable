import { Directive } from '@angular/core';

/** Marks the part of a header cell from which column reordering can start. */
@Directive({
  selector: '[ngxDatatableReorderHandle]',
  host: {
    class: 'datatable-header-reorder-handle draggable'
  }
})
export class DataTableColumnReorderHandleDirective {}
