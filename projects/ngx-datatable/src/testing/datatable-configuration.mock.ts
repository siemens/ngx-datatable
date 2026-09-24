import { Provider, Signal, signal } from '@angular/core';

import { DatatableConfiguration } from '../lib/components/datatable-configuration';
import { DatatableComponent } from '../lib/components/datatable.component';
import { NgxDatatableConfig } from '../lib/ngx-datatable.config';

export interface DatatableConfigurationOverrides {
  rowHeight?: Signal<NgxDatatableConfig['rowHeight']>;
  headerHeight?: Signal<NgxDatatableConfig['headerHeight']>;
  footerHeight?: Signal<NgxDatatableConfig['footerHeight']>;
  hideFooter?: Signal<boolean | undefined>;
  cssClasses?: Signal<NgxDatatableConfig['cssClasses']>;
  messages?: Signal<NgxDatatableConfig['messages']>;
}

export const provideDatatableConfigurationMock = (
  overrides: DatatableConfigurationOverrides = {}
): Provider => {
  const {
    rowHeight = signal(30),
    headerHeight = signal(30),
    footerHeight = signal<number | undefined>(undefined),
    hideFooter = signal<boolean | undefined>(false),
    cssClasses = signal({}),
    messages = signal({})
  } = overrides;
  const table = {
    rowHeight,
    headerHeight,
    footerHeight,
    hideFooter,
    cssClasses,
    messages
  };
  const configuration = new DatatableConfiguration(table as unknown as DatatableComponent, {});

  return {
    provide: DatatableConfiguration,
    useValue: configuration
  };
};
