import { Component, inject, signal } from '@angular/core';
import {
  ActivateEvent,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'checkbox-selection-demo',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <div>
      <div style="float:left;width:75%">
        @let rows = this.rows();
        <ngx-datatable
          style="width: 90%"
          class="material selection-row"
          rowHeight="auto"
          columnMode="force"
          selectionType="checkbox"
          [rows]="rows"
          [headerHeight]="50"
          [footerHeight]="50"
          [limit]="5"
          [selected]="selected"
          [selectAllRowsOnPage]="false"
          [displayCheck]="displayCheck"
          (activate)="onActivate($event)"
          (selectedChange)="onSelect($event)"
        >
          <ngx-datatable-column
            [width]="40"
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
        <div class="selected-column-actions">
          <button type="button" class="example-action" (click)="add()">Add</button> |
          <button type="button" class="example-action" (click)="update()">Update</button> |
          <button type="button" class="example-action" (click)="remove()">Remove</button>
        </div>
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
export class CheckboxSelectionComponent {
  private dataService = inject(DataService);
  readonly rows = signal<Employee[]>([]);
  selected: Employee[] = [];

  constructor() {
    this.dataService.load('company.json').subscribe(data => this.rows.set(data));
  }

  onSelect(selected: Employee[]) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    // eslint-disable-next-line no-console
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows()[1], this.rows()[3]);
  }

  update() {
    this.selected = [this.rows()[1], this.rows()[3]];
  }

  remove() {
    this.selected = [];
  }

  displayCheck(row: Employee) {
    return row.name !== 'Ethel Price';
  }
}
