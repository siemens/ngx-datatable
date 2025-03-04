import { Directive } from '@angular/core';
import { Group, RowOrGroup, TreeStatus } from '../../types/public.types';
import { DataTableRowWrapperComponent } from './body-row-wrapper.component';

@Directive({
  selector: '[ngx-datatable-body-row]',
  standalone: true
})
export class DatatableBodyRowDirective {
  static ngTemplateContextGuard<TRow extends { treeStatus?: TreeStatus } = any>(
    directive: DatatableBodyRowDirective,
    context: unknown
  ): context is {
    row: TRow;
    groupValue: Group<TRow>[];
    index: number;
    rowWrapper: DataTableRowWrapperComponent;
    group: RowOrGroup<TRow>;
  } {
    return true;
  }
}
