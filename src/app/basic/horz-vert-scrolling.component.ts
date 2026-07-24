import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'horz-vert-scrolling-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows | async"
        [headerHeight]="50"
        [footerHeight]="0"
        [rowHeight]="50"
        [scrollbarV]="true"
        [scrollbarH]="true"
      >
        <ngx-datatable-column name="Name" [width]="300" />
        <ngx-datatable-column name="Gender" />
        <ngx-datatable-column name="Age" />
        <ngx-datatable-column name="City" prop="address.city" [width]="300" />
        <ngx-datatable-column name="State" prop="address.state" [width]="300" />
      </ngx-datatable>
    </div>
  `
})
export class HorzVertScrollingComponent {
  protected readonly rows = inject(DataService).load('100k.json');
}
