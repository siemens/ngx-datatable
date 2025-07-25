import { Component, inject } from '@angular/core';
import {
  ActivateEvent,
  DataTableColumnDirective,
  DatatableComponent,
  SelectEvent
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'multi-click-chkbox-selection-demo',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <div>
      <h3>
        Multi Click with Checkbox Selection
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/selection/selection-chkbox.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
        <small>
          <a href="javascript:void(0)" (click)="add()">Add</a> |
          <a href="javascript:void(0)" (click)="update()">Update</a> |
          <a href="javascript:void(0)" (click)="remove()">Remove</a>
        </small>
      </h3>
      <div style="float:left;width:75%">
        <ngx-datatable
          style="width: 90%"
          class="material selection-row"
          rowHeight="auto"
          columnMode="force"
          selectionType="multiClick"
          [rows]="rows"
          [headerHeight]="50"
          [footerHeight]="50"
          [limit]="5"
          [selected]="selected"
          [selectAllRowsOnPage]="false"
          [displayCheck]="allowSelection"
          [selectCheck]="allowSelection"
          (activate)="onActivate($event)"
          (select)="onSelect($event)"
        >
          <ngx-datatable-column
            [width]="30"
            [sortable]="false"
            [canAutoResize]="false"
            [draggable]="false"
            [resizeable]="false"
            [headerCheckboxable]="true"
            [checkboxable]="true"
          />
          <ngx-datatable-column name="Name" />
          <ngx-datatable-column name="Gender" />
          <ngx-datatable-column name="Company" />
        </ngx-datatable>
      </div>

      <div class="selected-column">
        <h4>
          Selections <small>({{ selected.length }})</small>
        </h4>
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
  `
})
export class MultiClickCheckboxSelectionComponent {
  rows: Employee[] = [];
  selected: Employee[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }

  onSelect({ selected }: SelectEvent<Employee>) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  allowSelection(row: Employee) {
    return row.name !== 'Beryl Rice';
  }
}
