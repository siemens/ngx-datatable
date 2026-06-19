import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { DataService } from '../data.service';

@Component({
  selector: 'comparator-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Comparator
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/sorting/comparator.component.ts"
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
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
      />
    </div>
  `
})
export class ComparatorComponent {
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 20)));

  columns: TableColumn[] = [
    { name: 'Company', comparator: this.companyComparator.bind(this) },
    { name: 'Name', sortable: false },
    { name: 'Gender', sortable: false }
  ];

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
