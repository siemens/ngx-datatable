import { Directive } from '@angular/core';
import { Group, TreeStatus } from '../../types/public.types';

@Directive({
  selector: '[ngx-datatable-body-row]'
})
export class DatatableBodyRowDirective {
  static ngTemplateContextGuard<TRow extends { treeStatus?: TreeStatus } = any>(
    directive: DatatableBodyRowDirective,
    context: unknown
  ): context is {
    row: TRow;
    groupValue: Group<TRow>[];
    index: number;
  } {
    return true;
  }
}
