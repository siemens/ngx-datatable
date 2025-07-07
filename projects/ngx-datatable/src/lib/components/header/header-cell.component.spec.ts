import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableColumnInternal } from '../../types/internal.types';
import { DataTableHeaderCellComponent } from './header-cell.component';

describe('DataTableHeaderCellComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderCellComponent>;
  let component: DataTableHeaderCellComponent;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(DataTableHeaderCellComponent);
    component = fixture.componentInstance;
  }));

  it('should emit new width on resize', () => {
    fixture.componentRef.setInput('column', {
      name: 'test',
      resizeable: true
    });
    spyOn(component.resizing, 'emit');
    fixture.detectChanges();
    const initialWidth = fixture.nativeElement.clientWidth;
    const event = new MouseEvent('mousedown');
    fixture.nativeElement.querySelector('.resize-handle').dispatchEvent(event);
    const mouseMoveEvent = new MouseEvent('mousemove', { screenX: 100 });
    document.dispatchEvent(mouseMoveEvent);
    const mouseUpEvent = new MouseEvent('mouseup');
    document.dispatchEvent(mouseUpEvent);
    const newWidth = 100 + initialWidth;
    expect(component.resizing.emit).toHaveBeenCalledWith({
      width: newWidth,
      column: { name: 'test', resizeable: true } as TableColumnInternal<any>
    });
  });

  it('should emit sort event', () => {
    fixture.componentRef.setInput('column', {
      prop: 'test',
      sortable: true
    });
    spyOn(component.sort, 'emit');
    fixture.detectChanges();
    const event = new MouseEvent('click');
    fixture.nativeElement.querySelector('.datatable-header-cell-label').dispatchEvent(event);
    expect(component.sort.emit).toHaveBeenCalled();
  });

  it('should not render resize handle when showResizeHandle is false (last column)', () => {
    fixture.componentRef.setInput('column', {
      name: 'test',
      resizeable: true
    });
    fixture.componentRef.setInput('showResizeHandle', false);
    fixture.detectChanges();
    const resizeHandle = fixture.nativeElement.querySelector('.resize-handle');
    expect(resizeHandle).toBeNull();
  });

  it('should render resize handle when showResizeHandle is true', () => {
    fixture.componentRef.setInput('column', {
      name: 'test',
      resizeable: true
    });
    fixture.componentRef.setInput('showResizeHandle', true);
    fixture.detectChanges();
    const resizeHandle = fixture.nativeElement.querySelector('.resize-handle');
    expect(resizeHandle).not.toBeNull();
  });
});
