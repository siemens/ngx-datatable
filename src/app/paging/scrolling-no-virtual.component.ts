import { Component, inject, signal } from '@angular/core';
import { DatatableComponent, FetchRowsEvent } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { MockServerResultsService } from './mock-server-results-service';

@Component({
  selector: 'scrolling-no-virtual-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Scrolling no virtual
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/paging/scrolling-no-virtual.component.ts"
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
        [rows]="rows()"
        [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
        [headerHeight]="50"
        [footerHeight]="50"
        [scrollbarV]="true"
        [virtualization]="false"
        [externalPaging]="true"
        [count]="totalElements()"
        [rowsOffset]="rowsOffset()"
        [limit]="pageSize()"
        [ghostLoadingIndicator]="isLoading() > 0"
        (fetchRows)="onFetchRows($event)"
      />
    </div>
  `,
  providers: [MockServerResultsService]
})
export class ScrollingNoVirtualComponent {
  readonly totalElements = signal(0);
  readonly rowsOffset = signal(0);
  readonly pageSize = signal(20);
  readonly rows = signal<Employee[]>([]);
  readonly isLoading = signal(0);
  private serverResultsService = inject(MockServerResultsService);

  /**
   * Populate the table with new data based on row indexes
   * @param event The fetchRows event containing start and end indexes
   */
  onFetchRows(event: FetchRowsEvent) {
    this.isLoading.update(v => v + 1);
    this.rowsOffset.set(event.startIndex);
    this.serverResultsService.getResults(event.startIndex, event.endIndex).subscribe(result => {
      this.isLoading.update(v => v - 1);
      this.totalElements.set(result.totalElements);
      this.rows.set(result.data);
    });
  }
}
