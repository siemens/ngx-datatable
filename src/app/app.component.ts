import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import packageInfo from '../../projects/ngx-datatable/package.json';
import { ExampleTitleComponent } from './example-title.component';

interface ExampleComponentConstructor {
  dark?: boolean;
  exampleTitle: string;
}

@Component({
  selector: 'app-root',
  imports: [ExampleTitleComponent, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ]
})
export class AppComponent {
  version = packageInfo.version;

  readonly dark = signal(false);
  readonly title = signal('');
  readonly sourcePath = signal('');

  routeActivate(component: object, outlet: RouterOutlet): void {
    const { sourcePath = '' } = outlet.activatedRoute.snapshot.data;
    const example = component.constructor as unknown as ExampleComponentConstructor;

    this.dark.set(example.dark ?? false);
    this.sourcePath.set(sourcePath);
    this.title.set(example.exampleTitle);
  }
}
