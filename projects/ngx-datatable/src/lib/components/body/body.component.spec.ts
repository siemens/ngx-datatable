import { EventEmitter, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideDatatableConfigurationMock } from '../../../testing/datatable-configuration.mock';
import { createTableControllerMock } from '../../../testing/table-controller.mock';
import { ScrollContainerDirective } from '../../directives/scroll-container.directive';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { toInternalColumn } from '../../utils/column-helper';
import { DATATABLE_COMPONENT_TOKEN } from '../../utils/table-token';
import { TableController } from '../table-controller';
import { DataTableBodyRowComponent } from './body-row.component';
import { DataTableBodyComponent } from './body.component';
import { DataTableGhostLoaderComponent } from './ghost-loader/ghost-loader.component';
import { ScrollerComponent } from './scroller.component';

/**
 * The body is rendered in isolation here, without the surrounding `role="table"`
 * grid that normally carries {@link ScrollContainerDirective}, so the scroller's
 * required injection is satisfied with a no-op stub.
 */
const scrollContainerStub: Partial<ScrollContainerDirective> = {
  scrollTop: 0,
  verticalScrollVisible: false,
  setScrollTop: () => {},
  scrollTo: () => {},
  listenToScroll: () => () => {}
};

describe('DataTableBodyComponent', () => {
  let fixture: ComponentFixture<DataTableBodyComponent>;
  let component: DataTableBodyComponent;
  let rowHeight: WritableSignal<any>;
  type ControllerMock = ReturnType<typeof createTableControllerMock<any>>;
  let controller: TableController<any>;
  let state: ControllerMock['state'];
  let table: ControllerMock['table'];
  let provider: ControllerMock['provider'];

  // provide our implementations or mocks to the dependency injector
  beforeEach(async () => {
    ({ controller, state, table, provider } = createTableControllerMock<any>());
    rowHeight = table.rowHeight;
    table.headerHeight.set(0);
    rowHeight.set('auto');
    TestBed.configureTestingModule({
      providers: [
        ScrollbarHelper,
        { provide: DATATABLE_COMPONENT_TOKEN, useValue: {} },
        provideDatatableConfigurationMock({ rowHeight }),
        provider,
        { provide: ScrollContainerDirective, useValue: scrollContainerStub }
      ]
    });
    fixture = TestBed.createComponent(DataTableBodyComponent);
    fixture.componentRef.setInput('rowDragEvents', new EventEmitter<any>());
    table.rowIdentity.set((row: any) => row);
    controller.offsetX.set(0);
    component = fixture.componentInstance;
  });

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Paging', () => {
    it('should have correct indexes for normal paging with rows > pageSize', () => {
      state.externalPaging.set(false);
      state.rows.set(Array.from({ length: 20 }, (_, index) => ({ num: index + 1 })));
      state.limit.set(10);
      state.offset.set(1);
      state.count.set(20);
      const expectedIndexes = { first: 10, last: 20 };
      expect(controller.indexes()).toEqual(expectedIndexes);
    });

    it('should have correct indexes for normal paging with rows < pageSize', () => {
      state.externalPaging.set(false);
      state.rows.set(Array.from({ length: 9 }, (_, index) => ({ num: index + 1 })));
      state.limit.set(5);
      state.offset.set(1);
      state.count.set(9);
      const expectedIndexes = { first: 5, last: 9 };
      expect(controller.indexes()).toEqual(expectedIndexes);
    });

    it('should have correct indexes for external paging with rows > pageSize', () => {
      state.externalPaging.set(true);
      state.rows.set([
        { num: 1 },
        { num: 2 },
        { num: 3 },
        { num: 4 },
        { num: 5 },
        { num: 6 },
        { num: 7 },
        { num: 8 },
        { num: 9 },
        { num: 10 }
      ]);
      state.limit.set(10);
      state.offset.set(1);
      state.count.set(20);
      const expectedIndexes = { first: 0, last: 10 };
      expect(controller.indexes()).toEqual(expectedIndexes);
    });

    it('should have correct indexes for external paging with rows < pageSize', () => {
      state.externalPaging.set(true);
      state.rows.set([{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }]);
      state.limit.set(5);
      state.offset.set(1);
      state.count.set(9);
      const expectedIndexes = { first: 0, last: 5 };
      expect(controller.indexes()).toEqual(expectedIndexes);
    });

    it('should render ghost rows based rowCount', async () => {
      table.trackByProp.set('num');
      state.rows.set([{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }]);
      controller.columns.set(toInternalColumn([{ name: 'num', prop: 'num' }]));
      state.externalPaging.set(true);
      state.scrollbarV.set(true);
      state.virtualization.set(true);
      rowHeight.set(50);
      table.ghostLoadingIndicator.set(true);
      controller.setDimensions({ height: 200, width: 0 });
      state.limit.set(5);
      state.count.set(10);
      state.offset.set(0);
      await fixture.whenStable();
      expect(controller.indexes()).toEqual({ first: 0, last: 5 });
      fixture.debugElement
        .query(By.directive(ScrollerComponent))
        .triggerEventHandler('scroll', { scrollYPos: 250, scrollXPos: 0 });
      await fixture.whenStable();
      expect(controller.indexes()).toEqual({ first: 5, last: 10 });
      expect(
        fixture.debugElement.queryAll(By.directive(DataTableGhostLoaderComponent))
      ).toHaveLength(5);
    });
  });

  describe('with disableCheck', () => {
    beforeEach(() => {
      controller.columns.set(toInternalColumn([{ name: 'value', prop: 'value' }]));
      table.disableRowCheck.set((row: any) => row.disabled);
    });

    it('should disable rows', async () => {
      state.rows.set([
        { value: '1', disabled: false },
        { value: '2', disabled: true }
      ]);
      state.count.set(2);
      state.limit.set(2);
      state.offset.set(0);
      await fixture.whenStable();
      let rows = fixture.debugElement.queryAll(By.directive(DataTableBodyRowComponent));
      expect(rows[0].classes['row-disabled']).toBeFalsy();
      expect(rows[1].classes['row-disabled']).toBe(true);
      state.rows.set([
        { value: '1', disabled: true },
        { value: '2', disabled: false }
      ]);
      await fixture.whenStable();
      rows = fixture.debugElement.queryAll(By.directive(DataTableBodyRowComponent));
      expect(rows[0].classes['row-disabled']).toBe(true);
      expect(rows[1].classes['row-disabled']).toBeFalsy();
    });

    it('should disable grouped rows', async () => {
      state.groupedRows.set([
        {
          key: 'g1',
          value: [
            { value: '1', disabled: false },
            { value: '2', disabled: true }
          ]
        }
      ]);
      table.groupExpansionDefault.set(true);
      state.rows.set(['dummy']);
      state.count.set(2);
      state.limit.set(2);
      state.offset.set(0);
      await fixture.whenStable();
      const rows = fixture.debugElement.queryAll(By.directive(DataTableBodyRowComponent));
      expect(rows[0].classes['row-disabled']).toBeFalsy();
      expect(rows[1].classes['row-disabled']).toBe(true);
    });
  });

  describe('with row grouping and row details', () => {
    it('should expand group and then expand row details within the group', async () => {
      const row1 = { value: '1', id: 1 };
      const row2 = { value: '2', id: 2 };
      const group = {
        key: 'g1',
        value: [row1, row2]
      };

      controller.columns.set(toInternalColumn([{ name: 'value', prop: 'value' }]));
      state.groupedRows.set([group]);
      table.groupExpansionDefault.set(false);
      state.rows.set(['dummy']);
      state.count.set(2);
      state.limit.set(2);
      state.offset.set(0);
      table.rowIdentity.set((row: any) => row.id ?? row.key);

      await fixture.whenStable();

      // Initially, group should be collapsed
      expect(component.getGroupExpanded(group)).toBe(false);
      expect(controller.rowExpansions()).toHaveLength(0);

      // Expand the group
      component.toggleGroupExpansion(group);
      await fixture.whenStable();

      expect(component.getGroupExpanded(group)).toBe(true);
      expect(controller.groupExpansions()).toHaveLength(1);
      expect(controller.groupExpansions()[0]).toBe(group);

      // Now expand row detail for the first row in the group
      component.toggleRowExpansion(row1);
      await fixture.whenStable();

      expect(component.getRowExpanded(row1)).toBe(true);
      expect(controller.rowExpansions()).toHaveLength(1);
      expect(controller.rowExpansions()[0]).toBe(row1);

      // Group should still be expanded
      expect(component.getGroupExpanded(group)).toBe(true);

      // Expand row detail for the second row as well
      component.toggleRowExpansion(row2);
      await fixture.whenStable();

      expect(component.getRowExpanded(row2)).toBe(true);
      expect(controller.rowExpansions()).toHaveLength(2);
      expect(controller.rowExpansions()).toContain(row1);
      expect(controller.rowExpansions()).toContain(row2);

      // Collapse the first row detail
      component.toggleRowExpansion(row1);
      await fixture.whenStable();

      expect(component.getRowExpanded(row1)).toBe(false);
      expect(controller.rowExpansions()).toHaveLength(1);
      expect(controller.rowExpansions()[0]).toBe(row2);

      // Group should still be expanded
      expect(component.getGroupExpanded(group)).toBe(true);
    });
  });

  describe('selectRow', () => {
    const rows = [
      { id: 1, name: 'Ethel' },
      { id: 2, name: 'Claudine' },
      { id: 3, name: 'Beryl' },
      { id: 4, name: 'Wilder' },
      { id: 5, name: 'Georgina' }
    ];

    beforeEach(() => {
      state.rows.set(rows);
      state.count.set(rows.length);
      state.limit.set(rows.length);
      state.offset.set(0);
      state.selectionType.set('multi');
      state.selected.set([]);
    });

    it('should keep prior ctrl-selected rows when shift-clicking a range', () => {
      // Regression for https://github.com/siemens/ngx-datatable/issues/582
      // 1. Click Georgina (idx 4)
      component.selectRow(new MouseEvent('click'), 4, rows[4]);
      expect(controller.selected()).toEqual([rows[4]]);

      // 2. Ctrl-click Beryl (idx 2) - extends selection, becomes new anchor
      component.selectRow(new MouseEvent('click', { ctrlKey: true }), 2, rows[2]);
      expect(controller.selected()).toEqual([rows[4], rows[2]]);

      // 3. Shift-click Ethel (idx 0) - range from last anchor (Beryl, idx 2) to Ethel (idx 0)
      component.selectRow(new MouseEvent('click', { shiftKey: true }), 0, rows[0]);

      const selected = controller.selected();
      // Georgina must still be selected (the bug)
      expect(selected).toContain(rows[4]);
      // Range Beryl..Ethel must be selected
      expect(selected).toContain(rows[2]);
      expect(selected).toContain(rows[1]);
      expect(selected).toContain(rows[0]);
      // No duplicates (Beryl was already selected before shift-click)
      expect(selected.length).toBe(new Set(selected).size);
    });

    it('should not throw when shift is the very first click', () => {
      expect(() =>
        component.selectRow(new MouseEvent('click', { shiftKey: true }), 2, rows[2])
      ).not.toThrow();
      // First-ever shift-click without a prior anchor selects just the clicked row.
      expect(controller.selected()).toEqual([rows[2]]);
    });
  });
});
