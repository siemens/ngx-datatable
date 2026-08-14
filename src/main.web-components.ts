import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationRef,
  createEnvironmentInjector,
  provideZonelessChangeDetection,
  type Type
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { providedNgxDatatableConfig } from '@siemens/ngx-datatable';

import { DATA_ASSETS_URL } from './app/data.service';

declare global {
  interface Window {
    loadDatatableExample(example: string): Promise<void>;
  }
}

createApplication({
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    providedNgxDatatableConfig({}),
    { provide: DATA_ASSETS_URL, useValue: new URL('./assets/data/', import.meta.url).href }
  ]
})
  .then(appRef => {
    window.loadDatatableExample = async example => {
      switch (example) {
        case 'fluid-row-height': {
          registerExample(
            'ngx-datatable-fluid-row-height',
            await import('./app/basic/fluid-row-height.component').then(
              c => c.FluidRowHeightComponent
            ),
            appRef
          );
          return;
        }
        case 'standard-column': {
          registerExample(
            'ngx-datatable-standard-column',
            await import('./app/columns/fixed-column.component').then(c => c.FixedColumnComponent),
            appRef
          );
          return;
        }
        case 'flex-column': {
          registerExample(
            'ngx-datatable-flex-column',
            await import('./app/columns/flex-column.component').then(c => c.FlexColumnComponent),
            appRef
          );
          return;
        }
        case 'force-column': {
          registerExample(
            'ngx-datatable-force-column',
            await import('./app/columns/force-column.component').then(c => c.ForceColumnComponent),
            appRef
          );
          return;
        }
        default:
          throw new Error(`Unknown datatable example: ${example}`);
      }
    };

    window.dispatchEvent(new Event('ngx-datatable-examples-ready'));
  })
  .catch(err => console.error(err));

const registerExample = (
  tagName: string,
  component: Type<unknown>,
  appRef: ApplicationRef
): void => {
  if (customElements.get(tagName)) {
    return;
  }

  const injector = createEnvironmentInjector([], appRef.injector);
  customElements.define(tagName, createCustomElement(component, { injector }));
};
