import { Component, computed, inject } from '@angular/core';

import { Page } from '../../types/internal.types';
import { DatatableConfiguration } from '../datatable-configuration';
import { TableController } from '../table-controller';

/**
 * Use this component to construct custom table footer with standard pagination.
 *
 * It must be used inside the `ngx-datatable-footer`
 *
 * @example
 * ```html
 *
 * <ngx-datatable>
 *   ...
 *   <ngx-datatable-footer>
 *     <ng-template>
 *        <app-custom-content />
 *        <ngx-datatable-pager />
 *     </ng-template>
 *   </ngx-datatable-footer>
 * </ngx-datatable>
 * ```
 */
@Component({
  selector: 'ngx-datatable-pager',
  template: `
    <ul class="pager">
      <li>
        <button
          type="button"
          class="page-button"
          [disabled]="!canPrevious()"
          [attr.aria-label]="configuration().messages.ariaFirstPageMessage"
          (click)="selectPage(1)"
        >
          <i [class]="configuration().cssClasses.pagerPrevious"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          class="page-button"
          [disabled]="!canPrevious()"
          [attr.aria-label]="configuration().messages.ariaPreviousPageMessage"
          (click)="prevPage()"
        >
          <i [class]="configuration().cssClasses.pagerLeftArrow"></i>
        </button>
      </li>
      @for (pg of pages(); track pg.number) {
        <li class="pages">
          <button
            type="button"
            class="page-button"
            [class.active]="pg.number === controller.currentPage()"
            [attr.aria-label]="configuration().messages.ariaPageNMessage + ' ' + pg.number"
            (click)="selectPage(pg.number)"
          >
            {{ pg.text }}
          </button>
        </li>
      }
      <li>
        <button
          type="button"
          class="page-button"
          [disabled]="!canNext()"
          [attr.aria-label]="configuration().messages.ariaNextPageMessage"
          (click)="nextPage()"
        >
          <i [class]="configuration().cssClasses.pagerRightArrow"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          class="page-button"
          [disabled]="!canNext()"
          [attr.aria-label]="configuration().messages.ariaLastPageMessage"
          (click)="selectPage(totalPages())"
        >
          <i [class]="configuration().cssClasses.pagerNext"></i>
        </button>
      </li>
    </ul>
  `,
  styleUrl: './pager.component.scss',
  host: {
    class: 'datatable-pager'
  }
})
export class DatatablePagerComponent {
  protected readonly configuration = inject(DatatableConfiguration).configuration;
  protected readonly controller = inject<TableController>(TableController);

  protected readonly totalPages = computed(() => {
    const pageSize = this.controller.pageSize();
    return Math.max(
      (pageSize < 1 ? 1 : Math.ceil(this.controller.paginationCount() / pageSize)) || 0,
      1
    );
  });

  protected readonly pages = computed(() => {
    const pages: Page[] = [];
    let startPage = 1;
    let endPage = this.totalPages();
    const maxSize = 5;
    const isMaxSized = maxSize < this.totalPages();

    const page = this.controller.currentPage();

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages());
      } else if (endPage > this.totalPages()) {
        startPage = Math.max(this.totalPages() - maxSize + 1, 1);
        endPage = this.totalPages();
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        number: num,
        text: num.toString()
      });
    }

    return pages;
  });

  protected readonly canPrevious = computed(() => this.controller.currentPage() > 1);

  protected readonly canNext = computed(() => this.controller.currentPage() < this.totalPages());

  protected prevPage(): void {
    this.selectPage(this.controller.currentPage() - 1);
  }

  protected nextPage(): void {
    this.selectPage(this.controller.currentPage() + 1);
  }

  protected selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages() && page !== this.controller.currentPage()) {
      this.controller.selectPage(page);
    }
  }
}
