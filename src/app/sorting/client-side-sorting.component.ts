import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'client-side-sorting-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Client-side Sorting
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/sorting/client-side-sorting.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ClientSideSortingComponent {
  protected readonly rows = inject(DataService).load('company.json');

  columns: TableColumn[] = [{ name: 'Company' }, { name: 'Name' }, { name: 'Gender' }];
}
