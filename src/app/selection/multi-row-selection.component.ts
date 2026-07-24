import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivateEvent, DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'multi-row-selection-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <div style="float:left;width:75%">
        <div class="info">
          <p
            >This demonstrates multi selection table, use CTRL or SHIFT click to select multiple
            items.</p
          >
        </div>

        <ngx-datatable
          class="material selection-row"
          rowHeight="auto"
          columnMode="force"
          selectionType="multi"
          [rows]="rows | async"
          [columns]="columns"
          [headerHeight]="50"
          [footerHeight]="50"
          [limit]="5"
          [(selected)]="selected"
          (activate)="onActivate($event)"
        />
      </div>

      <div class="selected-column">
        <h4>Selections</h4>
        <ul>
          @for (sel of selected(); track sel) {
            <li>
              {{ sel.name }}
            </li>
          } @empty {
            <li>No Selections</li>
          }
        </ul>
      </div>
    </div>
  `
})
export class MultiRowSelectionComponent {
  readonly rows = inject(DataService).load('company.json');

  readonly selected = signal<Employee[]>([]);

  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Activate Event', event);
  }
}
