import { Component, inject } from '@angular/core';
import { DatatableComponent } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'client-paging-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Client-side Paging
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/paging/paging-client.component.ts"
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
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [headerHeight]="50"
        [footerHeight]="50"
        [limit]="10"
      />
    </div>
  `
})
export class ClientPagingComponent {
  rows: Employee[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }
}
