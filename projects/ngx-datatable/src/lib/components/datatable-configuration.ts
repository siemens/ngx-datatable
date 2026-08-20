import { computed } from '@angular/core';

import type { NgxDatatableConfig } from '../ngx-datatable.config';
import type { DatatableComponent } from './datatable.component';

type AllRequired<T> = T extends (...args: any[]) => any
  ? T
  : { [K in keyof T]-?: AllRequired<NonNullable<T[K]>> };

/** @internal */
export class DatatableConfiguration {
  readonly configuration = computed<AllRequired<NgxDatatableConfig>>(() => {
    const configuration = this.globalConfiguration;

    return {
      ...configuration,
      defaultColumnWidth: configuration.defaultColumnWidth ?? 150,
      rowHeight: this.datatable.rowHeight(),
      headerHeight: this.datatable.headerHeight(),
      footerHeight: this.datatable.footerHeight() ?? 0,
      cssClasses: {
        sortAscending: 'datatable-icon-up',
        sortDescending: 'datatable-icon-down',
        sortUnset: 'datatable-icon-sort-unset',
        pagerLeftArrow: 'datatable-icon-left',
        pagerRightArrow: 'datatable-icon-right',
        pagerPrevious: 'datatable-icon-prev',
        pagerNext: 'datatable-icon-skip',
        treeStatusLoading: 'icon datatable-icon-collapse',
        treeStatusExpanded: 'icon datatable-icon-down',
        treeStatusCollapsed: 'icon datatable-icon-up',
        ...configuration.cssClasses,
        ...this.datatable.cssClasses()
      },
      messages: {
        emptyMessage: 'No data to display',
        totalMessage: 'total',
        selectedMessage: 'selected',
        ariaFirstPageMessage: 'go to first page',
        ariaPageNMessage: 'page',
        ariaPreviousPageMessage: 'go to previous page',
        ariaNextPageMessage: 'go to next page',
        ariaLastPageMessage: 'go to last page',
        ariaRowCheckboxMessage: 'Select row',
        ariaHeaderCheckboxMessage: 'Select all rows',
        ariaGroupHeaderCheckboxMessage: 'Select row group',
        ariaLoadingMessage: 'Loading',
        ...configuration.messages,
        ...this.datatable.messages()
      }
    };
  });

  constructor(
    private readonly datatable: DatatableComponent,
    private readonly globalConfiguration: NgxDatatableConfig
  ) {}
}
