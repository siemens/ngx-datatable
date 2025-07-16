import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { toInternalColumn } from '../../utils/column-helper';
import { DataTableHeaderComponent } from './header.component';
import { HeaderHarness } from './testing/header.harness';

describe('DataTableHeaderComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderComponent>;
  let componentRef: ComponentRef<DataTableHeaderComponent>;
  let harness: HeaderHarness;

  beforeEach(async () => {
    fixture = TestBed.createComponent(DataTableHeaderComponent);
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, HeaderHarness);
    componentRef = fixture.componentRef;
  });

  it('should render with given column headers', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100 },
        { prop: 'col2', name: 'Column 2', width: 200 }
      ])
    );
    expect(await harness.getColumnCount()).toBe(2);
    expect(await harness.getColumnName(0)).toBe('Column 1');
  });

  it('should calculate inner row widths based on columns total width', fakeAsync(async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 300 },
        { prop: 'col2', name: 'Column 2', width: 200 }
      ])
    );
    // there is setTimeout in columns setter so we need to wait for it
    tick();
    expect(await harness.getHeaderRowWidth()).toBe(500);
  }));

  it('should place header cells based on column pinning group', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, frozenLeft: true },
        { prop: 'col2', name: 'Column 2', width: 200, frozenRight: true },
        { prop: 'col3', name: 'Column 3', width: 150 },
        { prop: 'col4', name: 'Column 4', width: 200, frozenRight: true }
      ])
    );

    expect(await harness.getColumnCount()).toBe(4);
    expect(await harness.getColumnName(0)).toBe('Column 1');
    expect(await harness.getColumnName(2)).toBe('Column 2');
    expect(await harness.getColumnName(1)).toBe('Column 3');

    expect(await harness.getColumnPinningGroup('left')).toBe(1);
    expect(await harness.getColumnPinningGroup('center')).toBe(1);
    expect(await harness.getColumnPinningGroup('right')).toBe(2);
  });

  it('should allow resizing columns', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, resizeable: true },
        { prop: 'col2', name: 'Column 2', width: 200, resizeable: true }
      ])
    );

    componentRef.instance.resizing.subscribe(event => {
      const { column, newValue } = event;
      column.width = newValue;
      componentRef.setInput('columns', [...componentRef.instance.columns]);
    });

    const initialWidth = await harness.getColumnWidth(0);

    await harness.resizeColumn(0, 200);

    const updatedWidth = await harness.getColumnWidth(0);

    expect(updatedWidth).toBeGreaterThan(initialWidth);
  });

  it('should not have resize handle for non-resizable columns', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, resizeable: true },
        { prop: 'col2', name: 'Column 2', width: 200, resizeable: true },
        { prop: 'col3', name: 'Column 3', width: 200, resizeable: false },
        { prop: 'col4', name: 'Column 4', width: 200, resizeable: true }
      ])
    );

    expect(await harness.hasResizeHandle(0)).toBe(true);
    expect(await harness.hasResizeHandle(1)).toBe(true);
    expect(await harness.hasResizeHandle(2)).toBe(false);
  });

  it('should not have resize handle for last column irrespective of resizability', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, resizeable: true },
        { prop: 'col2', name: 'Column 2', width: 200, resizeable: true },
        { prop: 'col3', name: 'Column 3', width: 200, resizeable: true }
      ])
    );

    expect(await harness.hasResizeHandle(2)).toBe(false);
  });

  it('should apply sorting on column click', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, sortable: true },
        { prop: 'col2', name: 'Column 2', width: 200, sortable: true }
      ])
    );

    componentRef.instance.sort.subscribe(sort => {
      expect(sort.sorts[0]).toEqual({ prop: 'col1', dir: 'asc' });
      componentRef.setInput('sorts', sort.sorts);
    });

    expect((await harness.getActiveSortColumn()).length).toBe(0);
    await harness.applySortOnColumn(0);

    expect((await harness.getActiveSortColumn())[0]).toBe('Column 1');
  });

  it('should apply multiple sorts if enabled', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, sortable: true },
        { prop: 'col2', name: 'Column 2', width: 200, sortable: true }
      ])
    );
    componentRef.setInput('sortType', 'multi');

    componentRef.instance.sort.subscribe(sort => {
      componentRef.setInput('sorts', sort.sorts);
    });

    expect((await harness.getActiveSortColumn()).length).toBe(0);
    await harness.applySortOnColumn(0);

    expect((await harness.getActiveSortColumn())[0]).toBe('Column 1');

    await harness.applySortOnColumn(1);
    expect((await harness.getActiveSortColumn()).length).toBe(2);
    expect((await harness.getActiveSortColumn())[1]).toBe('Column 2');
  });

  it('should reorder columns on drag', fakeAsync(async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, draggable: true },
        { prop: 'col2', name: 'Column 2', width: 200, draggable: true },
        { prop: 'col3', name: 'Column 3', width: 150, draggable: true }
      ])
    );

    componentRef.setInput('reorderable', true);

    componentRef.instance.reorder.subscribe(event => {
      const { newValue, prevValue } = event;
      const columns = componentRef.instance.columns;
      const columnIndex = prevValue;
      const movedColumn = columns.splice(columnIndex, 1)[0];
      columns.splice(newValue, 0, movedColumn);
      componentRef.setInput('columns', columns);
      // TODO remove this once we migrate to signal inputs
      componentRef.instance.columns = columns;
    });

    tick();
    const headerCells = fixture.debugElement.queryAll(By.css('.draggable'));

    const firstCell = headerCells[0].nativeElement;
    const clientRect = (firstCell as HTMLElement).getBoundingClientRect();

    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: clientRect.x,
      screenX: clientRect.x,
      clientY: clientRect.y,
      screenY: clientRect.y,
      bubbles: true
    });
    firstCell.dispatchEvent(mouseDownEvent);

    // Wait 500ms after mousedown to consider it as long press
    await new Promise(resolve => setTimeout(resolve, 500));

    fixture.detectChanges();

    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: clientRect.x + 200,
      screenX: clientRect.x + 200,
      clientY: clientRect.y,
      screenY: clientRect.y
    });
    document.dispatchEvent(mouseMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: clientRect.x + 200,
      screenX: clientRect.x + 200,
      clientY: clientRect.y,
      screenY: clientRect.y
    });
    document.dispatchEvent(mouseUpEvent);

    expect(await harness.getColumnName(0)).toBe('Column 2');
    expect(await harness.getColumnName(1)).toBe('Column 1');
    expect(await harness.getColumnName(2)).toBe('Column 3');
  }));

  it('should translate only center group columns when offsetX is provided', async () => {
    componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', name: 'Column 1', width: 100, frozenLeft: true },
        { prop: 'col2', name: 'Column 2', width: 200 },
        { prop: 'col3', name: 'Column 3', width: 150 },
        { prop: 'col4', name: 'Column 4', width: 200, frozenRight: true }
      ])
    );
    const leftGroupStyle = await harness.getTransformStyle('left');
    expect(leftGroupStyle).toBe('');
    componentRef.setInput('offsetX', 100);

    expect(await harness.getTransformStyle('left')).toBe(leftGroupStyle);

    const centerGroupStyle = await harness.getTransformStyle('center');
    expect(centerGroupStyle).toContain('translateX(-100px)');

    expect(await harness.getTransformStyle('right')).toBe('');
  });
});
