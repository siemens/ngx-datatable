import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'full-screen-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Full Screen
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/full-screen.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material fullscreen"
        style="top: 52px"
        columnMode="force"
        [headerHeight]="50"
        [footerHeight]="0"
        [rowHeight]="50"
        [scrollbarV]="true"
        [scrollbarH]="true"
        [rows]="rows | async"
      >
        <ngx-datatable-column name="Id" [width]="80" />
        <ngx-datatable-column name="Name" [width]="300" />
        <ngx-datatable-column name="Gender" />
        <ngx-datatable-column name="Age" />
        <ngx-datatable-column name="City" prop="address.city" [width]="300" />
        <ngx-datatable-column name="State" prop="address.state" [width]="300" />
      </ngx-datatable>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class FullScreenComponent {
  protected readonly rows = inject(DataService).load('100k.json');
}
