import { Component, inject, OnInit } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { MockServerResultsService } from '../paging/mock-server-results-service';
import { Page } from '../paging/model/page';

@Component({
  selector: 'summary-row-server-paging-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Server-side paging
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/summary/summary-row-server-paging.component.ts"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [rows]="rows"
        [columns]="columns"
        [headerHeight]="50"
        [summaryRow]="true"
        [summaryHeight]="55"
        [footerHeight]="50"
        [externalPaging]="true"
        [count]="page.totalElements"
        [offset]="page.pageNumber"
        [limit]="page.size"
        (page)="setPage($event.offset)"
      />
    </div>
  `,
  providers: [MockServerResultsService]
})
export class SummaryRowServerPagingComponent implements OnInit {
  page: Page = {
    pageNumber: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  };
  rows: Employee[] = [];

  columns: TableColumn[] = [
    // NOTE: cells for current page only !
    { name: 'Name', summaryFunc: cells => `${cells.length} total` },
    { name: 'Gender', summaryFunc: () => this.getGenderSummary() },
    { name: 'Company', summaryFunc: () => null }
  ];

  private serverResultsService = inject(MockServerResultsService);

  ngOnInit() {
    this.setPage(0);
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(page: number) {
    this.page.pageNumber = page;
    this.serverResultsService.getResults(this.page).subscribe(pagedData => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  getGenderSummary(): string {
    // NOTE: there should be logic to get required informations from server
    return '10 males, 10 females';
  }
}
