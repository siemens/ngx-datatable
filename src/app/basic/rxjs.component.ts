import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';
import { Observable } from 'rxjs';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'rxjs-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material striped"
        columnMode="force"
        [rows]="rows | async"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
      />
    </div>
  `
})
export class RxjsComponent {
  private dataService = inject(DataService);
  rows: Observable<Employee[]>;

  columns: TableColumn[] = [{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }];

  constructor() {
    this.rows = this.dataService.load('company.json');
  }
}
