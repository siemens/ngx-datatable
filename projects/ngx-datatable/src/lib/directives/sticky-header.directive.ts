import { Directive, Host, HostListener, OnInit, Optional } from '@angular/core';
import { DatatableComponent } from '@siemens/ngx-datatable';

@Directive({
  selector: '[stickyHeader]',
  standalone: true,
})
export class StickyHeaderDirective implements OnInit {
  private _isFixed = false;

  constructor(@Host() @Optional() private ngxDatatable: DatatableComponent) {}

  ngOnInit() {
    if (!this.ngxDatatable) {
      throw new Error('StickyHeaderDirective must be used with ngx-datatable');
    }
  }

    @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const header: HTMLElement = this.ngxDatatable?.element?.querySelector('.datatable-header');
    const headerRect = header.getBoundingClientRect();
    const tableRect = this.ngxDatatable?.element?.getBoundingClientRect();

    const shouldFixHeader = tableRect.top <= 0 && tableRect.bottom - headerRect.height > 0;
    if (shouldFixHeader && !this.isFixed) {
      this.applyFixedStyles(header);
      this.isFixed = true;
    } else if (!shouldFixHeader && this.isFixed) {
      this.resetStyles(header);
      this.isFixed = false;
    }
  }

  private applyFixedStyles(header: HTMLElement) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.zIndex = '1000';
    header.style.backgroundColor = 'white';
    this.ngxDatatable.element.style.marginTop = `${header.getBoundingClientRect().height}px`;
  }

  private resetStyles(header: HTMLElement) {
    header.style.position = null;
    header.style.top = null;
    header.style.zIndex = null;
    header.style.backgroundColor = null;
    this.ngxDatatable.element.style.marginTop = null;
  }
}
