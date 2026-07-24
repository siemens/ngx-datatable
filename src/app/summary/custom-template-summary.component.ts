import { Component, computed, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { DatatableComponent, TableColumn } from '@siemens/ngx-datatable';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'custom-template-summary-demo',
  imports: [DatatableComponent],
  template: `
    <div>
      <ngx-datatable
        class="material"
        columnMode="force"
        rowHeight="auto"
        [summaryRow]="true"
        [columns]="columns"
        [headerHeight]="50"
        [summaryHeight]="55"
        [rows]="rows()"
      />
      <ng-template #nameSummaryCell let-row="row" let-value="value">
        <div class="name-container">
          @for (name of names(); track name) {
            <div class="chip">
              <span class="chip-content">{{ name }}</span>
            </div>
          }
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './custom-template-summary.component.scss'
})
export class CustomTemplateSummaryComponent implements OnInit {
  private dataService = inject(DataService);
  readonly rows = signal<Employee[]>([]);

  readonly names = computed(() =>
    this.rows()
      .map(row => row.name)
      .map(fullName => fullName.split(' ')[1])
  );

  @ViewChild('nameSummaryCell') nameSummaryCell!: TemplateRef<any>;

  columns: TableColumn[] = [];

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows.set(data.splice(0, 5));
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

  private summaryForGender(cells: string[]) {
    const males = cells.filter(cell => cell === 'male').length;
    const females = cells.filter(cell => cell === 'female').length;

    return `males: ${males}, females: ${females}`;
  }

  private avgAge(cells: number[]): number {
    const filteredCells = cells.filter(cell => !!cell);
    return filteredCells.reduce((sum, cell) => sum + cell, 0) / filteredCells.length;
  }
}
