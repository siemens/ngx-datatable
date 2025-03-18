import { Component, inject } from '@angular/core';
import { ColumnMode } from 'projects/ngx-datatable/src/public-api';
import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'client-paging-demo',
  template: `
    <div>
      <h3>
        Client-side Paging
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/paging/paging-client.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [footerHeight]="50"
        rowHeight="auto"
        [limit]="10"
      >
      </ngx-datatable>
    </div>
  `
})
export class ClientPagingComponent {
  rows: Employee[] = [];

  ColumnMode = ColumnMode;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }
}
