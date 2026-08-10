import { Component, inject, signal } from '@angular/core';
import { DataTableColumnDirective, DatatableComponent } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'inline-html-summary-demo',
  imports: [DatatableComponent, DataTableColumnDirective],
  template: `
    <div>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        columnMode="force"
        [summaryRow]="enableSummary"
        [summaryPosition]="summaryPosition"
        [summaryHeight]="100"
        [headerHeight]="50"
        [rows]="rows()"
      >
        <ngx-datatable-column prop="name" [summaryTemplate]="nameSummaryCell" />
        <ngx-datatable-column name="Gender" [summaryFunc]="summaryForGender" />
        <ngx-datatable-column prop="age" [summaryFunc]="avgAge" />
      </ngx-datatable>
      <ng-template #nameSummaryCell>
        <span>{{ rows().length }} total</span>
      </ng-template>
    </div>
  `
})
export class InlineHtmlSummaryComponent {
  private dataService = inject(DataService);
  readonly rows = signal<Employee[]>([]);

  enableSummary = true;
  summaryPosition = 'top';

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows.set(data.splice(0, 5));
    });
  }

  summaryForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }

  avgAge(cells: number[]): number {
    const filteredCells = cells.filter(cell => !!cell);
    return filteredCells.reduce((sum, cell) => sum + cell, 0) / filteredCells.length;
  }
}
