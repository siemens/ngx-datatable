import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'client-side-sorting-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material"
        columnMode="force"
        sortType="multi"
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
      />
    </div>
  `
})
export class ClientSideSortingComponent {
  protected readonly rows = inject(DataService).load('company.json');

  columns: TableColumn[] = [{ name: 'Company' }, { name: 'Name' }, { name: 'Gender' }];
}
