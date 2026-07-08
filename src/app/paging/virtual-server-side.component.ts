import { Component, inject, signal } from '@angular/core';
import { DatatableComponent, FetchRowsEvent } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { MockServerResultsService } from './mock-server-results-service';

@Component({
  selector: 'virtual-server-side-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Virtual server-side
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/paging/virtual-server-side.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      @let isLoading = this.isLoading();
      @let totalElements = this.totalElements();
      @let rows = this.rows();
      <ngx-datatable
        class="material"
        columnMode="force"
        [rows]="rows"
        [columns]="[
          { name: 'Name', sortable: false },
          { name: 'Gender', sortable: false },
          { name: 'Company', sortable: false }
        ]"
        [headerHeight]="50"
        [loadingIndicator]="isLoading > 0"
        [ghostLoadingIndicator]="isLoading > 0"
        [scrollbarV]="true"
        [footerHeight]="50"
        [rowHeight]="50"
        [externalPaging]="true"
        [externalSorting]="true"
        [count]="totalElements"
        [rowsOffset]="rowsOffset()"
        (fetchRows)="onFetchRows($event)"
      >
        <div loading-indicator class="custom-loading-indicator">loading...</div>
      </ngx-datatable>
    </div>
  `,
  styleUrl: './virtual-server-side.component.scss',
  providers: [MockServerResultsService]
})
export class VirtualServerSideComponent {
  readonly totalElements = signal(0);
  readonly rowsOffset = signal(0);
  readonly rows = signal<Employee[] | undefined>(undefined);
  cache: Set<string> = new Set();
  cachedChunkSize = 0;

  readonly isLoading = signal(0);

  private serverResultsService = inject(MockServerResultsService);

  onFetchRows(event: FetchRowsEvent) {
    this.rowsOffset.set(event.startIndex);

    const chunkSize = event.endIndex - event.startIndex;
    const cacheKey = `${event.startIndex}-${event.endIndex}`;

    // We keep an index of fetched chunks so we don't load same data twice
    if (this.cachedChunkSize !== chunkSize) {
      this.cachedChunkSize = chunkSize;
      this.cache.clear();
    }
    if (this.cache.has(cacheKey)) {
      return;
    }
    this.cache.add(cacheKey);

    this.isLoading.update(v => v + 1);

    this.serverResultsService.getResults(event.startIndex, event.endIndex).subscribe(result => {
      this.totalElements.set(result.totalElements);

      const currentRows = this.rows() ?? new Array<Employee>(this.totalElements() || 0);

      const rows = [...currentRows];

      for (let i = 0; i < result.data.length; i++) {
        rows[event.startIndex + i] = result.data[i];
      }

      this.rows.set(rows);

      this.isLoading.update(v => v - 1);
    });
  }
}
