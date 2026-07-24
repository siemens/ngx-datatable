import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'client-side-paging-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows | async"
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [headerHeight]="50"
        [footerHeight]="50"
        [limit]="10"
      />
    </div>
  `
})
export class ClientSidePagingComponent {
  protected readonly rows = inject(DataService).load('company.json');
}
