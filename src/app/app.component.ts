import { Component, signal, ViewEncapsulation } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import packageInfo from 'projects/ngx-datatable/package.json';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  standalone: true,
  imports: [RouterLink, RouterOutlet]
})
export class AppComponent {
  version = packageInfo.version;

  dark = signal(false);

  routeActivate(outlet: RouterOutlet): void {
    this.dark.set(outlet.activatedRoute.snapshot.data.dark);
  }
}
