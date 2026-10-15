import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  numberAttribute,
  input
} from '@angular/core';

import { TableColumnInternal } from '../../../types/internal.types';
import { DatatableController } from '../../datatable-controller';

@Component({
  selector: 'ghost-loader',
  imports: [NgTemplateOutlet],
  templateUrl: './ghost-loader.component.html',
  styleUrl: './ghost-loader.component.scss'
})
export class DataTableGhostLoaderComponent {
  private readonly controller = inject(DatatableController);
  readonly columns = input.required<TableColumnInternal[]>();
  readonly singleRow = input(false, { transform: booleanAttribute });
  readonly rowHeight = input.required<number | 'auto' | ((row?: any) => number)>();
  readonly ghostBodyHeight = input<number, unknown>(undefined, { transform: numberAttribute });

  protected readonly ghostRows = computed(() =>
    Array.from({ length: this.singleRow() ? 1 : this.controller.pageSize() }, (_, index) => index)
  );

  protected readonly rowHeightComputed = () => {
    const rowHeight = this.rowHeight();
    if (typeof rowHeight === 'function') {
      // If rowHeight is a function, we cannot determine a fixed height here.
      return 'auto';
    }
    return rowHeight === 'auto' ? 'auto' : rowHeight + 'px';
  };
}
