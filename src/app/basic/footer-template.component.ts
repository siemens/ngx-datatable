import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  DatatableComponent,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  TableColumn,
  DatatablePagerComponent
} from '@siemens/ngx-datatable';
import { map } from 'rxjs';

import { DataService } from '../data.service';

@Component({
  selector: 'footer-template-demo',
  imports: [
    DatatableComponent,
    DatatableFooterDirective,
    DataTableFooterTemplateDirective,
    DatatablePagerComponent,
    AsyncPipe
  ],
  template: `
    <div>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows | async"
        [columns]="columns"
        [footerHeight]="100"
        [headerHeight]="50"
      >
        <ngx-datatable-footer>
          <ng-template
            let-rowCount="rowCount"
            let-pageSize="pageSize"
            let-selectedCount="selectedCount"
            let-curPage="curPage"
            let-offset="offset"
            ngx-datatable-footer-template
          >
            <div style="padding: 5px 10px">
              <div><strong>Summary</strong>: Gender: Female</div>
              <hr style="width:100%" />
              <div
                >Rows: {{ rowCount }} | Size: {{ pageSize }} | Current: {{ curPage }} | Offset:
                {{ offset }}</div
              >
            </div>
            <ngx-datatable-pager />
          </ng-template>
        </ngx-datatable-footer>
      </ngx-datatable>
    </div>
  `
})
export class FooterTemplateComponent {
  protected readonly rows = inject(DataService)
    .load('company.json')
    .pipe(map(data => data.slice(0, 5)));

  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
}
