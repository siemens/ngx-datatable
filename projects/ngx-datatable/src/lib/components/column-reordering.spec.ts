import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commands, type Locator, page, userEvent } from 'vitest/browser';

import { ReorderEvent, SortPropDir } from '../types/public.types';
import { TableColumn } from '../types/table-column.type';
import { DatatableComponent } from './datatable.component';

@Component({
  imports: [DatatableComponent],
  template: `
    <ngx-datatable
      [columns]="columns()"
      [rows]="rows"
      [reorderable]="reorderable()"
      [swapColumns]="swapColumns()"
      [(sorts)]="sorts"
      (reorder)="reorderEvents.push($event)"
    />
  `,
  host: {
    '[style.inline-size.px]': '600'
  }
})
class ColumnReorderingTestComponent {
  readonly columns = signal<TableColumn[]>([
    { name: 'Name', prop: 'name', width: 150 },
    { name: 'City', prop: 'city', width: 150 },
    { name: 'Age', prop: 'age', width: 150 },
    { name: 'Country', prop: 'country', width: 150 }
  ]);
  readonly rows = [
    { name: 'Ada', city: 'London', age: 36, country: 'UK' },
    { name: 'Grace', city: 'New York', age: 40, country: 'USA' }
  ];
  readonly reorderable = signal(true);
  readonly swapColumns = signal(true);
  readonly reorderEvents: ReorderEvent[] = [];
  readonly sorts = signal<SortPropDir[]>([]);
}

describe('column reordering through the DOM', () => {
  let fixture: ComponentFixture<ColumnReorderingTestComponent>;
  let component: ColumnReorderingTestComponent;

  const table = page.getByRole('table');
  const headers = table.getByRole('columnheader');
  const nameHeader = table.getByRole('columnheader', { name: 'Name', exact: true });
  const cityHeader = table.getByRole('columnheader', { name: 'City', exact: true });
  const ageHeader = table.getByRole('columnheader', { name: 'Age', exact: true });
  const bodyRows = table.getByRole('row').filter({ has: page.getByRole('cell') });
  const headerOrder = () => headers.elements().map(element => element.textContent?.trim());
  const bodyOrders = () =>
    bodyRows.all().map(row =>
      row
        .getByRole('cell')
        .elements()
        .map(cell => cell.textContent?.trim())
    );

  const expectOrder = async (names: string[], rows: string[][]) => {
    await expect.poll(headerOrder).toEqual(names);
    await expect.poll(bodyOrders).toEqual(rows);
    for (const header of headers.all()) {
      await expect.element(header).not.toHaveClass('dragging');
      await expect.element(header).toHaveStyle({ transform: 'none' });
      expect(header.element().getElementsByClassName('targetMarker')).toHaveLength(0);
    }
  };

  const drag = async (source: Locator, target: Locator) => {
    await commands.longPressDrag(source, target);
    await fixture.whenStable();
    expect(component.sorts()).toEqual([]);
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(ColumnReorderingTestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    await expectOrder(
      ['Name', 'City', 'Age', 'Country'],
      [
        ['Ada', 'London', '36', 'UK'],
        ['Grace', 'New York', '40', 'USA']
      ]
    );
  });

  it('swaps nonadjacent columns in the header and every body row', async () => {
    await drag(nameHeader, ageHeader);

    await expectOrder(
      ['Age', 'City', 'Name', 'Country'],
      [
        ['36', 'London', 'Ada', 'UK'],
        ['40', 'New York', 'Grace', 'USA']
      ]
    );
    expect(component.reorderEvents).toEqual([
      expect.objectContaining({
        prevValue: 0,
        newValue: 2,
        column: expect.objectContaining({ prop: 'name' })
      })
    ]);
  });

  it('inserts a column and shifts intervening columns when swapping is disabled', async () => {
    component.swapColumns.set(false);
    await fixture.whenStable();

    await drag(nameHeader, ageHeader);

    await expectOrder(
      ['City', 'Age', 'Name', 'Country'],
      [
        ['London', '36', 'Ada', 'UK'],
        ['New York', '40', 'Grace', 'USA']
      ]
    );
    expect(component.reorderEvents).toEqual([
      expect.objectContaining({
        prevValue: 0,
        newValue: 2,
        column: expect.objectContaining({ prop: 'name' })
      })
    ]);
  });

  it('does not reorder when table reordering is disabled', async () => {
    component.reorderable.set(false);
    await fixture.whenStable();

    await drag(nameHeader, ageHeader);

    await expectOrder(
      ['Name', 'City', 'Age', 'Country'],
      [
        ['Ada', 'London', '36', 'UK'],
        ['Grace', 'New York', '40', 'USA']
      ]
    );
    expect(component.reorderEvents).toEqual([]);
  });

  it('uses the updated column indices on a second, right-to-left drag', async () => {
    component.swapColumns.set(false);
    await fixture.whenStable();
    await drag(nameHeader, ageHeader);
    await expectOrder(
      ['City', 'Age', 'Name', 'Country'],
      [
        ['London', '36', 'Ada', 'UK'],
        ['New York', '40', 'Grace', 'USA']
      ]
    );

    await drag(nameHeader, cityHeader);

    await expectOrder(
      ['Name', 'City', 'Age', 'Country'],
      [
        ['Ada', 'London', '36', 'UK'],
        ['Grace', 'New York', '40', 'USA']
      ]
    );
    expect(component.reorderEvents).toEqual([
      expect.objectContaining({
        prevValue: 0,
        newValue: 2,
        column: expect.objectContaining({ prop: 'name' })
      }),
      expect.objectContaining({
        prevValue: 2,
        newValue: 0,
        column: expect.objectContaining({ prop: 'name' })
      })
    ]);
  });

  it('does not reorder on a normal header click', async () => {
    await userEvent.click(nameHeader);
    await fixture.whenStable();

    await expectOrder(
      ['Name', 'City', 'Age', 'Country'],
      [
        ['Ada', 'London', '36', 'UK'],
        ['Grace', 'New York', '40', 'USA']
      ]
    );
    expect(component.reorderEvents).toEqual([]);
  });
});
