import { InjectionToken, Provider } from '@angular/core';

/** Interface for messages to override default table texts. */
export interface NgxDatatableMessages {
  /** Message to show when the array is present but empty */
  emptyMessage?: string;
  /** Footer total message */
  totalMessage?: string;
  /** Footer selected message */
  selectedMessage?: string;
  /** Pager screen reader message for the first page button */
  ariaFirstPageMessage?: string;
  /**
   * Pager screen reader message for the n-th page button.
   * It will be rendered as: `{{ariaPageNMessage}} {{n}}`.
   */
  ariaPageNMessage?: string;
  /** Pager screen reader message for the previous page button */
  ariaPreviousPageMessage?: string;
  /** Pager screen reader message for the next page button */
  ariaNextPageMessage?: string;
  /** Pager screen reader message for the last page button */
  ariaLastPageMessage?: string;
  /** Row checkbox aria label */
  ariaRowCheckboxMessage?: string;
  /** Header checkbox aria label */
  ariaHeaderCheckboxMessage?: string;
  /** Group header checkbox aria label */
  ariaGroupHeaderCheckboxMessage?: string;
  /** Loading indicator aria label */
  ariaLoadingMessage?: string;
}

/** CSS classes for icons that override the default table icons. */
export interface NgxDatatableCssClasses {
  sortAscending?: string;
  sortDescending?: string;
  sortUnset?: string;
  pagerLeftArrow?: string;
  pagerRightArrow?: string;
  pagerPrevious?: string;
  pagerNext?: string;
  treeStatusLoading?: string;
  treeStatusExpanded?: string;
  treeStatusCollapsed?: string;
}

/** Interface definition for ngx-datatable global configuration. */
export interface NgxDatatableConfig {
  messages?: NgxDatatableMessages;
  cssClasses?: NgxDatatableCssClasses;
  headerHeight?: number | 'auto';
  footerHeight?: number;
  rowHeight?: number | 'auto' | ((row: any) => number);
  defaultColumnWidth?: number;
}

export const NGX_DATATABLE_CONFIG = new InjectionToken<NgxDatatableConfig>('ngx-datatable.config');

/**
 * Interface definition for INgxDatatableConfig global configuration.
 *
 * @deprecated Use {@link NgxDatatableConfig} instead.
 */
export type INgxDatatableConfig = NgxDatatableConfig;

/**
 * Provides a global configuration for ngx-datatable.
 *
 * @param overrides The overrides of the table configuration.
 */
export const providedNgxDatatableConfig = (overrides: NgxDatatableConfig): Provider => {
  return {
    provide: NGX_DATATABLE_CONFIG,
    useValue: overrides
  };
};
