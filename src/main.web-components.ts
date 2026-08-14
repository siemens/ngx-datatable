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

import { routes } from './app/app.routes';
import { DATA_ASSETS_URL } from './app/data.service';

const exampleLoaders = new Map(
  routes.flatMap(route =>
    route.path && route.loadComponent ? [[route.path, route.loadComponent] as const] : []
  )
);

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
      const loadComponent = exampleLoaders.get(example);
      if (!loadComponent) {
        throw new Error(`Unknown datatable example: ${example}`);
      }

      const componentPromise = loadComponent();
      if (!(componentPromise instanceof Promise)) {
        throw new Error(`Invalid datatable example component: ${example}`);
      }

      const componentResult = await componentPromise;
      const component = 'default' in componentResult ? componentResult.default : componentResult;
      registerExample(`ngx-datatable-${example}`, component, appRef);
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
