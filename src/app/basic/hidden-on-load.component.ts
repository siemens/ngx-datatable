import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'hidden-on-load-demo',
  imports: [DatatableComponent, DataTableColumnDirective, AsyncPipe],
  template: `
    <div>
      <h3>
        Hidden On Load
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/hidden-on-load.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>

      <div style="width:75%;margin:0 auto">
        @let rows = this.rows | async;
        <div>
          <button type="button" (click)="tab1 = true; tab2 = false; tab3 = false">Nothing</button>
          <button type="button" (click)="tab2 = true; tab1 = false; tab3 = false">Hidden</button>
          <button type="button" (click)="tab3 = true; tab1 = false; tab2 = false">NgIf</button>
        </div>

        <div [hidden]="!tab1">
          <p>Click a button to toggle table visibilities</p>
        </div>

        <div [hidden]="!tab2">
          <h4>hidden Table</h4>
          <ngx-datatable
            class="material"
            columnMode="force"
            [rows]="rows"
            [headerHeight]="50"
            [footerHeight]="50"
            [rowHeight]="50"
            [scrollbarV]="true"
          >
            <ngx-datatable-column name="Name" [width]="200" />
            <ngx-datatable-column name="Gender" [width]="300" />
            <ngx-datatable-column name="Age" [width]="80" />
          </ngx-datatable>
        </div>

        @if (tab3) {
          <div>
            <h4>ngIf Table</h4>
            <ngx-datatable
              class="material"
              columnMode="force"
              [rows]="rows"
              [headerHeight]="50"
              [footerHeight]="50"
              [rowHeight]="50"
              [scrollbarV]="true"
            >
              <ngx-datatable-column name="Name" [width]="200" />
              <ngx-datatable-column name="Gender" [width]="300" />
              <ngx-datatable-column name="Age" [width]="80" />
            </ngx-datatable>
          </div>
        }
      </div>
    </div>
  `
})
export class HiddenOnLoadComponent {
  protected readonly rows = inject(DataService).load('100k.json');

  tab1 = true;
  tab2 = false;
  tab3 = false;
}
