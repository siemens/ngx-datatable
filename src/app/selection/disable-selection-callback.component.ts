import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ActivateEvent,
  DatatableComponent,
  SelectEvent,
  TableColumn
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'disable-selection-callback-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Disable Selection Callback
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/selection/disable-selection-callback.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <div style="float:left;width:75%">
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
          [selectCheck]="checkSelectable"
          [selected]="selected"
          (activate)="onActivate($event)"
          (select)="onSelect($event)"
        />
      </div>

      <div class="selected-column">
        <h4>Selections</h4>
        <ul>
          @for (sel of selected; track sel) {
            <li>
              {{ sel.name }}
            </li>
          } @empty {
            <li>No Selections</li>
          }
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class DisableSelectionCallbackComponent {
  readonly rows = inject(DataService).load('company.json');

  selected: Employee[] = [];

  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];

  onSelect({ selected }: SelectEvent<Employee>) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Activate Event', event);
  }

  checkSelectable(event: Employee) {
    return event.name !== 'Ethel Price';
  }
}
