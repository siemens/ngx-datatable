import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import {
  DatatableComponent,
  DatatableRowDefComponent,
  DatatableRowDefDirective
} from 'projects/ngx-datatable/src/public-api';

import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'drag-drop-demo',
  imports: [
    DatatableComponent,
    CdkDropList,
    DatatableRowDefDirective,
    DatatableRowDefComponent,
    CdkDrag
  ],
  template: `
    <div>
      <h3>
        Drag Drop Using Angular CDK
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/main/src/app/drag-drop/drag-drop.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        rowHeight="auto"
        cdkDropList
        columnMode="force"
        [rows]="rows"
        [loadingIndicator]="loadingIndicator"
        [columns]="columns"
        [headerHeight]="50"
        [footerHeight]="50"
        [reorderable]="reorderable"
        (cdkDropListDropped)="drop($event)"
      >
        <ng-template rowDef>
          <datatable-row-def cdkDrag cdkDragPreviewContainer="parent" />
        </ng-template>
      </ngx-datatable>
    </div>
  `
})
export class DragDropComponent {
  rows: Employee[] = [];
  loadingIndicator = true;
  reorderable = true;

  columns = [
    { prop: 'name', sortable: false },
    { name: 'Gender', sortable: false },
    { name: 'Company', sortable: false }
  ];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1500);
    });
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
    this.rows = [...this.rows];
  }
}
