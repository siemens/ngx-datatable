import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, TemplateRef } from '@angular/core';

import { TableColumnInternal } from '../../../types/internal.types';
import { Row } from '../../../types/public.types';
import { DataTableBodyRowComponent } from '../body-row.component';

const defaultSumFunc = (cells: any[]): any => {
  const cellsWithValues = cells.filter(cell => !!cell);

  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some(cell => typeof cell !== 'number')) {
    return null;
  }

  return cellsWithValues.reduce((res, cell) => res + cell);
};

const noopSumFunc = (cells: any[]): void => {
  return;
};

@Component({
  selector: 'datatable-summary-row',
  imports: [DataTableBodyRowComponent, NgTemplateOutlet],
  template: `
    @let template = this.template();
    @if (template) {
      <div class="datatable-body-row" role="row" [style.height.px]="rowHeight()">
        <div class="datatable-body-cell" role="cell" [attr.aria-colspan]="allColumnsColspan()">
          <ng-container [ngTemplateOutlet]="template" />
        </div>
      </div>
    } @else {
      @let summaryRow = this.summaryRow();
      @let _internalColumns = this._internalColumns();
      @if (summaryRow && _internalColumns.length) {
        <datatable-body-row
          ariaRowCheckboxMessage=""
          [columns]="_internalColumns"
          [rowHeight]="rowHeight()"
          [row]="summaryRow"
          [rowIndex]="{ index: -1 }"
        />
      }
    }
  `,
  styleUrl: './summary-row.component.scss',
  host: {
    class: 'datatable-summary-row'
  }
})
export class DataTableSummaryRowComponent<TRow extends Row = any> {
  readonly rows = input.required<(TRow | undefined)[]>();
  readonly columns = input.required<TableColumnInternal<TRow>[]>();
  readonly allColumnsColspan = input.required<number>();

  readonly rowHeight = input.required<number>();
  readonly template = input<TemplateRef<void>>();

  protected readonly _internalColumns = computed(() => {
    return this.columns().map(col => ({
      ...col,
      cellTemplate: col.summaryTemplate
    }));
  });
  protected readonly summaryRow = computed(() => this.computeSummaryRowValues());

  // Virtual and ghost loading rows are not part of the aggregation.
  private readonly loadedRows = computed(() =>
    this.rows().filter((row): row is TRow => row !== undefined)
  );

  private computeSummaryRowValues(): Row | undefined {
    if (!this.columns().length || !this.rows().length) {
      return undefined;
    }
    const loadedRows = this.loadedRows();
    const summaryRow: Row = {};
    this.columns()
      .filter(col => !col.summaryTemplate && col.prop)
      .forEach(col => {
        const cellsFromSingleColumn = loadedRows.map(row => row[col.prop]);
        const sumFunc = this.getSummaryFunction(col);

        summaryRow[col.prop] = col.pipe
          ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
          : sumFunc(cellsFromSingleColumn);
      });

    return summaryRow;
  }

  private getSummaryFunction(column: TableColumnInternal<TRow>): (a: any[]) => any {
    if (column.summaryFunc === undefined) {
      return defaultSumFunc;
    } else if (column.summaryFunc === null) {
      return noopSumFunc;
    } else {
      return column.summaryFunc;
    }
  }
}
