import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  OutputEmitterRef,
  signal,
  TemplateRef,
  TrackByFunction,
  untracked,
  viewChildren,
  viewChild
} from '@angular/core';

import { RowLocation } from '../../types/internal.types';
import {
  ActivateEvent,
  DetailToggleEvents,
  DragEventData,
  Group,
  GroupToggleEvents,
  Row,
  RowOrGroup,
  ScrollEvent,
  ScrollToRowOptions
} from '../../types/public.types';
import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER } from '../../utils/keys';
import { selectRows, selectRowsBetween } from '../../utils/selection';
import { DatatableConfiguration } from '../datatable-configuration';
import { DatatableRowDetailDirective } from '../row-detail/row-detail.directive';
import { TableController } from '../table-controller';
import { DatatableGroupHeaderDirective } from './body-group-header.directive';
import { DataTableGroupWrapperComponent } from './body-group-wrapper.component';
import { DatatableRowDefInternalDirective } from './body-row-def.component';
import { DataTableRowWrapperComponent } from './body-row-wrapper.component';
import { DataTableBodyRowComponent } from './body-row.component';
import { DatatableBodyRowDirective } from './body-row.directive';
import { DataTableGhostLoaderComponent } from './ghost-loader/ghost-loader.component';
import { ScrollerComponent } from './scroller.component';
import { DataTableSummaryRowComponent } from './summary/summary-row.component';

@Component({
  selector: 'datatable-body',
  imports: [
    DataTableGhostLoaderComponent,
    ScrollerComponent,
    DataTableSummaryRowComponent,
    DataTableRowWrapperComponent,
    DatatableRowDefInternalDirective,
    DataTableBodyRowComponent,
    NgTemplateOutlet,
    DatatableBodyRowDirective,
    DataTableGroupWrapperComponent
  ],
  template: `
    @if (controller.loadingIndicator()) {
      <div class="custom-loading-indicator-wrapper">
        <div class="custom-loading-content">
          <ng-content select="[loading-indicator]" />
        </div>
      </div>
    }
    @let scrollbarV = this.controller.scrollbarV();
    @let columns = this.controller.columns();
    @let bodyHeight = this._bodyHeight();
    @let rows = this.controller.rows();
    @let rowCount = this.controller.rowCount();
    @if (
      controller.ghostLoadingIndicator() &&
      (!rowCount || !controller.virtualization() || !scrollbarV)
    ) {
      <ghost-loader
        class="ghost-overlay"
        [columns]="columns"
        [pageSize]="controller.pageSize()"
        [rowHeight]="configuration().rowHeight"
        [ghostBodyHeight]="bodyHeight"
      />
    }
    @if (rows.length) {
      <datatable-scroller
        [scrollbarV]="scrollbarV"
        [scrollbarH]="controller.scrollbarH()"
        [scrollHeight]="controller.scrollHeight()"
        (scroll)="onBodyScroll($event)"
      >
        @if (
          (controller.summaryRow() || summaryRowTemplate()) &&
          controller.summaryPosition() === 'top'
        ) {
          <datatable-summary-row
            [class.sticky]="summaryRowTemplate()"
            [rowHeight]="controller.summaryHeight()"
            [rows]="rows"
            [columns]="columns"
            [allColumnsColspan]="allColumnsColspan()"
            [template]="summaryRowTemplate()"
          />
        }
        <ng-template
          #bodyRow
          let-row="row"
          let-index="index"
          let-indexInGroup="indexInGroup"
          let-groupedRows="groupedRows"
          let-disabled="disabled"
          ngx-datatable-body-row
        >
          @let absoluteIndex = controller.indexes().first + index;
          <datatable-row-wrapper
            [attr.hidden]="
              controller.ghostLoadingIndicator() &&
              (!rowCount || !controller.virtualization() || !scrollbarV)
                ? true
                : null
            "
            [rowDetail]="rowDetail()"
            [detailRowHeightFn]="detailRowHeightFn()"
            [row]="row"
            [disabled]="disabled"
            [expanded]="getRowExpanded(row)"
            [rowIndex]="absoluteIndex"
            [checkRowPropertyChanges]="controller.checkRowPropertyChanges()"
            (rowContextmenu)="rowContextmenu.emit($event)"
          >
            <datatable-body-row
              #rowElement
              [disabled]="disabled"
              [isSelected]="getRowSelected(row)"
              [columns]="columns"
              [rowHeight]="getRowHeight(row)"
              [row]="row"
              [group]="groupedRows"
              [rowIndex]="{ index: absoluteIndex, indexInGroup: indexInGroup }"
              [expanded]="getRowExpanded(row)"
              [rowClass]="controller.rowClass()"
              [displayCheck]="controller.displayCheck()"
              [treeStatus]="row?.treeStatus"
              [draggable]="controller.rowDraggable()"
              [checkRowPropertyChanges]="controller.checkRowPropertyChanges()"
              (treeAction)="onTreeAction(row)"
              (activate)="onActivate($event, absoluteIndex, indexInGroup)"
              (drop)="drop($event, row, rowElement)"
              (dragover)="dragOver($event, row)"
              (dragenter)="dragEnter($event, row, rowElement)"
              (dragleave)="dragLeave($event, row, rowElement)"
              (dragstart)="drag($event, row, rowElement)"
              (dragend)="dragEnd($event, row)"
            />
          </datatable-row-wrapper>
        </ng-template>

        <div class="datatable-row-render-wrapper" [style.transform]="controller.renderOffset()">
          @for (group of controller.rowsToRender(); track rowTrackingFn(i, group); let i = $index) {
            @let absoluteIndex = controller.indexes().first + i;
            @if (!group && controller.ghostLoadingIndicator()) {
              <ghost-loader
                [columns]="columns"
                [pageSize]="1"
                [rowHeight]="configuration().rowHeight"
              />
            } @else if (group) {
              @let disableRowCheck = this.controller.disableRowCheck();
              @let disabled = isRow(group) && disableRowCheck && disableRowCheck(group);
              @let rowDefTemplate = this.rowDefTemplate();
              @if (rowDefTemplate) {
                <ng-container
                  *rowDefInternal="
                    {
                      template: rowDefTemplate,
                      rowTemplate: bodyRow,
                      row: group,
                      index: i
                    };
                    disabled: disabled
                  "
                />
              } @else {
                @if (isRow(group)) {
                  <ng-container
                    [ngTemplateOutlet]="bodyRow"
                    [ngTemplateOutletContext]="{
                      row: group,
                      index: i,
                      disabled
                    }"
                  />
                }
              }

              @if (isGroup(group)) {
                <datatable-group-wrapper
                  [group]="group"
                  [attr.hidden]="
                    controller.ghostLoadingIndicator() &&
                    (!rowCount || !controller.virtualization() || !scrollbarV)
                      ? true
                      : null
                  "
                  [groupHeader]="groupHeader()"
                  [groupHeaderRowHeight]="getGroupHeaderRowHeight(group, absoluteIndex)"
                  [disabled]="disabled"
                  [expanded]="getGroupExpanded(group)"
                  [rowIndex]="absoluteIndex"
                  [selected]="controller.selected()"
                  [allColumnsColspan]="allColumnsColspan()"
                  (groupSelectedChange)="groupSelectedChange($event, group)"
                >
                  @for (row of group.value; track rowTrackingFn($index, row)) {
                    @let disabled = disableRowCheck && disableRowCheck(row);
                    <ng-container
                      [ngTemplateOutlet]="bodyRow"
                      [ngTemplateOutletContext]="{
                        row,
                        groupedRows: group?.value,
                        index: i,
                        indexInGroup: $index,
                        disabled
                      }"
                    />
                  }
                </datatable-group-wrapper>
              }
            }
          }
        </div>
      </datatable-scroller>
      @if (
        (controller.summaryRow() || summaryRowTemplate()) &&
        controller.summaryPosition() === 'bottom'
      ) {
        <datatable-summary-row
          [rowHeight]="controller.summaryHeight()"
          [rows]="rows"
          [columns]="columns"
          [allColumnsColspan]="allColumnsColspan()"
          [template]="summaryRowTemplate()"
        />
      }
    }
    @if (!rows?.length && !controller.loadingIndicator() && !controller.ghostLoadingIndicator()) {
      <datatable-scroller
        class="datatable-empty-scroller"
        [scrollbarV]="scrollbarV"
        [scrollbarH]="controller.scrollbarH()"
        [scrollHeight]="controller.scrollHeight()"
        (scroll)="onBodyScroll($event)"
      >
        <div role="row" class="datatable-empty-row">
          <div role="cell" class="datatable-empty-cell" [attr.aria-colspan]="allColumnsColspan()">
            <ng-content select="[empty-content]" />
          </div>
        </div>
      </datatable-scroller>
    }
  `,
  styleUrl: './body.component.scss',
  host: {
    class: 'datatable-body'
  }
})
export class DataTableBodyComponent<TRow extends Row = any> implements OnInit {
  cd = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  protected readonly configuration = inject(DatatableConfiguration).configuration;
  protected readonly controller = inject<TableController<TRow>>(TableController);

  readonly rowDefTemplate = input<TemplateRef<any>>();
  readonly rowDetail = input<DatatableRowDetailDirective>();
  readonly groupHeader = input<DatatableGroupHeaderDirective>();
  readonly summaryRowTemplate = input<TemplateRef<void>>();
  readonly rowDragEvents = input.required<OutputEmitterRef<DragEventData>>();

  readonly scroll = output<ScrollEvent>();
  readonly page = output<number>();
  readonly activate = output<ActivateEvent<TRow>>();
  readonly rowContextmenu = output<{
    event: MouseEvent;
    row: RowOrGroup<TRow>;
  }>();
  readonly treeAction = output<{ row: TRow }>();

  private readonly scroller = viewChild(ScrollerComponent);
  private readonly rowWrappers = viewChildren(DataTableRowWrapperComponent);
  private readonly rowComponents =
    viewChildren<DataTableBodyRowComponent<TRow>>(DataTableBodyRowComponent);

  /**
   * Returns if selection is enabled.
   */
  get selectEnabled(): boolean {
    return !!this.controller.selectionType();
  }

  protected readonly allColumnsColspan = computed(() =>
    Math.max(1, this.controller.columns().length)
  );

  /**
   * Property that would calculate the height of scroll bar
   * based on the row heights cache for virtual scroll and virtualization. Other scenarios
   * calculate scroll height automatically (as height will be undefined).
   */
  readonly detailRowHeightFn = computed(() => {
    const rowDetail = this.rowDetail();
    if (!rowDetail) {
      return () => 0;
    }
    const rowHeight = rowDetail.rowHeight();
    return typeof rowHeight === 'function' ? rowHeight : () => rowHeight;
  });

  private readonly pendingFocus = signal<{ location: RowLocation; cellIndex?: number } | undefined>(
    undefined
  );
  rowTrackingFn: TrackByFunction<RowOrGroup<TRow> | undefined>;
  private groupExpansionDefaultDisabled = false;

  readonly _bodyHeight = computed(() => {
    if (this.controller.scrollbarV()) {
      return this.controller.bodyHeight() + 'px';
    } else {
      return 'auto';
    }
  });
  _offsetEvent = -1;

  private _draggedRow?: RowOrGroup<TRow>;
  private _draggedRowElement?: HTMLElement;

  /**
   * Creates an instance of DataTableBodyComponent.
   */
  constructor() {
    // declare fn here so we can get access to the `this` property
    this.rowTrackingFn = (index, row) => {
      if (this.controller.ghostLoadingIndicator()) {
        return index;
      }
      const trackByProp = this.controller.trackByProp();
      if (trackByProp && row && this.isRow(row)) {
        return row[trackByProp];
      } else if (row && this.isGroup(row)) {
        return row.key ?? index;
      } else {
        return row ?? index;
      }
    };
    effect(() => this.defaultGroupExpansionEffect());
    effect(() => this.focusPendingRow());
    effect(() => {
      this.controller.pageSize();
      untracked(() => {
        this._offsetEvent = -1;
        this.updatePage('up');
        this.updatePage('down');
      });
    });
  }

  /**
   * Called after the constructor, initializing input properties
   */
  ngOnInit(): void {
    const rowDetail = this.rowDetail();
    if (rowDetail) {
      const listener = rowDetail.toggle.subscribe(event => this.rowToggleStateChange(event));
      this.destroyRef.onDestroy(() => listener.unsubscribe());
    }

    const groupHeader = this.groupHeader();
    if (groupHeader) {
      const listener = groupHeader.toggle.subscribe(event => {
        // Remove default expansion state once user starts manual toggle.
        this.groupExpansionDefaultDisabled = true;
        this.groupToggleStateChange(event);
      });
      this.destroyRef.onDestroy(() => listener.unsubscribe());
    }
  }

  private defaultGroupExpansionEffect(): void {
    if (
      this.controller.groupedRows() &&
      untracked(() => this.controller.groupExpansions().length) === 0 &&
      this.controller.groupExpansionDefault() &&
      !this.groupExpansionDefaultDisabled
    ) {
      this.setGroupExpansions([...(this.controller.groupedRows() ?? [])]);
    }
  }

  private groupToggleStateChange({ type, value }: GroupToggleEvents<TRow>) {
    if (type === 'group') {
      this.toggleGroupExpansion(value);
    }
    if (type === 'all') {
      this.toggleAllGroups(value);
    }

    // Refresh rows after toggle
    this.cd.markForCheck();
  }

  private rowToggleStateChange({ type, value }: DetailToggleEvents<TRow>) {
    if (type === 'row') {
      this.toggleRowExpansion(value);
    }
    if (type === 'all') {
      this.toggleAllRows(value);
    }

    // Refresh rows after toggle
    this.cd.markForCheck();
  }

  /**
   * Updates the Y offset given a new offset.
   */
  updateOffsetY(offset?: number): void {
    // scroller is missing on empty table
    const scroller = this.scroller();
    if (!scroller) {
      return;
    }

    const virtualization = this.controller.virtualization();
    if (this.controller.scrollbarV() && virtualization && offset) {
      // First get the row Index that we need to move to.
      const rowIndex = this.controller.pageSize() * offset;
      offset = this.controller.rowHeightsCache().query(rowIndex - 1);
    } else if (this.controller.scrollbarV() && !virtualization) {
      offset = 0;
    }

    scroller.setOffset(offset ?? 0);
  }

  /**
   * Body was scrolled, this is mainly useful for
   * when a user is server-side pagination via virtual scroll.
   */
  onBodyScroll(event: any): void {
    const scrollYPos: number = event.scrollYPos;
    const scrollXPos: number = event.scrollXPos;

    // if scroll change, trigger update
    // this is mainly used for header cell positions
    if (this.controller.offsetY() !== scrollYPos || this.controller.offsetX() !== scrollXPos) {
      this.scroll.emit({
        offsetY: scrollYPos,
        offsetX: scrollXPos
      });
    }

    this.controller.setScrollOffset(scrollXPos, scrollYPos);

    this.updatePage(event.direction);
    this.cd.detectChanges();
  }

  private focusPendingRow(): void {
    const pendingFocus = this.pendingFocus();
    if (!pendingFocus) {
      return;
    }

    const row = this.getRenderedRow(pendingFocus.location);
    if (row) {
      this.focusRenderedRow(row, pendingFocus.cellIndex);
      this.pendingFocus.set(undefined);
    }
  }

  /**
   * Updates the page given a direction.
   */
  updatePage(direction: string): void {
    let offset = this.controller.indexes().first / this.controller.pageSize();
    const scrollInBetween = !Number.isInteger(offset);
    if (direction === 'up') {
      offset = Math.ceil(offset);
    } else if (direction === 'down') {
      offset = Math.floor(offset);
    }

    if (direction !== undefined && !isNaN(offset) && offset !== this._offsetEvent) {
      this._offsetEvent = offset;
      // if scroll was done by mouse drag make sure previous row and next row data is also fetched if its not fetched
      if (
        scrollInBetween &&
        this.controller.scrollbarV() &&
        this.controller.virtualization() &&
        this.controller.externalPaging()
      ) {
        const upRow = this.controller.rows()[this.controller.indexes().first - 1];
        if (!upRow && direction === 'up') {
          this.page.emit(offset - 1);
        }

        const downRow =
          this.controller.rows()[this.controller.indexes().first + this.controller.pageSize()];
        if (!downRow && direction === 'down') {
          this.page.emit(offset + 1);
        }
      }
      this.page.emit(offset);
    }
  }

  scrollToIndex(index: number, options?: ScrollToRowOptions): void {
    if (this.controller.virtualization()) {
      const scroller = this.scroller();
      if (!scroller) {
        return;
      }

      const cache = this.controller.rowHeightsCache();
      const rowTop = cache.query(index - 1);
      const rowBottom = cache.query(index);
      const rowHeight = rowBottom - rowTop;
      // virtualization always provides a numeric bodyHeight
      const viewportHeight = this.controller.bodyHeight() as number;
      const currentScrollTop = scroller.scrollTop;
      const block = options?.block ?? 'start';

      let top: number;
      switch (block) {
        case 'center':
          top = rowTop - Math.max(0, (viewportHeight - rowHeight) / 2);
          break;
        case 'end':
          top = rowBottom - viewportHeight;
          break;
        case 'nearest':
          if (rowTop < currentScrollTop) {
            top = rowTop;
          } else if (rowBottom > currentScrollTop + viewportHeight) {
            top = rowBottom - viewportHeight;
          } else {
            top = currentScrollTop;
          }
          break;
        case 'start':
        default:
          top = rowTop;
          break;
      }

      scroller.scrollTo(Math.max(0, top), options);
    } else {
      this.rowWrappers()[index]?.scrollIntoView(options);
    }
  }

  /**
   * Get the row height
   */
  getRowHeight(row: RowOrGroup<TRow>): number {
    // if its a function return it
    const rowHeight = this.configuration().rowHeight;
    if (typeof rowHeight === 'function') {
      return rowHeight(row);
    }

    return rowHeight as number;
  }

  getGroupHeaderRowHeight = (row?: any, index?: any): number => {
    const groupHeader = this.groupHeader();
    if (!groupHeader) {
      return 0;
    }
    const rowHeightValue = groupHeader?.rowHeight();
    const rowHeight = rowHeightValue === 0 ? this.configuration().rowHeight : rowHeightValue;
    return typeof rowHeight === 'function' ? rowHeight(row, index) : (rowHeight as number);
  };

  /**
   * Calculates the offset of the rendered rows.
   * As virtual rows are not shown, we have to move all rendered rows
   * by the total size of previous non-rendered rows.
   * If each row has a size of 10px and the first 10 rows are not rendered due to scroll,
   * then we have a renderOffset of 100px.
   */
  private updateRowExpansions(update: (rows: TRow[]) => TRow[]): void {
    this.controller.rowExpansions.update(update);
  }

  private setRowExpansions(rows: TRow[]): void {
    this.controller.rowExpansions.set(rows);
  }

  private updateGroupExpansions(update: (groups: Group<TRow>[]) => Group<TRow>[]): void {
    this.controller.groupExpansions.update(update);
  }

  private setGroupExpansions(groups: Group<TRow>[]): void {
    this.controller.groupExpansions.set(groups);
  }

  /**
   * Toggle the Expansion of the row i.e. if the row is expanded then it will
   * collapse and vice versa.   Note that the expanded status is stored as
   * a part of the row object itself as we have to preserve the expanded row
   * status in case of sorting and filtering of the row set.
   */
  toggleRowExpansion(row: TRow): void {
    const rowExpandedIdx = this.getExpandedIdx(row, this.controller.rowExpansions());
    const expanded = rowExpandedIdx > -1;

    // Update the toggled row and update thive nevere heights in the cache.
    if (expanded) {
      this.updateRowExpansions(expansions => {
        expansions.splice(rowExpandedIdx, 1);
        return [...expansions];
      });
    } else {
      this.updateRowExpansions(expansions => [...expansions, row]);
    }
  }

  toggleGroupExpansion(row: Group<TRow>): void {
    const groupExpandedIdx = this.getExpandedIdx(row, this.controller.groupExpansions());
    const expanded = groupExpandedIdx > -1;

    // Update the toggled row and update thive nevere heights in the cache.
    if (expanded) {
      this.updateGroupExpansions(expansions => {
        expansions.splice(groupExpandedIdx, 1);
        return [...expansions];
      });
    } else {
      this.updateGroupExpansions(expansions => [...expansions, row]);
    }
  }

  /**
   * Expand/Collapse all the rows no matter what their state is.
   */
  toggleAllRows(expanded: boolean): void {
    // TODO requires fixing. This still does not work with groups.
    this.setRowExpansions(expanded ? [...(this.controller.rows() as TRow[])] : []);
  }

  /**
   * Expand/Collapse all the groups no matter what their state is.
   */
  toggleAllGroups(expanded: boolean): void {
    this.setGroupExpansions(expanded ? [...this.controller.groupedRows()!] : []);
  }

  /**
   * Returns if the row was expanded and set default row expansion when row expansion is empty
   */
  getRowExpanded(row: TRow): boolean {
    return this.getExpandedIdx(row, this.controller.rowExpansions()) > -1;
  }

  getGroupExpanded(group: Group<TRow>): boolean {
    return this.getExpandedIdx(group, this.controller.groupExpansions()) > -1;
  }

  getExpandedIdx(row: RowOrGroup<TRow>, expanded: RowOrGroup<TRow>[]): number {
    if (!expanded?.length) {
      return -1;
    }

    const rowId = this.controller.rowIdentity()(row);
    return expanded.findIndex(r => {
      const id = this.controller.rowIdentity()(r);
      return id === rowId;
    });
  }

  onTreeAction(row: TRow) {
    this.treeAction.emit({ row });
  }

  dragOver(event: DragEvent, dropRow: RowOrGroup<TRow>) {
    event.preventDefault();
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement!,
      eventType: 'dragover',
      dragRow: this._draggedRow,
      dropRow
    });
  }

  drag(event: DragEvent, dragRow: RowOrGroup<TRow>, rowComponent: DataTableBodyRowComponent<TRow>) {
    this._draggedRow = dragRow;
    this._draggedRowElement = rowComponent._element;
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement,
      eventType: 'dragstart',
      dragRow
    });
  }

  drop(event: DragEvent, dropRow: RowOrGroup<TRow>, rowComponent: DataTableBodyRowComponent<TRow>) {
    event.preventDefault();
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement!,
      targetElement: rowComponent._element,
      eventType: 'drop',
      dragRow: this._draggedRow,
      dropRow
    });
  }

  dragEnter(
    event: DragEvent,
    dropRow: RowOrGroup<TRow>,
    rowComponent: DataTableBodyRowComponent<TRow>
  ) {
    event.preventDefault();
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement!,
      targetElement: rowComponent._element,
      eventType: 'dragenter',
      dragRow: this._draggedRow,
      dropRow
    });
  }

  dragLeave(
    event: DragEvent,
    dropRow: RowOrGroup<TRow>,
    rowComponent: DataTableBodyRowComponent<TRow>
  ) {
    event.preventDefault();
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement!,
      targetElement: rowComponent._element,
      eventType: 'dragleave',
      dragRow: this._draggedRow,
      dropRow
    });
  }

  dragEnd(event: DragEvent, dragRow: RowOrGroup<TRow>) {
    event.preventDefault();
    this.rowDragEvents().emit({
      event,
      srcElement: this._draggedRowElement!,
      eventType: 'dragend',
      dragRow
    });
    this._draggedRow = undefined;
    this._draggedRowElement = undefined;
  }

  prevIndex?: number;

  selectRow(event: Event, index: number, row: TRow): void {
    if (!this.selectEnabled) {
      return;
    }

    const chkbox = this.controller.selectionType() === 'checkbox';
    const multi = this.controller.selectionType() === 'multi';
    const multiClick = this.controller.selectionType() === 'multiClick';
    let selected: TRow[];

    // TODO: this code needs cleanup. Casting it to KeyboardEvent is not correct as it could also be other types.
    if (multi || chkbox || multiClick) {
      if ((event as KeyboardEvent).shiftKey && this.prevIndex !== undefined) {
        const rangeSelection = selectRowsBetween(this.controller.rows(), index, this.prevIndex);
        selected = [...this.controller.selected()];
        for (const rangeRow of rangeSelection) {
          if (this.getRowSelectedIdx(rangeRow, selected) < 0) {
            selected.push(rangeRow);
          }
        }
      } else if (
        (event as KeyboardEvent).key === 'a' &&
        ((event as KeyboardEvent).ctrlKey || (event as KeyboardEvent).metaKey)
      ) {
        // select all rows except dummy rows which are added for ghostloader in case of virtual scroll
        selected = this.controller.rows().filter(rowItem => !!rowItem);
      } else if (
        (event as KeyboardEvent).ctrlKey ||
        (event as KeyboardEvent).metaKey ||
        multiClick ||
        chkbox
      ) {
        selected = selectRows(
          [...this.controller.selected()],
          row,
          this.getRowSelectedIdx.bind(this)
        );
      } else {
        selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
      }
    } else {
      selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
    }

    const selectCheck = this.controller.selectCheck();
    if (typeof selectCheck === 'function') {
      selected = selected.filter(selectCheck.bind(this));
    }

    if (typeof this.controller.disableRowCheck() === 'function') {
      selected = selected.filter(rowData => !this.controller.disableRowCheck()!(rowData));
    }

    this.controller.selected.set(selected);
    this.prevIndex = index;
  }

  onActivate(modelObject: ActivateEvent<TRow>, index: number, indexInGroup?: number): void {
    const { type, event, row } = modelObject;
    const chkbox = this.controller.selectionType() === 'checkbox';
    const select =
      (!chkbox && (type === 'click' || type === 'dblclick')) || (chkbox && type === 'checkbox');

    if (select) {
      this.selectRow(event, index, row);
    } else if (type === 'keydown') {
      if ((event as KeyboardEvent).key === ENTER) {
        this.selectRow(event, index, row);
      } else if (
        (event as KeyboardEvent).key === 'a' &&
        ((event as KeyboardEvent).ctrlKey || (event as KeyboardEvent).metaKey)
      ) {
        this.selectRow(event, 0, row); // The row property is ignored in this case. So we can pass anything.
      } else {
        this.onKeyboardFocus(modelObject, index, indexInGroup);
      }
    }
    this.activate.emit(modelObject);
  }

  groupSelectedChange(selected: boolean, group: Group<TRow>): void {
    const selectedSet = new Set(this.controller.selected());
    if (selected) {
      group.value.forEach(row => selectedSet.add(row));
    } else {
      group.value.forEach(row => selectedSet.delete(row));
    }
    this.controller.selected.set(Array.from(selectedSet));
  }

  onKeyboardFocus(modelObject: ActivateEvent<TRow>, index: number, indexInGroup?: number): void {
    const { key } = modelObject.event as KeyboardEvent;
    const shouldFocus =
      key === ARROW_UP || key === ARROW_DOWN || key === ARROW_RIGHT || key === ARROW_LEFT;

    if (shouldFocus) {
      const isCellSelection = this.controller.selectionType() === 'cell';
      const disableRowCheck = this.controller.disableRowCheck();
      if (typeof disableRowCheck === 'function') {
        const isRowDisabled = disableRowCheck(modelObject.row);
        if (isRowDisabled) {
          return;
        }
      }
      if (!isCellSelection) {
        this.focusRow(index, key, indexInGroup);
      } else if (isCellSelection && modelObject.renderedCellIndex !== undefined) {
        this.focusCell(index, key, modelObject.renderedCellIndex, indexInGroup);
      }
    }
  }

  focusRow(index: number, key: string, indexInGroup?: number): void {
    this.moveFocus({ outerIndex: index, innerIndex: indexInGroup }, key);
  }

  focusCell(index: number, key: string, cellIndex: number, indexInGroup?: number): void {
    if (key === ARROW_LEFT) {
      this.getRenderedRow({ outerIndex: index, innerIndex: indexInGroup })?.focusCell(
        cellIndex - 1
      );
    } else if (key === ARROW_RIGHT) {
      this.getRenderedRow({ outerIndex: index, innerIndex: indexInGroup })?.focusCell(
        cellIndex + 1
      );
    } else if (key === ARROW_UP || key === ARROW_DOWN) {
      this.moveFocus({ outerIndex: index, innerIndex: indexInGroup }, key, cellIndex);
    }
  }

  private moveFocus(current: RowLocation, key: string, cellIndex?: number): void {
    if (this.pendingFocus()) {
      return;
    }

    const target = this.getAdjacentRowLocation(current, key);
    if (!target) {
      this.pendingFocus.set(undefined);
      return;
    }

    const row = this.getRenderedRow(target);
    if (row) {
      this.pendingFocus.set(undefined);
      row.scrollIntoView();
      this.focusRenderedRow(row, cellIndex);
      return;
    }

    this.pendingFocus.set({ location: target, cellIndex });
    this.scrollToIndex(target.outerIndex, { block: 'nearest' });
  }

  private getAdjacentRowLocation(current: RowLocation, key: string): RowLocation | undefined {
    if (key !== ARROW_UP && key !== ARROW_DOWN) {
      return undefined;
    }

    const step = key === ARROW_UP ? -1 : 1;
    const groups = this.controller.groupedRows();
    if (!groups) {
      const outerIndex = current.outerIndex + step;
      return outerIndex >= 0 && outerIndex < this.controller.rowCount()
        ? { outerIndex }
        : undefined;
    }

    if (current.innerIndex === undefined) {
      return undefined;
    }

    const group = groups[current.outerIndex];
    if (!group) {
      return undefined;
    }

    const innerIndex = current.innerIndex + step;
    if (innerIndex >= 0 && innerIndex < group.value.length) {
      return { outerIndex: current.outerIndex, innerIndex };
    }

    for (let outerIndex = current.outerIndex + step; groups[outerIndex]; outerIndex += step) {
      const adjacentGroup = groups[outerIndex];
      if (adjacentGroup.value.length && this.getGroupExpanded(adjacentGroup)) {
        return {
          outerIndex,
          innerIndex: key === ARROW_UP ? adjacentGroup.value.length - 1 : 0
        };
      }
    }

    return undefined;
  }

  private getRenderedRow(location: RowLocation): DataTableBodyRowComponent<TRow> | undefined {
    return this.rowComponents().find(row => {
      const rowIndex = row.rowIndex();
      return (
        rowIndex.index === location.outerIndex && rowIndex.indexInGroup === location.innerIndex
      );
    });
  }

  private focusRenderedRow(row: DataTableBodyRowComponent<TRow>, cellIndex?: number): void {
    if (cellIndex === undefined) {
      row.focus();
    } else {
      row.focusCell(cellIndex);
    }
  }

  getRowSelected(row: TRow): boolean {
    return this.getRowSelectedIdx(row, this.controller.selected()) > -1;
  }

  getRowSelectedIdx(row: TRow, selected: any[]): number {
    if (!selected?.length) {
      return -1;
    }

    const rowId = this.controller.rowIdentity()(row);
    return selected.findIndex(r => {
      const id = this.controller.rowIdentity()(r);
      return id === rowId;
    });
  }
  protected isGroup(row: RowOrGroup<TRow>[]): row is Group<TRow>[];

  protected isGroup(row: RowOrGroup<TRow>): row is Group<TRow>;

  protected isGroup(row: RowOrGroup<TRow> | RowOrGroup<TRow>[]): boolean {
    return !!this.controller.groupedRows();
  }

  protected isRow(row: RowOrGroup<TRow> | undefined): row is TRow {
    return !this.controller.groupedRows();
  }
}
