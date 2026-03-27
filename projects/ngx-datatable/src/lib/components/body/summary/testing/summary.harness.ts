import { ComponentHarness } from '@angular/cdk/testing';

export class SummaryHarness extends ComponentHarness {
  static readonly hostSelector = 'datatable-summary-row';

  private summaryRowCells = this.locatorForAll('datatable-body-cell');
  private summaryRow = this.locatorForOptional('datatable-body-row');
  private checkboxes = this.locatorForAll('input[type="checkbox"]');

  async getSummaryRowCellText(index: number): Promise<string> {
    const cells = await this.summaryRowCells();
    return cells[index].text();
  }

  async hasSummaryRow(): Promise<boolean> {
    const row = await this.summaryRow();
    return !!row;
  }

  async getCheckboxCount(): Promise<number> {
    const checkboxes = await this.checkboxes();
    return checkboxes.length;
  }
}
