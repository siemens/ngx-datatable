import { Component, inject } from '@angular/core';
import { DatatableComponent, SortType, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'client-sorting-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Client-side Sorting
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/sorting/sorting-client.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows"
        [columns]="columns"
        [sortType]="SortType.multi"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
      />
    </div>
  `
})
export class ClientSortingComponent {
  rows: Employee[] = [];

  columns: TableColumn[] = [{ name: 'Company' }, { name: 'Name' }, { name: 'Gender' }];

  SortType = SortType;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }
}
