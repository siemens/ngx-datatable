import { Component, signal, ViewEncapsulation } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import packageInfo from 'projects/ngx-datatable/package.json';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss',
    '../../projects/ngx-datatable/src/lib/themes/material.scss',
    '../../projects/ngx-datatable/src/lib/themes/dark.scss',
    '../../projects/ngx-datatable/src/lib/themes/bootstrap.scss'
  ],
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

  dark = signal(false);

  routeActivate(outlet: RouterOutlet): void {
    this.dark.set(outlet.activatedRoute.snapshot.data.dark);
  }
}
