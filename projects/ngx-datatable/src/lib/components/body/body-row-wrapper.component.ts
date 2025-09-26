import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  inject,
  IterableDiffer,
  IterableDiffers,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  input,
  output,
  viewChild
} from '@angular/core';

import { Group, GroupContext, Row, RowDetailContext, RowOrGroup } from '../../types/public.types';
import { DATATABLE_COMPONENT_TOKEN } from '../../utils/table-token';
import { DatatableRowDetailDirective } from '../row-detail/row-detail.directive';
import { DatatableGroupHeaderDirective } from './body-group-header.directive';

@Component({
  selector: 'datatable-row-wrapper',
  imports: [NgTemplateOutlet],
  template: `
    @let row = this.row();
    @if (isGroup(row) && groupHeader()?.template) {
      <div
        class="datatable-group-header"
        [style.height.px]="groupHeaderRowHeight()"
        [style.width.px]="innerWidth()"
      >
        <div class="datatable-group-cell">
          @if (groupHeader()?.checkboxable) {
            <div>
              <label class="datatable-checkbox">
                <input
                  #select
                  type="checkbox"
                  [attr.aria-label]="ariaGroupHeaderCheckboxMessage()"
                  [checked]="selectedGroupRows().length === row.value.length"
                  (change)="onCheckboxChange(select.checked, row)"
                />
              </label>
            </div>
          }
          <ng-template
            [ngTemplateOutlet]="groupHeader()?.template!"
            [ngTemplateOutletContext]="context"
          />
        </div>
      </div>
    }
    @if ((groupHeader()?.template && expanded()) || !groupHeader() || !groupHeader()?.template) {
      <ng-content />
    }
    @let rowDetailTemplate = rowDetail()?.template();
    @if (rowDetailTemplate && expanded()) {
      <div class="datatable-row-detail" [style.height.px]="detailRowHeight()">
        <ng-template [ngTemplateOutlet]="rowDetailTemplate" [ngTemplateOutletContext]="context" />
      </div>
    }
  `,
  styleUrl: './body-row-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'datatable-row-wrapper'
  }
})
export class DataTableRowWrapperComponent<TRow extends Row = any>
  implements DoCheck, OnInit, OnChanges
{
  readonly checkBoxInput = viewChild<ElementRef<HTMLInputElement>>('select');
  readonly innerWidth = input.required<number>();
  readonly rowDetail = input<DatatableRowDetailDirective>();
  readonly groupHeader = input<DatatableGroupHeaderDirective>();
  readonly offsetX = input.required<number>();
  readonly detailRowHeight = input.required<number>();
  readonly groupHeaderRowHeight = input.required<number>();
  readonly row = input.required<RowOrGroup<TRow>>();
  readonly groupedRows = input<Group<TRow>[]>();
  readonly selected = input.required<TRow[]>();
  readonly disabled = input<boolean>();
  readonly rowContextmenu = output<{
    event: MouseEvent;
    row: RowOrGroup<TRow>;
  }>();

  readonly rowIndex = input.required<number>();

  readonly selectedGroupRows = signal<TRow[]>([]);

  readonly expanded = input(false, { transform: booleanAttribute });
  readonly ariaGroupHeaderCheckboxMessage = input.required<string>();

  context!: RowDetailContext<TRow> | GroupContext<TRow>;

  private rowDiffer: KeyValueDiffer<keyof RowOrGroup<TRow>, any> = inject(KeyValueDiffers)
    .find({})
    .create();
  private iterableDiffers = inject(IterableDiffers);
  private selectedRowsDiffer!: IterableDiffer<TRow>;
  private tableComponent = inject(DATATABLE_COMPONENT_TOKEN);
  private cd = inject(ChangeDetectorRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.row) {
      // this component renders either a group header or a row. Never both.
      const row = this.row();
      if (this.isGroup(row)) {
        this.context = {
          group: row,
          expanded: this.expanded(),
          rowIndex: this.rowIndex()
        };
      } else {
        this.context = {
          row,
          expanded: this.expanded(),
          rowIndex: this.rowIndex(),
          disabled: this.disabled()
        };
      }
    }
    if (changes.rowIndex) {
      this.context.rowIndex = this.rowIndex();
    }
    if (changes.expanded) {
      this.context.expanded = this.expanded();
    }
  }

  ngOnInit(): void {
    this.selectedRowsDiffer = this.iterableDiffers.find(this.selected() ?? []).create();
  }

  ngDoCheck(): void {
    const row = this.row();
    if (this.rowDiffer.diff(row)) {
      if ('group' in this.context) {
        this.context.group = row as Group<TRow>;
      } else {
        this.context.row = row as TRow;
      }
      this.cd.markForCheck();
    }
    // When groupheader is used with chechbox we use iterableDiffer
    // on currently selected rows to check if it is modified
    // if any of the row of this group is not present in `selected` rows array
    // mark group header checkbox state as indeterminate
    if (
      this.isGroup(row) &&
      this.groupHeader()?.checkboxable &&
      this.selectedRowsDiffer.diff(this.selected())
    ) {
      const thisRow = row;
      const selectedRows = this.selected().filter(rowItem =>
        thisRow.value.find((item: TRow) => item === rowItem)
      );
      const checkBoxInput = this.checkBoxInput();
      if (checkBoxInput) {
        if (selectedRows.length && selectedRows.length !== row.value.length) {
          checkBoxInput.nativeElement.indeterminate = true;
        } else {
          checkBoxInput.nativeElement.indeterminate = false;
        }
      }
      this.selectedGroupRows.set(selectedRows);
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.rowContextmenu.emit({ event: $event, row: this.row() });
  }

  onCheckboxChange(groupSelected: boolean, group: Group<TRow>): void {
    const selectedSet = new Set(this.selected());

    if (groupSelected) {
      group.value.forEach((item: TRow) => {
        selectedSet.add(item);
      });
    } else {
      group.value.forEach((item: TRow) => {
        selectedSet.delete(item);
      });
    }

    const selected = Array.from(selectedSet);
    // Update `selected` of DatatableComponent with newly evaluated `selected`
    this.tableComponent.selected = [...selected];
    // Emit select event with updated values
    this.tableComponent.onBodySelect({
      selected: [...selected]
    });
  }

  isGroup(row: RowOrGroup<TRow>): row is Group<TRow> {
    return !!this.groupHeader();
  }
}
