import { Component, inject, ViewChild } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'filter-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Client-side Search and Filtering
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/filter.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <input
        type="text"
        style="padding:8px;margin:15px auto;width:30%;"
        placeholder="Type to filter the name column..."
        (keyup)="updateFilter($event)"
      />
      <ngx-datatable
        #table
        class="material"
        rowHeight="auto"
        columnMode="force"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [limit]="10"
        [rows]="rows"
      />
    </div>
  `
})
export class FilterComponent {
  rows: Employee[] = [];

  temp: Employee[] = [];

  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
  @ViewChild(DatatableComponent) table!: DatatableComponent<Employee>;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      // cache our list
      this.temp = [...data];

      // push our inital complete list
      this.rows = data;
    });
  }

  updateFilter(event: KeyboardEvent) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();

    // filter our data and update the rows
    this.rows = this.temp.filter(d => {
      return d.name.toLowerCase().includes(val) || !val;
    });
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
