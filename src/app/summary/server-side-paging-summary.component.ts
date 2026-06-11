import { Component, inject, signal } from '@angular/core';
import { DatatableComponent, FetchRowsEvent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { MockServerResultsService } from '../paging/mock-server-results-service';

@Component({
  selector: 'server-side-paging-summary-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Server-side Paging Summary
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/summary/server-side-paging-summary.component.ts"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows()"
        [columns]="columns"
        [headerHeight]="50"
        [summaryRow]="true"
        [summaryHeight]="55"
        [footerHeight]="50"
        [externalPaging]="true"
        [count]="totalElements()"
        [rowsOffset]="rowsOffset()"
        [limit]="pageSize()"
        (fetchRows)="onFetchRows($event)"
      />
    </div>
  `,
  providers: [MockServerResultsService]
})
export class ServerSidePagingSummaryComponent {
  readonly totalElements = signal(0);
  readonly rowsOffset = signal(0);
  readonly pageSize = signal(20);
  readonly rows = signal<Employee[]>([]);

  columns: TableColumn[] = [
    // NOTE: cells for current page only !
    { name: 'Name', summaryFunc: cells => `${cells.length} total` },
    { name: 'Gender', summaryFunc: () => this.getGenderSummary() },
    { name: 'Company', summaryFunc: () => null }
  ];

  private serverResultsService = inject(MockServerResultsService);

  /**
   * Populate the table with new data based on row indexes
   * @param event The fetchRows event containing start and end indexes
   */
  onFetchRows(event: FetchRowsEvent) {
    this.rowsOffset.set(event.startIndex);
    this.serverResultsService.getResults(event.startIndex, event.endIndex).subscribe(result => {
      this.totalElements.set(result.totalElements);
      this.rows.set(result.data);
    });
  }

  getGenderSummary(): string {
    // NOTE: there should be logic to get required informations from server
    return '10 males, 10 females';
  }
}
