import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableHeaderCellComponent } from './header-cell.component';

describe('DataTableHeaderCellComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderCellComponent>;
  let component: DataTableHeaderCellComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableHeaderCellComponent]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableHeaderCellComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should render cell with text', () => {
      fixture.componentRef.setInput('column', {
        name: 'test'
      });
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.datatable-header-cell-label').textContent
      ).toContain('test');
    });

    it('should have resize handle', () => {
      fixture.componentRef.setInput('column', {
        name: 'test',
        resizeable: true
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.resize-handle')).toBeTruthy();
    });

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
        column: { name: 'test', resizeable: true }
      });
    });

    it('should emit sort event', () => {
      fixture.componentRef.setInput('column', {
        name: 'test',
        sortable: true
      });
      spyOn(component.sort, 'emit');
      fixture.detectChanges();
      const event = new MouseEvent('click');
      fixture.nativeElement.querySelector('.datatable-header-cell-label').dispatchEvent(event);
      expect(component.sort.emit).toHaveBeenCalled();
    });

    it('should have default sort class applied', () => {
      fixture.componentRef.setInput('column', {
        prop: 'test',
        sortable: true
      });
      fixture.componentRef.setInput('sorts', [{ prop: 'test', dir: 'asc' }]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.sort-asc')).toBeTruthy();
    });

    it('should have header checkboxable', () => {
      fixture.componentRef.setInput('column', {
        name: 'test',
        headerCheckboxable: true
      });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.datatable-checkbox')).toBeTruthy();
    });
  });
});
