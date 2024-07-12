import { Directive, Host, HostListener, OnInit, Optional } from '@angular/core';
import { DatatableComponent } from '@siemens/ngx-datatable';

@Directive({
  selector: '[stickyHeader]',
  standalone: true,
})
export class StickyHeaderDirective implements OnInit {
  private _isFixed = false;
  private _shouldBeFixed = false;

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
    if (shouldFixHeader && !this._isFixed) {
      if (this._shouldBeFixed) {
        this.applyFixedStyles(header);
        this.ngxDatatable.element.style.paddingTop = `${headerRect.height}px`;
        this._isFixed = true;
      }
      this._shouldBeFixed = true;
    } else if (!shouldFixHeader && this._isFixed) {
      if (!this._shouldBeFixed) {
        this.resetStyles(header);
        this._isFixed = false;
      }
      this._shouldBeFixed = false;
    }
  }

  private applyFixedStyles(header: HTMLElement) {
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.zIndex = '1000';
    header.style.backgroundColor = 'white';
  }

  private resetStyles(header: HTMLElement) {
    header.style.position = '';
    header.style.top = '';
    header.style.zIndex = '';
    header.style.backgroundColor = '';
    this.ngxDatatable.element.style.paddingTop = '';
  }
}
