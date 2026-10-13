import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, ComponentRef, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideDatatableConfigurationMock } from '../../../../testing/datatable-configuration.mock';
import { TableColumnInternal } from '../../../types/internal.types';
import { Row } from '../../../types/public.types';
import { toInternalColumn } from '../../../utils/column-helper';
import { DataTableSummaryRowComponent } from './summary-row.component';
import { SummaryHarness } from './testing/summary.harness';

describe('DataTableSummaryRowComponent', () => {
  let fixture: ComponentFixture<DataTableSummaryRowComponent<Row>>;
  let componentRef: ComponentRef<DataTableSummaryRowComponent<Row>>;
  let harness: SummaryHarness;

  let rows: Row[];
  let columns: TableColumnInternal[];

  beforeEach(() => {
    rows = [
      { col1: 10, col2: 20 },
      { col1: 1, col2: 30 }
    ];
    columns = toInternalColumn([{ prop: 'col1' }, { prop: 'col2' }]);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideDatatableConfigurationMock()]
    });
    fixture = TestBed.createComponent(DataTableSummaryRowComponent);

    // Set required inputs before creating harness and detecting changes
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('rowHeight', 30);

    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SummaryHarness);
    componentRef = fixture.componentRef;
  });

  describe('Visibility', () => {
    it('should not be visible when there are no columns', async () => {
      componentRef.setInput('columns', []);
      componentRef.setInput('rows', rows);
      expect(await harness.hasSummaryRow()).toBe(false);
    });

    it('should not be visible when there are no rows', async () => {
      componentRef.setInput('columns', columns);
      componentRef.setInput('rows', []);
      expect(await harness.hasSummaryRow()).toBe(false);
    });

    it('should be visible when there are rows and columns', async () => {
      componentRef.setInput('columns', columns);
      componentRef.setInput('rows', rows);
      expect(await harness.hasSummaryRow()).toBe(true);
    });
  });

  describe('Computing', () => {
    beforeEach(() => {
      componentRef.setInput('columns', columns);
      componentRef.setInput('rows', rows);
    });

    describe('Default Summary Function', () => {
      it('should be used when no other provided', async () => {
        const col1Text = await harness.getSummaryRowCellText(0);
        const col2Text = await harness.getSummaryRowCellText(1);

        expect(col1Text).toBe((rows[0].col1 + rows[1].col1).toString());
        expect(col2Text).toBe((rows[0].col2 + rows[1].col2).toString());
      });

      it('should ignore loading placeholders and update when rows are loaded', async () => {
        const partialRows = new Array<Row | undefined>(4);
        partialRows[0] = rows[0];
        partialRows[2] = undefined;
        partialRows[3] = rows[1];
        componentRef.setInput('rows', partialRows);

        expect(await harness.getSummaryRowCellText(0)).toBe('11');
        expect(await harness.getSummaryRowCellText(1)).toBe('50');

        partialRows[1] = { col1: 2, col2: 5 };
        componentRef.setInput('rows', [...partialRows]);

        expect(await harness.getSummaryRowCellText(0)).toBe('13');
        expect(await harness.getSummaryRowCellText(1)).toBe('55');
      });

      it('should works with empty row', async () => {
        componentRef.setInput('rows', [{ col1: null, col2: undefined }, { col1: null }]);

        const col1Text = await harness.getSummaryRowCellText(0);
        const col2Text = await harness.getSummaryRowCellText(1);

        expect(col1Text).toBe('');
        expect(col2Text).toBe('');
      });

      it('should not compute a result if there are non-number cells', async () => {
        componentRef.setInput('rows', [
          { col1: 'aaa', col2: 'xxx' },
          { col1: 'bbb', col2: 34 }
        ]);

        const col1Text = await harness.getSummaryRowCellText(0);
        const col2Text = await harness.getSummaryRowCellText(1);

        expect(col1Text).toBe('');
        expect(col2Text).toBe('');
      });

      it('should not compute a result if there are non-number cells', async () => {
        componentRef.setInput('rows', [
          { col1: 'aaa', col2: 'xxx' },
          { col1: 'bbb', col2: 34 }
        ]);

        const col1Text = await harness.getSummaryRowCellText(0);
        const col2Text = await harness.getSummaryRowCellText(1);

        expect(col1Text).toBe('');
        expect(col2Text).toBe('');
      });
    });

    it('should not compute if null is set as a summary function', async () => {
      columns[0].summaryFunc = null;
      componentRef.setInput('columns', [...columns]);
      const col1Text = await harness.getSummaryRowCellText(0);
      expect(col1Text).toBe('');
    });

    it('should use provided summary function', async () => {
      const sum1 = 22;
      const sum2 = 'test sum';
      const spy1 = vi.fn().mockReturnValue(sum1);
      const spy2 = vi.fn().mockReturnValue(sum2);
      columns[0].summaryFunc = spy1;
      columns[1].summaryFunc = spy2;

      componentRef.setInput('columns', [...columns]);

      const col1Text = await harness.getSummaryRowCellText(0);
      const col2Text = await harness.getSummaryRowCellText(1);

      expect(vi.mocked(spy1)).toHaveBeenCalled();
      expect(vi.mocked(spy2)).toHaveBeenCalled();

      expect(vi.mocked(spy1).mock.lastCall![0]).toEqual([rows[0].col1, rows[1].col1]);
      expect(vi.mocked(spy2).mock.lastCall![0]).toEqual([rows[0].col2, rows[1].col2]);

      expect(col1Text).toBe(sum1.toString());
      expect(col2Text).toBe(sum2.toString());
    });

    it('should pass only loaded rows to custom summaries without filtering their cell values', async () => {
      const summaryFunc = vi.fn().mockReturnValue(4);
      columns[0].summaryFunc = summaryFunc;
      componentRef.setInput('columns', [...columns]);
      const partialRows = new Array<Row | undefined>(10);
      partialRows[0] = { col1: 0 };
      partialRows[2] = undefined;
      partialRows[4] = { col1: null };
      partialRows[6] = {};
      partialRows[8] = { col1: false };
      componentRef.setInput('rows', partialRows);

      expect(await harness.getSummaryRowCellText(0)).toBe('4');
      expect(summaryFunc).toHaveBeenCalledWith([0, null, undefined, false]);
    });

    it('should pass an empty array to custom summaries when all rows are unloaded', async () => {
      const summaryFunc = vi.fn().mockReturnValue(0);
      columns[0].summaryFunc = summaryFunc;
      componentRef.setInput('columns', [...columns]);
      componentRef.setInput('rows', [undefined, undefined]);

      expect(await harness.getSummaryRowCellText(0)).toBe('0');
      expect(summaryFunc).toHaveBeenCalledWith([]);
    });

    describe('Pipe', () => {
      it('should use provided pipe', async () => {
        const transformed = '$22';
        const transformSpy = vi.fn().mockReturnValue(transformed);

        columns[0].pipe = { transform: transformSpy };
        componentRef.setInput('columns', [...columns]);
        await fixture.whenStable();

        const col1Text = await harness.getSummaryRowCellText(0);

        expect(vi.mocked(transformSpy)).toHaveBeenCalled();
        expect(col1Text).toBe(transformed);
      });

      it('should use the pipe instead of the cell value transform', async () => {
        const transformed = '$11';
        const transformSpy = vi.fn().mockReturnValue(transformed);
        const cellValueTransformSpy = vi.fn().mockReturnValue('cell transformed');

        columns[0].pipe = { transform: transformSpy };
        columns[0].cellValueTransform = cellValueTransformSpy;
        componentRef.setInput('columns', [...columns]);

        const col1Text = await harness.getSummaryRowCellText(0);

        expect(transformSpy).toHaveBeenCalledWith(11);
        expect(cellValueTransformSpy).not.toHaveBeenCalled();
        expect(col1Text).toBe(transformed);
      });
    });
  });
});

@Component({
  imports: [DataTableSummaryRowComponent],
  template: `
    <datatable-summary-row
      [rows]="rows"
      [columns]="columns"
      [allColumnsColspan]="allColumnsColspan"
      [rowHeight]="30"
      [template]="tpl()"
    />
    <ng-template #summaryTpl>
      <span class="custom-content">Custom summary content</span>
    </ng-template>
  `
})
class TestHostComponent {
  rows = [{ col1: 10 }];
  columns: TableColumnInternal[] = toInternalColumn([{ prop: 'col1' }]);
  readonly allColumnsColspan = Math.max(1, this.columns.length);
  readonly tpl = viewChild<TemplateRef<void>>('summaryTpl');
}

describe('DataTableSummaryRowComponent with template', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
  });

  it('should render custom template content instead of computed columns', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.custom-content')?.textContent).toBe('Custom summary content');
    expect(el.querySelector('datatable-body-row')).toBeNull();
  });
});
