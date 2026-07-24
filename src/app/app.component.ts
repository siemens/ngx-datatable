import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import packageInfo from '../../projects/ngx-datatable/package.json';
import { ExampleTitleComponent } from './example-title.component';

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

  routeActivate(outlet: RouterOutlet): void {
    const { dark = false, sourcePath = '', title = '' } = outlet.activatedRoute.snapshot.data;

    this.dark.set(dark);
    this.sourcePath.set(sourcePath);
    this.title.set(title);
  }
}
