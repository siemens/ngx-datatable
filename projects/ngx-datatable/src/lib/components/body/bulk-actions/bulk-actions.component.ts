import { Component } from '@angular/core';

@Component({
  selector: 'ngx-datatable-bulk-actions-row',
  template: ` <div class="datatable-body-row" role="cell"><ng-content /></div> `,
  styleUrl: './bulk-actions.component.scss',
  host: {
    class: 'datatable-bulk-actions-row',
    role: 'row'
  }
})
/**
 * A sticky row rendered at the top of the datatable body for displaying
 * bulk action controls (e.g. delete, export) when rows are selected.
 *
 * Place inside `<ngx-datatable>` and conditionally show/hide based on the current selection.
 *
 * @example
 * ```html
 * <ngx-datatable [rows]="rows" selectionType="checkbox" [(selected)]="selected">
 *   @if (selected.length) {
 *     <ngx-datatable-bulk-actions-row>
 *       <span>{{ selected.length }} selected</span>
 *       <button type="button" (click)="delete()">Delete</button>
 *     </ngx-datatable-bulk-actions-row>
 *   }
 * </ngx-datatable>
 * ```
 */
export class DataTableBulkActionsRowComponent {}
