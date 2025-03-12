import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { numericIndexGetter } from '../../utils/column-prop-getters';
import { toInternalColumn } from '../../utils/column-helper';
import { DataTableBodyCellComponent } from './body-cell.component';

describe('DataTableBodyCellComponent', () => {
  let fixture: ComponentFixture<DataTableBodyCellComponent>;
  let component: DataTableBodyCellComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DataTableBodyCellComponent]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableBodyCellComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('prop tests', () => {
    // verify there wasn't a mistake where the falsey 0 value
    // resulted in a code path for missing column prop
    it('should get value from zero-index prop', () => {
      component.row = ['Hello'];
      const columns = toInternalColumn([{ name: 'First Column', prop: 0 }]);
      expect(columns[0].$$valueGetter).toBe(numericIndexGetter);

      component.column = columns[0];
      expect(component.value).toEqual('Hello');
    });
  });
});
