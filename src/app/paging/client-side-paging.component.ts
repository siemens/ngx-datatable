import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatatableComponent } from '@siemens/ngx-datatable';

import { DataService } from '../data.service';

@Component({
  selector: 'client-side-paging-demo',
  imports: [DatatableComponent, AsyncPipe],
  template: `
    <div>
      <h3>
        Client-side Paging
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/paging/client-side-paging.component.ts"
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
        [rows]="rows | async"
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [headerHeight]="50"
        [footerHeight]="50"
        [limit]="10"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ClientSidePagingComponent {
  protected readonly rows = inject(DataService).load('company.json');
}
