import { Component, DebugElement, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideDatatableConfigurationMock } from '../../../testing/datatable-configuration.mock';
import { createTableControllerMock } from '../../../testing/table-controller.mock';
import { DataTableFooterTemplateDirective } from './footer-template.directive';
import { DataTableFooterComponent } from './footer.component';
import { DatatableFooterDirective } from './footer.directive';

let fixture: ComponentFixture<TestFixtureComponent>;
let component: TestFixtureComponent;
let page: Page;
let controllerMock: ReturnType<typeof createTableControllerMock>;
const footerHeight = signal(0);

describe('DataTableFooterComponent', () => {
  beforeEach(async () => {
    footerHeight.set(0);
    controllerMock = createTableControllerMock();
    controllerMock.state.externalPaging.set(true);
    controllerMock.state.count.set(100);
    controllerMock.state.limit.set(1);
    controllerMock.table.onFooterPage = ({ page: pageNumber }: { page: number }) =>
      controllerMock.state.offset.set(pageNumber - 1);
    TestBed.overrideComponent(TestFixtureComponent, {
      add: { providers: [controllerMock.provider] }
    });
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    page = new Page();
    await page.detectChangesAndRunQueries();
  });

  describe('div.datatable-footer-inner', () => {
    it(`should have a height`, async () => {
      footerHeight.set(123);
      await page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement.style.height).toEqual('123px');
    });

    it('should have `.selected-count` class when selectedMessage is set', async () => {
      controllerMock.state.selectionType.set('multi');
      controllerMock.state.selected.set([{}]);
      await page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement.classList.contains('selected-count')).toBe(
        true
      );
    });

    it('should not have `.selected-count` class if selectedMessage is not set', async () => {
      controllerMock.state.selectionType.set(undefined);
      await page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement.classList.contains('selected-count')).toBe(
        false
      );
    });
  });

  describe('when there is no template', () => {
    it('should not render a template', async () => {
      component.footerTemplate.set(undefined);
      await page.detectChangesAndRunQueries();

      expect(page.templateList).toBeNull();
    });

    it('should display the selected count and total if selectedMessage set', async () => {
      component.footerTemplate.set(undefined);
      controllerMock.state.selectionType.set('multi');
      controllerMock.state.selected.set(Array.from({ length: 7 }, () => ({})));
      controllerMock.state.count.set(10);
      await page.detectChangesAndRunQueries();

      expect(page.pageCount.nativeElement.innerText).toEqual('7 selected / 10 total');
    });

    it('should display only the total if selectedMessage is not set', async () => {
      component.footerTemplate.set(undefined);
      controllerMock.state.selectionType.set(undefined);
      controllerMock.state.count.set(100);
      await page.detectChangesAndRunQueries();

      expect(page.pageCount.nativeElement.innerText).toEqual('100 total');
    });

    it('should render a DataTablePagerComponent', async () => {
      component.footerTemplate.set(undefined);
      await page.detectChangesAndRunQueries();

      expect(page.datatablePager).not.toBeNull();
    });

    it('should show & hide the DataTablePagerComponent', async () => {
      controllerMock.state.count.set(200);
      controllerMock.state.limit.set(5);
      await page.detectChangesAndRunQueries();

      expect(page.datatablePager).toBeTruthy();

      controllerMock.state.count.set(1);
      controllerMock.state.limit.set(2);
      await page.detectChangesAndRunQueries();

      expect(page.datatablePager).toBeFalsy();
    });
  });

  describe('when there is a template', () => {
    it('should not render div.page-count or DatatablePagerComponent', async () => {
      component.footerTemplate.set(component.footerTemplateDirective());
      await page.detectChangesAndRunQueries();

      expect(page.pageCount).toBeNull();
      expect(page.datatablePager).toBeNull();
    });

    it('should render the template', async () => {
      await page.detectChangesAndRunQueries();
      component.footerTemplate.set(component.footerTemplateDirective());
      await page.detectChangesAndRunQueries();

      expect(page.templateList).not.toBeNull();
    });

    it('should give the template proper context', async () => {
      component.footerTemplate.set(component.footerTemplateDirective());
      controllerMock.state.count.set(12);
      controllerMock.state.limit.set(1);
      controllerMock.state.selected.set(Array.from({ length: 4 }, () => ({})));
      controllerMock.state.offset.set(0);
      await page.detectChangesAndRunQueries();
      const listItems = page.templateList.queryAll(By.css('li'));

      expect(listItems[0].nativeElement.innerHTML).toContain('rowCount 12');
      expect(listItems[1].nativeElement.innerHTML).toContain('pageSize 1');
      expect(listItems[2].nativeElement.innerHTML).toContain('selectedCount 4');
      expect(listItems[3].nativeElement.innerHTML).toContain('curPage 1');
      expect(listItems[4].nativeElement.innerHTML).toContain('offset 0');
    });
  });
});

/**
 * we test DatatableFooterComponent by embedding it in a
 * test host component
 */
@Component({
  imports: [DataTableFooterComponent, DatatableFooterDirective, DataTableFooterTemplateDirective],
  template: `
    <datatable-footer [footerTemplate]="footerTemplate()" (page)="onPageEvent()" />

    <ngx-datatable-footer>
      <ng-template
        #testTemplate
        let-rowCount="rowCount"
        let-pageSize="pageSize"
        let-selectedCount="selectedCount"
        let-curPage="curPage"
        let-offset="offset"
        ngx-datatable-footer-template
      >
        <ul id="template-list">
          <li>rowCount {{ rowCount }}</li>
          <li>pageSize {{ pageSize }}</li>
          <li>selectedCount {{ selectedCount }}</li>
          <li>curPage {{ curPage }}</li>
          <li>offset {{ offset }}</li>
        </ul>
      </ng-template>
    </ngx-datatable-footer>
  `,
  providers: [provideDatatableConfigurationMock({ footerHeight })]
})
class TestFixtureComponent {
  readonly footerHeight = signal(0);
  readonly footerTemplate = signal<DatatableFooterDirective | undefined>(undefined);
  readonly messages = signal({});

  /**
   * establishes a reference to a test template that can
   * selectively be passed to the DatatableFooterComponent
   * in these unit tests
   */
  readonly footerTemplateDirective = viewChild.required(DatatableFooterDirective);

  onPageEvent() {
    return;
  }
}

/**
 * a Page is a collection of references to DebugElements. it
 * makes for cleaner testing
 */
class Page {
  datatableFooter!: DebugElement;
  datatableFooterInner!: DebugElement;
  templateList!: DebugElement;
  pageCount!: DebugElement;
  datatablePager!: DebugElement;

  async detectChangesAndRunQueries() {
    await fixture.whenStable();

    const de = fixture.debugElement;

    this.datatableFooter = de.query(By.css('datatable-footer'));
    this.datatableFooterInner = de.query(By.css('.datatable-footer-inner'));
    this.templateList = de.query(By.css('#template-list'));
    this.pageCount = de.query(By.css('.page-count'));
    this.datatablePager = de.query(By.css('ngx-datatable-pager'));
  }
}
