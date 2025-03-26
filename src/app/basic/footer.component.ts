import { Component, inject } from '@angular/core';
import {
  ColumnMode,
  DatatableComponent,
  DatatableFooterDirective,
  DataTableFooterTemplateDirective,
  TableColumn
} from 'projects/ngx-datatable/src/public-api';
import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'footer-demo',
  template: `
    <div>
      <h3>
        Custom Footer
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/basic/footer.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="ColumnMode.force"
        [footerHeight]="100"
        [headerHeight]="50"
        rowHeight="auto"
      >
        <ngx-datatable-footer>
          <ng-template
            ngx-datatable-footer-template
            let-rowCount="rowCount"
            let-pageSize="pageSize"
            let-selectedCount="selectedCount"
            let-curPage="curPage"
            let-offset="offset"
          >
            <div style="padding: 5px 10px">
              <div><strong>Summary</strong>: Gender: Female</div>
              <hr style="width:100%" />
              <div
                >Rows: {{ rowCount }} | Size: {{ pageSize }} | Current: {{ curPage }} | Offset:
                {{ offset }}</div
              >
            </div>
          </ng-template>
        </ngx-datatable-footer>
      </ngx-datatable>
    </div>
  `,
  standalone: true,
  imports: [DatatableComponent, DatatableFooterDirective, DataTableFooterTemplateDirective]
})
export class FooterDemoComponent {
  rows: Employee[] = [];

  columns: TableColumn[] = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];

  ColumnMode = ColumnMode;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data.splice(0, 5);
    });
  }
}
