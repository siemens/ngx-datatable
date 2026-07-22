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
      <h3>
        RxJS
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/rxjs.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
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
