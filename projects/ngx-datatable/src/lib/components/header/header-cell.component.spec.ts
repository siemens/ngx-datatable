import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  AfterViewInit,
  Component,
  computed,
  inputBinding,
  outputBinding,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from '@vitest/browser/context';

import { provideDatatableConfigurationMock } from '../../../testing/datatable-configuration.mock';
import { DataTableColumnReorderHandleDirective } from '../../directives/column-reorder-handle.directive';
import {
  InnerSortEvent,
  SortableTableColumnInternal,
  TableColumnInternal
} from '../../types/internal.types';
import { SortPropDir } from '../../types/public.types';
import { toInternalColumn } from '../../utils/column-helper';
import { DataTableHeaderCellComponent } from './header-cell.component';
import { HeaderCellHarness } from './testing/header-cell.harnes';

describe('DataTableHeaderCellComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderCellComponent>;
  let component: DataTableHeaderCellComponent;
  let harness: HeaderCellHarness;

  beforeEach(async () => {
    vi.spyOn(HTMLElement.prototype, 'setPointerCapture').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [provideDatatableConfigurationMock()]
    });
    fixture = TestBed.createComponent(DataTableHeaderCellComponent);
    fixture.componentRef.setInput('sortType', 'single');
    component = fixture.componentInstance;
    fixture.componentRef.setInput('column', {
      name: 'test',
      prop: 'test',
      resizeable: true,
      sortable: true,
      width: signal(0)
    });
    fixture.componentRef.setInput('sortType', 'single');
    fixture.componentInstance.sort.subscribe(sort => {
      fixture.componentRef.setInput('sorts', [
        {
          prop: sort.column.name,
          dir: sort.newValue
        }
      ]);
    });
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, HeaderCellHarness);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should emit new width on resize', async () => {
    vi.spyOn(component.resizing, 'emit');
    const initialWidth = await harness.cellWidth();
    await harness.resizeCell(0, 100);
    const newWidth = 100 + initialWidth;
    await fixture.whenStable();
    expect(component.resizing.emit).toHaveBeenCalledWith({
      width: newWidth,
      column: {
        name: 'test',
        prop: 'test',
        resizeable: true,
        sortable: true,
        width: expect.any(Function)
      } as TableColumnInternal<any>
    });
  });

  it('should emit sort event', async () => {
    vi.spyOn(component.sort, 'emit');
    await harness.applySort();
    expect(component.sort.emit).toHaveBeenCalled();
  });

  it('should not render resize handle when showResizeHandle is false (last column)', async () => {
    fixture.componentRef.setInput('showResizeHandle', false);
    expect(await harness.hasResizeHandle()).toBe(false);
  });

  it('should render resize handle when showResizeHandle is true', async () => {
    fixture.componentRef.setInput('showResizeHandle', true);
    expect(await harness.hasResizeHandle()).toBe(true);
  });

  it('should emit select when checkbox is clicked', async () => {
    fixture.componentRef.setInput('column', {
      name: 'test',
      headerCheckboxable: true,
      width: signal(0)
    });
    vi.spyOn(component.select, 'emit');
    await harness.selectAllRows();
    expect(component.select.emit).toHaveBeenCalled();
  });

  it('should toggle sort direction on sort button click', async () => {
    await harness.applySort();
    expect(await harness.getSortDirection()).toBe('asc');
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('ascending');
    await harness.applySort();
    expect(await harness.getSortDirection()).toBe('desc');
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBe('descending');
  });

  it('should sort on enter key press', async () => {
    vi.spyOn(component.sort, 'emit');
    const sortButton = fixture.nativeElement.querySelector('.datatable-header-sort-button');
    sortButton.focus();
    await userEvent.keyboard('{Enter}');
    expect(component.sort.emit).toHaveBeenCalled();
  });

  it('should sort on space key press', async () => {
    vi.spyOn(component.sort, 'emit');
    const sortButton = fixture.nativeElement.querySelector('.datatable-header-sort-button');
    sortButton.focus();
    await userEvent.keyboard(' ');
    expect(component.sort.emit).toHaveBeenCalled();
  });

  it('should focus the sort button instead of the header cell', () => {
    const headerCell = fixture.nativeElement as HTMLElement;
    const sortButton = headerCell.querySelector(
      '.datatable-header-sort-button'
    ) as HTMLButtonElement;

    expect(headerCell.getAttribute('tabindex')).toBeNull();
    expect(sortButton).toHaveClass('datatable-header-reorder-handle');
    sortButton.focus();
    expect(document.activeElement).toBe(sortButton);
  });

  it('should not add a tab stop for a non-sortable header', async () => {
    fixture.componentRef.setInput('column', {
      name: 'test',
      sortable: false,
      width: signal(0)
    });
    await fixture.whenStable();

    expect(fixture.nativeElement.getAttribute('tabindex')).toBeNull();
    expect(fixture.nativeElement.getAttribute('aria-sort')).toBeNull();
    expect(fixture.nativeElement.querySelector('.datatable-header-sort-button')).toBeNull();
    expect(fixture.nativeElement.querySelector('.datatable-header-cell-label')).toHaveClass(
      'datatable-header-reorder-handle'
    );
  });
});

@Component({
  imports: [DataTableHeaderCellComponent, DataTableColumnReorderHandleDirective],
  template: `
    <datatable-header-cell sortType="single" [column]="column()" (sort)="sort($event)" />
    <ng-template #headerCellTemplate let-sort="sortFn" let-column="column">
      <span class="custom-header">Custom Header for {{ column.name }}</span>
      <button
        class="custom-sort-button"
        type="button"
        ngxDatatableReorderHandle
        (click)="sort($event)"
      >
        Custom sort button
      </button>
    </ng-template>
  `
})
class TestHeaderCellComponent implements AfterViewInit {
  readonly column = signal<TableColumnInternal<any>>(
    toInternalColumn([
      {
        name: 'test',
        sortable: true
      }
    ])[0]
  );

  readonly headerCellTemplate = viewChild('headerCellTemplate', { read: TemplateRef<any> });

  sort(event: InnerSortEvent) {}

  ngAfterViewInit() {
    this.column.set({ ...this.column(), headerCellTemplate: this.headerCellTemplate() });
  }
}

describe('DataTableHeaderCellComponent with template', () => {
  let fixture: ComponentFixture<TestHeaderCellComponent>;
  let harness: HeaderCellHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideDatatableConfigurationMock()]
    });
    fixture = TestBed.createComponent(TestHeaderCellComponent);
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, HeaderCellHarness);
  });

  it('should render custom header template', async () => {
    await fixture.whenStable();
    expect(await harness.getHeaderCellText()).toContain('Custom Header for test');
  });

  it('should call sort function on custom button click', async () => {
    vi.spyOn(fixture.componentInstance, 'sort');
    await harness.clickCustomSortButton();
    expect(fixture.componentInstance.sort).toHaveBeenCalledWith({
      column: fixture.componentInstance.column() as SortableTableColumnInternal<any>,
      prevValue: undefined,
      newValue: 'asc'
    });
  });

  it('should expose an explicit reorder handle in a custom header cell', () => {
    expect(fixture.nativeElement.querySelector('.custom-sort-button')).toHaveClass(
      'datatable-header-reorder-handle'
    );
  });
});

@Component({
  imports: [DataTableHeaderCellComponent],
  template: `
    <datatable-header-cell sortType="single" [column]="column()" (sort)="sort($event)" />
    <ng-template #headerLabelTemplate let-column="column">
      <strong class="custom-label">{{ column.name }}</strong>
    </ng-template>
    <ng-template #headerActionsTemplate>
      <button class="custom-action" type="button" (click)="action()">Filter</button>
    </ng-template>
  `
})
class TestHeaderSlotsComponent implements AfterViewInit {
  readonly column = signal<TableColumnInternal<any>>(
    toInternalColumn([{ name: 'test', sortable: true }])[0]
  );
  readonly headerLabelTemplate = viewChild('headerLabelTemplate', { read: TemplateRef<any> });
  readonly headerActionsTemplate = viewChild('headerActionsTemplate', {
    read: TemplateRef<any>
  });

  sort(event: InnerSortEvent) {}

  action() {}

  ngAfterViewInit(): void {
    this.column.set({
      ...this.column(),
      headerLabelTemplate: this.headerLabelTemplate(),
      headerActionsTemplate: this.headerActionsTemplate()
    });
  }
}

describe('DataTableHeaderCellComponent with label and actions templates', () => {
  let fixture: ComponentFixture<TestHeaderSlotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideDatatableConfigurationMock()]
    });
    fixture = TestBed.createComponent(TestHeaderSlotsComponent);
  });

  it('should render the label inside the sort button and actions outside it', async () => {
    await fixture.whenStable();
    const sortButton = fixture.nativeElement.querySelector('.datatable-header-sort-button');
    const actionButton = fixture.nativeElement.querySelector('.custom-action');

    expect(sortButton.querySelector('.custom-label')).not.toBeNull();
    expect(sortButton.contains(actionButton)).toBe(false);
    expect(actionButton).not.toHaveClass('datatable-header-reorder-handle');
  });

  it('should not sort when a header action is activated', async () => {
    await fixture.whenStable();
    const sortSpy = vi.spyOn(fixture.componentInstance, 'sort');
    const actionSpy = vi.spyOn(fixture.componentInstance, 'action');

    await userEvent.click(fixture.nativeElement.querySelector('.custom-action'));

    expect(actionSpy).toHaveBeenCalled();
    expect(sortSpy).not.toHaveBeenCalled();
  });
});

describe('DataTableHeaderCellComponent - custom sort icons', () => {
  let fixture: ComponentFixture<DataTableHeaderCellComponent>;
  let sorts: WritableSignal<SortPropDir[]>;
  const column = signal({
    name: 'test',
    prop: 'test',
    sortable: true,
    resizeable: false,
    width: signal(20)
  });
  const sortAscendingIcon = signal('icon up');
  const sortDescendingIcon = signal('icon down');

  beforeEach(async () => {
    sorts = signal<SortPropDir[]>([]);
    TestBed.configureTestingModule({
      providers: [
        provideDatatableConfigurationMock({
          cssClasses: computed(() => ({
            sortAscending: sortAscendingIcon(),
            sortDescending: sortDescendingIcon()
          }))
        })
      ]
    });
    fixture = TestBed.createComponent(DataTableHeaderCellComponent, {
      bindings: [
        inputBinding('sortType', () => 'single'),
        inputBinding('column', column),
        inputBinding('sorts', sorts),
        inputBinding('showResizeHandle', () => false),
        outputBinding('sort', (event: InnerSortEvent) => {
          sorts.set([{ prop: event.column.prop!, dir: event.newValue! }]);
        })
      ]
    });
    await fixture.whenStable();
  });

  it('should apply custom sortAscendingIcon class when toggling to ascending sort', async () => {
    const label = fixture.nativeElement.querySelector('.datatable-header-cell-label');
    await userEvent.click(label);
    await fixture.whenStable();

    const sortBtn = fixture.nativeElement.querySelector('.sort-btn');

    expect(sortBtn).toHaveClass('sort-btn');
    expect(sortBtn).toHaveClass('sort-asc');
    expect(sortBtn).toHaveClass('icon');
    expect(sortBtn).toHaveClass('up');
    expect(sortBtn).not.toHaveClass('datatable-icon-up');
  });

  it('should apply custom sortDescendingIcon class when toggling to descending sort', async () => {
    const label = fixture.nativeElement.querySelector('.datatable-header-cell-label');
    await userEvent.click(label);
    await fixture.whenStable();

    await userEvent.click(label);
    await fixture.whenStable();

    const sortButton = fixture.nativeElement.querySelector('.sort-btn');
    expect(sortButton).toHaveClass('sort-btn');
    expect(sortButton).toHaveClass('sort-desc');
    expect(sortButton).toHaveClass('icon');
    expect(sortButton).toHaveClass('down');
    expect(sortButton).not.toHaveClass('datatable-icon-down');
  });
});
