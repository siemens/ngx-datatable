import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { NgStyle } from '@angular/common';
import { TableColumn } from '../../types/table-column.type';
import { ActivateEvent, RowOrGroup, TreeStatus } from '../../types/public.types';
import { PinnedColumns } from '../../types/internal.types';
import { Keys } from '../../utils/keys';

@Component({
  selector: 'datatable-body-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (colGroup of columnsByPin; track colGroup.type; let i = $index) {
      <div
        class="datatable-row-{{ colGroup.type }} datatable-row-group"
        [ngStyle]="groupStyles[colGroup.type]"
        [class.row-disabled]="disable$ ? (disable$ | async) : false"
      >
        @for (column of colGroup.columns; track column.$$id; let ii = $index) {
          <datatable-body-cell
            role="cell"
            tabindex="-1"
            [row]="row"
            [group]="group"
            [expanded]="expanded"
            [isSelected]="isSelected"
            [rowIndex]="rowIndex"
            [column]="column"
            [rowHeight]="rowHeight"
            [displayCheck]="displayCheck"
            [disable$]="disable$"
            [treeStatus]="treeStatus"
            [ghostLoadingIndicator]="ghostLoadingIndicator"
            (activate)="onActivate($event, ii)"
            (treeAction)="onTreeAction()"
          >
          </datatable-body-cell>
        }
      </div>
    }
  `
})
export class DataTableBodyRowComponent<TRow = any> implements DoCheck {
  private cd = inject(ChangeDetectorRef);

  @Input() columns: TableColumn[];

  @Input() columnsByPin: PinnedColumns[];

  @Input() expanded: boolean;
  @Input() rowClass?: (row: RowOrGroup<TRow>) => string | Record<string, boolean>;
  @Input() row: TRow;
  @Input() group: TRow[];
  @Input() isSelected: boolean;
  @Input() rowIndex: number;
  @Input() displayCheck: (row: TRow, column: TableColumn, value?: any) => boolean;
  @Input() treeStatus?: TreeStatus = 'collapsed';
  @Input() ghostLoadingIndicator = false;

  @Input() disable$: BehaviorSubject<boolean>;

  @HostBinding('class') @Input() cssClass: string;

  @Input() groupStyles: {
    left: NgStyle['ngStyle'];
    center: NgStyle['ngStyle'];
    right: NgStyle['ngStyle'];
  };

  @HostBinding('style.height.px')
  @Input()
  rowHeight: number;

  @HostBinding('style.width.px') @Input() columnsTotalWidth: number;

  @Output() activate: EventEmitter<ActivateEvent<TRow>> = new EventEmitter();
  @Output() treeAction: EventEmitter<any> = new EventEmitter();

  _element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private _rowDiffer: KeyValueDiffer<keyof RowOrGroup<TRow>, any> = inject(KeyValueDiffers)
    .find({})
    .create();

  ngDoCheck(): void {
    if (this._rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }

  onActivate(event: ActivateEvent<TRow>, index: number): void {
    event.cellIndex = index;
    event.rowElement = this._element;
    this.activate.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetRow = event.target === this._element;

    const isAction =
      keyCode === Keys.return ||
      keyCode === Keys.down ||
      keyCode === Keys.up ||
      keyCode === Keys.left ||
      keyCode === Keys.right;

    const isCtrlA = event.key === 'a' && (event.ctrlKey || event.metaKey);

    if ((isAction && isTargetRow) || isCtrlA) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        rowElement: this._element
      });
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseenter(event: MouseEvent): void {
    this.activate.emit({
      type: 'mouseenter',
      event,
      row: this.row,
      rowElement: this._element
    });
  }

  onTreeAction() {
    this.treeAction.emit();
  }
}
