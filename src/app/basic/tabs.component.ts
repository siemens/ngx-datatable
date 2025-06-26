import { Component, inject } from '@angular/core';
import {
  ColumnMode,
  DataTableColumnDirective,
  DatatableComponent
} from 'projects/ngx-datatable/src/public-api';
import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'tabs-demo',
  template: `
    <div>
      <h3>
        Hidden By Default
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/basic/tabs.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>

      <div style="width:75%;margin:0 auto">
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
            [rows]="rows"
            [columnMode]="ColumnMode.force"
            [headerHeight]="50"
            [footerHeight]="50"
            [rowHeight]="50"
            [scrollbarV]="true"
          >
            <ngx-datatable-column name="Name" [width]="200"></ngx-datatable-column>
            <ngx-datatable-column name="Gender" [width]="300"></ngx-datatable-column>
            <ngx-datatable-column name="Age" [width]="80"></ngx-datatable-column>
          </ngx-datatable>
        </div>

        @if (tab3) {
          <div>
            <h4>ngIf Table</h4>
            <ngx-datatable
              class="material"
              [rows]="rows"
              [columnMode]="ColumnMode.force"
              [headerHeight]="50"
              [footerHeight]="50"
              [rowHeight]="50"
              [scrollbarV]="true"
            >
              <ngx-datatable-column name="Name" [width]="200"></ngx-datatable-column>
              <ngx-datatable-column name="Gender" [width]="300"></ngx-datatable-column>
              <ngx-datatable-column name="Age" [width]="80"></ngx-datatable-column>
            </ngx-datatable>
          </div>
        }
      </div>
    </div>
  `,
  imports: [DatatableComponent, DataTableColumnDirective]
})
export class TabsDemoComponent {
  rows: FullEmployee[] = [];

  tab1 = true;
  tab2 = false;
  tab3 = false;

  ColumnMode = ColumnMode;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('100k.json').subscribe(data => {
      this.rows = data;
    });
  }
}
