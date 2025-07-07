import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'comparator-sorting-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Custom Sorting Comparator
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/sorting/sorting-comparator.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
      />
    </div>
  `
})
export class SortingComparatorComponent {
  rows: Employee[] = [];

  columns: TableColumn[] = [
    { name: 'Company', comparator: this.companyComparator.bind(this) },
    { name: 'Name', sortable: false },
    { name: 'Gender', sortable: false }
  ];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data.splice(0, 20);
    });
  }

  companyComparator(propA: string, propB: string) {
    // Just a simple sort function comparisoins
    if (propA.toLowerCase() < propB.toLowerCase()) {
      return -1;
    }
    if (propA.toLowerCase() > propB.toLowerCase()) {
      return 1;
    }

    return 0;
  }
}
