import { Component, computed, inject, signal } from '@angular/core';
import {
  DataTableColumnDirective,
  DataTableColumnHeaderActionsDirective,
  DataTableColumnHeaderCellDirective,
  DataTableColumnHeaderLabelDirective,
  DataTableColumnReorderHandleDirective,
  DatatableComponent
} from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'header-customization-demo',
  imports: [
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnHeaderLabelDirective,
    DataTableColumnHeaderActionsDirective,
    DataTableColumnHeaderCellDirective,
    DataTableColumnReorderHandleDirective
  ],
  template: `
    <ngx-datatable
      class="material"
      columnMode="force"
      scrollbarV
      [rowHeight]="50"
      [rows]="rows()"
      [headerHeight]="64"
      [footerHeight]="50"
      [reorderable]="true"
    >
      <ngx-datatable-column name="Name" prop="name">
        <ng-template let-column="column" ngx-datatable-header-label>
          <span class="header-symbol" aria-hidden="true">★</span>
          <span>{{ column.name }}</span>
        </ng-template>
      </ngx-datatable-column>

      <ngx-datatable-column name="Company" prop="company">
        <ng-template ngx-datatable-header-actions>
          <input
            class="company-filter"
            type="search"
            aria-label="Filter companies"
            placeholder="Filter"
            (input)="filterCompany($event)"
          />
        </ng-template>
      </ngx-datatable-column>

      <ngx-datatable-column name="Gender" prop="gender">
        <ng-template
          let-column="column"
          let-sort="sortFn"
          let-sortDir="sortDir"
          ngx-datatable-header-cell
        >
          <button
            type="button"
            class="custom-sort-button"
            ngxDatatableReorderHandle
            (click)="sort()"
          >
            {{ column.name }}
            <span aria-hidden="true">{{
              sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'
            }}</span>
          </button>
          <button
            type="button"
            class="header-action"
            [attr.aria-pressed]="femaleOnly()"
            (click)="femaleOnly.update(value => !value)"
          >
            Female only
          </button>
        </ng-template>
      </ngx-datatable-column>
    </ngx-datatable>
  `,
  styles: `
    .company-filter {
      box-sizing: border-box;
      width: 7rem;
      border: 1px solid #aaaaaa;
      border-radius: 0.2rem;
      padding: 0.25rem;
    }

    .header-symbol {
      margin-inline-end: 0.25rem;
    }

    .custom-sort-button,
    .header-action {
      border: 0;
      border-radius: 0.2rem;
      padding: 0.25rem 0.4rem;
      background: transparent;
      color: inherit;
      font: inherit;
    }

    .custom-sort-button {
      cursor: pointer;
      font-weight: 600;
    }

    .header-action {
      margin-inline-start: 0.25rem;
      background: #eeeeee;
      cursor: pointer;
    }

    .header-action[aria-pressed='true'] {
      background: #d7e7ff;
    }
  `,
  host: {
    class: 'datatable-example'
  }
})
export class HeaderCustomizationComponent {
  static readonly exampleTitle = 'Header Customization';

  private readonly allRows = signal<Employee[]>([]);
  private readonly companyFilter = signal('');
  readonly femaleOnly = signal(false);
  readonly rows = computed(() => {
    const companyFilter = this.companyFilter().toLowerCase();
    return this.allRows().filter(
      row =>
        (!companyFilter || row.company.toLowerCase().includes(companyFilter)) &&
        (!this.femaleOnly() || row.gender === 'female')
    );
  });

  constructor() {
    inject(DataService)
      .load('company.json')
      .subscribe(rows => this.allRows.set(rows));
  }

  filterCompany(event: Event): void {
    this.companyFilter.set((event.target as HTMLInputElement).value);
  }
}
