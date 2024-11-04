import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableBodyRowComponent } from './body-row.component';
import { DataTableBodyCellComponent } from './body-cell.component';
import { Component } from '@angular/core';
import { RowIndex } from '../../types/public.types';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { TableColumn } from '../../types/table-column.type';
import { By } from '@angular/platform-browser';

describe('DataTableBodyRowComponent', () => {
  @Component({
    template: ` <datatable-body-row [rowIndex]="rowIndex" [row]="row" [columns]="columns" /> `
  })
  class TestHostComponent {
    rowIndex: RowIndex = 0;
    row: any = { prop: 'value' };
    columns: TableColumn[] = [{ prop: 'prop', $$valueGetter: () => 'value' }];
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, DataTableBodyCellComponent, DataTableBodyRowComponent],
      providers: [ScrollbarHelper]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should apply odd/event without groups', () => {
    component.rowIndex = 0;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.directive(DataTableBodyRowComponent))
      .nativeElement as HTMLElement;
    expect(element.classList).toContain('datatable-row-even');
    component.rowIndex = 3;
    fixture.detectChanges();
    expect(element.classList).toContain('datatable-row-odd');
  });

  it('should apply event odd/even if row is grouped', () => {
    component.rowIndex = `1-0`;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.directive(DataTableBodyRowComponent))
      .nativeElement as HTMLElement;
    expect(element.classList).toContain('datatable-row-even');
    component.rowIndex = `666-3`;
    fixture.detectChanges();
    expect(element.classList).toContain('datatable-row-odd');
  });
});
