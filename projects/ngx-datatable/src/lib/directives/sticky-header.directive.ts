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
    const datatableHeader = this.ngxDatatable?.element?.querySelector('.datatable-header') as HTMLElement;
    const datatableHeaderBoundingClientRect = datatableHeader.getBoundingClientRect();
    const datatableBoundingClientRect = this.ngxDatatable?.element?.getBoundingClientRect();
    console.log('datatableHeader bounding client rect', datatableHeaderBoundingClientRect);
    console.log('datatable bounding client rect', this.ngxDatatable.element.getBoundingClientRect());
    const datatableYTopInViewport = this._isFixed
      ? datatableBoundingClientRect.top - datatableHeaderBoundingClientRect.height
      : datatableHeaderBoundingClientRect.top;

    // 2 * datatableHeaderBoundingClientRect?.height is used to account for the height of the potential sticky header
    // and the height of the header that is now unfixed (so the table was "pushed" by the top by the header that is now unfixed)
    const datatableYBottomInViewport = datatableBoundingClientRect.bottom - datatableHeaderBoundingClientRect?.height;

    if (datatableYTopInViewport <= 0 && datatableYBottomInViewport > 0) {
      datatableHeader.style.position = 'fixed';
      datatableHeader.style.top = '0';
      datatableHeader.style.zIndex = '1000';
      datatableHeader.style.backgroundColor = 'white';
      this.ngxDatatable.element.style.marginTop = `${datatableHeaderBoundingClientRect?.height}px`;
      this._isFixed = true;
    } else {
      datatableHeader.style.position = null;
      datatableHeader.style.top = null;
      datatableHeader.style.zIndex = null;
      datatableHeader.style.backgroundColor = null;
      this.ngxDatatable.element.style.marginTop = null;
      this._isFixed = false;
    }
  }
}
