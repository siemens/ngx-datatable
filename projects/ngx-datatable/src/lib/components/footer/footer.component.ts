import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, output, Signal } from '@angular/core';

import { FooterContext, PagerPageEvent } from '../../types/public.types';
import { DatatableConfiguration } from '../datatable-configuration';
import { TableController } from '../table-controller';
import { DatatableFooterDirective } from './footer.directive';
import { DatatablePagerComponent } from './pager.component';

@Component({
  selector: 'datatable-footer',
  imports: [NgTemplateOutlet, DatatablePagerComponent],
  template: `
    <div
      class="datatable-footer-inner"
      [class.selected-count]="controller.showSelectedMessage()"
      [style.height.px]="configuration().footerHeight"
    >
      @let footerTemplate = this.footerTemplate()?.template();
      @if (footerTemplate) {
        <ng-template
          [ngTemplateOutlet]="footerTemplate"
          [ngTemplateOutletContext]="templateContext()"
        />
      } @else {
        <div class="page-count">
          @if (controller.showSelectedMessage()) {
            <span>
              {{ controller.selectedCount().toLocaleString() }}
              {{ configuration().messages.selectedMessage }} /
            </span>
          }
          {{ controller.footerRowCount().toLocaleString() }}
          {{ configuration().messages.totalMessage }}
        </div>
        @if (isVisible()) {
          <ngx-datatable-pager />
        }
      }
    </div>
  `,
  styleUrl: './footer.component.scss',
  host: {
    class: 'datatable-footer'
  }
})
export class DataTableFooterComponent {
  protected readonly configuration = inject(DatatableConfiguration).configuration;
  protected readonly controller = inject(TableController);
  readonly footerTemplate = input<DatatableFooterDirective | undefined>();

  readonly page = output<PagerPageEvent>();

  protected readonly isVisible = computed(
    () => this.controller.footerRowCount() / this.controller.pageSize() > 1
  );
  protected readonly templateContext: Signal<FooterContext> = computed(() => ({
    rowCount: this.controller.footerRowCount(),
    pageSize: this.controller.pageSize(),
    selectedCount: this.controller.selectedCount(),
    curPage: this.controller.currentPage(),
    offset: this.controller.offset()
  }));
}
