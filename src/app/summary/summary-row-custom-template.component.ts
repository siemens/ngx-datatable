import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatatableComponent, TableColumn } from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'summary-row-custom-template-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <h3>
        Summary Row with Custom Template
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/summary/summary-row-custom-template.component.ts"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        columnMode="force"
        rowHeight="auto"
        [summaryRow]="true"
        [columns]="columns"
        [headerHeight]="50"
        [summaryHeight]="55"
        [rows]="rows"
      />
      <ng-template #nameSummaryCell let-row="row" let-value="value">
        <div class="name-container">
          @for (name of getNames(); track name) {
            <div class="chip">
              <span class="chip-content">{{ name }}</span>
            </div>
          }
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './summary-row-custom-template.component.scss'
})
export class SummaryRowCustomTemplateComponent implements OnInit {
  rows: Employee[] = [];

  @ViewChild('nameSummaryCell') nameSummaryCell!: TemplateRef<any>;

  columns: TableColumn[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data.splice(0, 5);
    });
  }

  ngOnInit() {
    this.columns = [
      {
        prop: 'name',
        summaryFunc: () => null,
        summaryTemplate: this.nameSummaryCell
      },
      { name: 'Gender', summaryFunc: cells => this.summaryForGender(cells) },
      { prop: 'age', summaryFunc: cells => this.avgAge(cells) }
    ];
  }

  getNames(): string[] {
    return this.rows.map(row => row.name).map(fullName => fullName.split(' ')[1]);
  }

  private summaryForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }

  private avgAge(cells: number[]): number {
    const filteredCells = cells.filter(cell => !!cell);
    return filteredCells.reduce((sum, cell) => (sum += cell), 0) / filteredCells.length;
  }
}
