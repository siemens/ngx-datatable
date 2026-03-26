import { Component, inject, signal } from '@angular/core';
import {
  DataTableBulkActionsRowComponent,
  DataTableColumnDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'bulk-actions-demo',
  imports: [DatatableComponent, DataTableColumnDirective, DataTableBulkActionsRowComponent],
  template: `
    <div>
      <h3>
        Bulk Actions Row
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/selection/selection-bulk-actions.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      @let rows = this.rows();
      <ngx-datatable
        class="material selection-row"
        rowHeight="auto"
        columnMode="force"
        selectionType="checkbox"
        [rows]="rows"
        [headerHeight]="50"
        [footerHeight]="50"
        [limit]="10"
        [(selected)]="selected"
      >
        @if (selected.length) {
          <ngx-datatable-bulk-actions-row>
            <div class="bulk-actions-bar">
              <span class="bulk-actions-count">{{ selected.length }} row(s) selected</span>
              <div class="bulk-actions-buttons">
                <button type="button" (click)="onExport()">Export</button>
                <button type="button" (click)="onDelete()">Delete</button>
                <button type="button" (click)="onCancel()">Cancel</button>
              </div>
            </div>
          </ngx-datatable-bulk-actions-row>
        }
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
  `,
  styles: `
    .bulk-actions-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
    }

    .bulk-actions-buttons {
      display: flex;
      gap: 8px;
    }
  `
})
export class BulkActionsSelectionComponent {
  protected readonly rows = signal<Employee[]>([]);
  protected selected: Employee[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => this.rows.set(data));
  }

  protected onExport() {
    alert(`Exporting ${this.selected.length} row(s)`);
  }

  protected onDelete() {
    const names = this.selected.map(r => r.name);
    this.rows.update(rows => rows.filter(r => !names.includes(r.name)));
    this.selected = [];
  }

  protected onCancel() {
    this.selected = [];
  }
}
