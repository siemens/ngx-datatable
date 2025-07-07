import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'basic-dark-theme-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Dark Theme
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/dark-theme.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="dark"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows"
        [loadingIndicator]="loadingIndicator"
        [columns]="columns"
        [headerHeight]="40"
        [summaryRow]="true"
        [footerHeight]="40"
        [limit]="10"
        [reorderable]="reorderable"
      />
    </div>
  `
})
export class DarkThemeComponent {
  rows: Employee[] = [];
  loadingIndicator = true;
  reorderable = true;

  columns: TableColumn[] = [
    { prop: 'name', summaryFunc: () => null },
    { name: 'Gender', summaryFunc: cells => this.summaryForGender(cells) },
    { name: 'Company', summaryFunc: () => null }
  ];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1500);
    });
  }

  private summaryForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }
}
