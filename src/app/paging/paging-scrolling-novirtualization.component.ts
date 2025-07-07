import { Component, inject, OnInit } from '@angular/core';
import { DatatableComponent } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { MockServerResultsService } from './mock-server-results-service';
import { Page } from './model/page';

@Component({
  selector: 'paging-scrolling-novirtualization-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Server-side Paging
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/paging/paging-scrolling-novirtualization.component.ts"
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
        [rows]="rows"
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [headerHeight]="50"
        [footerHeight]="50"
        [scrollbarV]="true"
        [virtualization]="false"
        [externalPaging]="true"
        [count]="page.totalElements"
        [offset]="page.pageNumber"
        [limit]="page.size"
        [ghostLoadingIndicator]="isLoading > 0"
        (page)="setPage($event.offset)"
      />
    </div>
  `,
  providers: [MockServerResultsService]
})
export class PagingScrollingNoVirtualizationComponent implements OnInit {
  page: Page = {
    pageNumber: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  };
  rows: Employee[] = [];

  isLoading = 0;
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
    this.isLoading++;
    this.serverResultsService.getResults(this.page).subscribe(pagedData => {
      this.isLoading--;
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }
}
