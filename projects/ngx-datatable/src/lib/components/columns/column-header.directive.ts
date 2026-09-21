import { Directive } from '@angular/core';

import {
  HeaderActionsContext,
  HeaderCellContext,
  HeaderLabelContext
} from '../../types/public.types';

@Directive({
  selector: '[ngx-datatable-header-cell]'
})
export class DataTableColumnHeaderCellDirective {
  static ngTemplateContextGuard(
    directive: DataTableColumnHeaderCellDirective,
    context: unknown
  ): context is HeaderCellContext {
    return true;
  }
}

@Directive({
  selector: '[ngx-datatable-header-label]'
})
export class DataTableColumnHeaderLabelDirective {
  static ngTemplateContextGuard(
    directive: DataTableColumnHeaderLabelDirective,
    context: unknown
  ): context is HeaderLabelContext {
    return true;
  }
}

@Directive({
  selector: '[ngx-datatable-header-actions]'
})
export class DataTableColumnHeaderActionsDirective {
  static ngTemplateContextGuard(
    directive: DataTableColumnHeaderActionsDirective,
    context: unknown
  ): context is HeaderActionsContext {
    return true;
  }
}
