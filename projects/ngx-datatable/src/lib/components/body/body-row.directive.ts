import { Directive } from '@angular/core';
import { Group, RowOrGroup, TreeStatus } from '../../types/public.types';
import { BehaviorSubject } from 'rxjs';

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
    disable$: BehaviorSubject<boolean>;
    group: RowOrGroup<TRow>;
  } {
    return true;
  }
}
