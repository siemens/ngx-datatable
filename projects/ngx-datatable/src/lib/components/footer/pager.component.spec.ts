import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DebugElement,
  signal,
  WritableSignal
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatatableComponent } from '@siemens/ngx-datatable';

import { provideDatatableConfigurationMock } from '../../../testing/datatable-configuration.mock';
import { createTableControllerMock } from '../../../testing/table-controller.mock';
import { DatatablePagerComponent } from './pager.component';
import { PagerHarness } from './testing/pager.harness';

describe('DataTablePagerComponent', () => {
  let fixture: ComponentFixture<DatatablePagerComponent>;
  let harness: PagerHarness;
  let controllerMock: ReturnType<typeof createTableControllerMock>;
  let messages: WritableSignal<ReturnType<DatatableComponent['messages']>>;

  beforeEach(async () => {
    controllerMock = createTableControllerMock();
    controllerMock.state.externalPaging.set(true);
    controllerMock.table.onFooterPage = ({ page }: { page: number }) =>
      controllerMock.state.offset.set(page - 1);
    messages = signal({});
    TestBed.overrideComponent(DatatablePagerComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [provideDatatableConfigurationMock({ messages }), controllerMock.provider]
      }
    });
    fixture = TestBed.createComponent(DatatablePagerComponent);
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, PagerHarness);
  });

  describe('totalPages', () => {
    it('should calculate totalPages', async () => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(28);
      expect(await harness.pageCount()).toEqual(3);
    });

    it('should have 1 page if size is 0', async () => {
      controllerMock.state.limit.set(0);
      controllerMock.state.count.set(28);
      expect(await harness.pageCount()).toEqual(1);
    });

    it('should have 1 page if count is 0', async () => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(0);
      expect(await harness.pageCount()).toEqual(1);
    });

    it('should prefer using groupCount if available', async () => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(28);
      controllerMock.state.externalPaging.set(false);
      controllerMock.state.groupedRows.set(
        Array.from({ length: 53 }, (_, key) => ({ key, value: [] }))
      );
      expect(await harness.pageCount()).toEqual(5);
    });
  });

  describe('canPrevious()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
    });

    it('should return true if not on first page', async () => {
      controllerMock.state.offset.set(2 - 1);
      expect(await harness.hasPrevious()).toBe(true);
    });

    it('should return false if on first page', async () => {
      controllerMock.state.offset.set(1 - 1);
      expect(await harness.hasPrevious()).toBe(false);
    });
  });

  describe('canNext()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
    });

    it('should return true if not on last page', async () => {
      controllerMock.state.offset.set(2 - 1);
      expect(await harness.hasNext()).toBe(true);
    });

    it('should return false if on last page', async () => {
      controllerMock.state.offset.set(10 - 1);
      expect(await harness.hasNext()).toBe(false);
    });
  });

  describe('prevPage()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
    });

    it('should set current page to previous page', async () => {
      controllerMock.state.offset.set(2 - 1);
      await harness.clickPrevious();
      expect(await harness.currentPage()).toEqual(1);
    });

    it('should emit change event', async () => {
      const onFooterPage = vi.spyOn(controllerMock.table, 'onFooterPage');
      controllerMock.state.offset.set(2 - 1);
      await harness.clickPrevious();
      expect(onFooterPage).toHaveBeenCalledWith({ page: 1 });
    });

    it('should not change page if already on first page', async () => {
      controllerMock.state.offset.set(1 - 1);
      await harness.clickPrevious();
      expect(await harness.currentPage()).toEqual(1);
    });
  });

  describe('nextPage()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
    });

    it('should set current page to next page', async () => {
      controllerMock.state.offset.set(2 - 1);
      await harness.clickNext();
      expect(await harness.currentPage()).toEqual(3);
    });

    it('should emit change event', async () => {
      const onFooterPage = vi.spyOn(controllerMock.table, 'onFooterPage');
      controllerMock.state.offset.set(2 - 1);
      await harness.clickNext();
      expect(onFooterPage).toHaveBeenCalledWith({ page: 3 });
    });

    it('should not change page if already on last page', async () => {
      controllerMock.state.offset.set(10 - 1);
      await harness.clickNext();
      expect(await harness.currentPage()).toEqual(10);
    });
  });

  describe('selectPage()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
      controllerMock.state.offset.set(1 - 1);
    });

    describe('with a new page', () => {
      it('should set current page', async () => {
        await harness.clickPage(3);
        expect(await harness.currentPage()).toEqual(3);
      });

      it('should emit change event', async () => {
        const onFooterPage = vi.spyOn(controllerMock.table, 'onFooterPage');
        await harness.clickPage(3);
        expect(onFooterPage).toHaveBeenCalledWith({ page: 3 });

        await harness.clickPage(4);
        expect(onFooterPage).toHaveBeenCalledWith({ page: 4 });
      });
    });

    describe('with the current page', () => {
      it('should not emit change event', async () => {
        const onFooterPage = vi.spyOn(controllerMock.table, 'onFooterPage');
        await harness.clickPage(controllerMock.controller.currentPage());
        expect(onFooterPage).not.toHaveBeenCalled();
      });
    });
  });

  describe('calcPages()', () => {
    beforeEach(() => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(73);
      controllerMock.state.offset.set(1 - 1);
    });

    it('should return array with max 5 pages to display', async () => {
      expect(await harness.pageRange()).toEqual('1-5');
    });

    it('should return array with available pages to display', async () => {
      controllerMock.state.count.set(30);
      expect(await harness.pageRange()).toEqual('1-3');
    });

    it('should return array containing specified page', async () => {
      controllerMock.state.offset.set(6 - 1);
      expect(await harness.pageRange()).toEqual('4-8');
    });
  });

  describe('localisation', () => {
    let firstButton: DebugElement;
    let previousButton: DebugElement;
    let nextButton: DebugElement;
    let lastButton: DebugElement;
    let pageButtons: {
      button: DebugElement;
      page: number;
    }[];
    beforeEach(async () => {
      controllerMock.state.limit.set(10);
      controllerMock.state.count.set(100);
      await fixture.whenStable();
      [firstButton, previousButton, nextButton, lastButton] = fixture.debugElement
        .queryAll(By.css('.page-button'))
        .filter(it => !it.parent!.classes.pages);
      pageButtons = fixture.debugElement
        .queryAll(By.css('li.pages'))
        .map((button, index) => ({ button, page: index + 1 }));
    });

    const ariaLabel = (element: DebugElement): string | null => {
      return element?.attributes['aria-label'] ?? null;
    };

    describe('takes messages-overrides from table', () => {
      const setMessages = (overrides: ReturnType<DatatableComponent['messages']>) => {
        messages.set(overrides);
        // do a change detection on the real changeDetectionRef
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
      };

      it('first button', () => {
        setMessages({ ariaFirstPageMessage: 'link: first page' });
        expect(ariaLabel(firstButton)).toEqual('link: first page');
      });

      it('previous button', () => {
        setMessages({ ariaPreviousPageMessage: 'link: previous page' });
        expect(ariaLabel(previousButton)).toEqual('link: previous page');
      });

      it('next button', () => {
        setMessages({ ariaNextPageMessage: 'link: next page' });
        expect(ariaLabel(nextButton)).toEqual('link: next page');
      });

      it('last button', () => {
        setMessages({ ariaLastPageMessage: 'link: last page' });
        expect(ariaLabel(lastButton)).toEqual('link: last page');
      });

      // FIXME: Test is flakey/broken and should be replaced
      it.skip('page buttons', () => {
        setMessages({ ariaPageNMessage: 'link: page' });
        for (const { button, page } of pageButtons) {
          expect(ariaLabel(button), `${page} button`).toEqual(`link: page ${page}`);
        }
      });
    });
  });
});
