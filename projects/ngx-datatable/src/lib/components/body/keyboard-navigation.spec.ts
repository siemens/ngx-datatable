import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { page, userEvent } from 'vitest/browser';

import { ActivateEvent, SelectionType } from '../../types/public.types';
import { TableColumn } from '../../types/table-column.type';
import { DatatableComponent } from '../datatable.component';

@Component({
  imports: [DatatableComponent],
  template: `
    <ngx-datatable
      [columns]="columns()"
      [rows]="rows()"
      [selectionType]="selectionType()"
      [disableRowCheck]="disableRowCheck()"
      [groupRowsBy]="groupRowsBy()"
      [groupExpansionDefault]="groupExpansionDefault()"
      [selected]="selected()"
      (selectedChange)="selected.set($event)"
      (activate)="activate.set($event)"
    />
  `,
  host: {
    '[style.inline-size.px]': '400'
  }
})
class KeyboardNavigationTestComponent {
  readonly columns = signal<TableColumn[]>([
    { name: 'Name', prop: 'name' },
    { name: 'City', prop: 'city' }
  ]);
  readonly rows = signal([
    { name: 'Ada', city: 'London' },
    { name: 'Grace', city: 'New York' },
    { name: 'Linus', city: 'Helsinki' }
  ]);
  readonly selected = signal<Record<string, string>[]>([]);
  readonly selectionType = signal<SelectionType>('single');
  readonly groupRowsBy = signal<string | undefined>(undefined);
  readonly groupExpansionDefault = signal(false);
  readonly disableRowCheck = signal<((row: Record<string, string>) => boolean) | undefined>(
    undefined
  );
  readonly activate = signal<ActivateEvent<Record<string, string>> | undefined>(undefined);
}

describe('keyboard navigation', () => {
  let fixture: ComponentFixture<KeyboardNavigationTestComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(KeyboardNavigationTestComponent);
    await fixture.whenStable();
  });

  it('moves row focus down and up without changing selection', async () => {
    const adaRow = page.getByRole('row', { name: 'Ada London' }).element();
    const graceRow = page.getByRole('row', { name: 'Grace New York' }).element();
    adaRow.focus();

    await userEvent.keyboard('{ArrowDown}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(graceRow);
    expect(adaRow.classList).not.toContain('active');
    expect(graceRow.classList).not.toContain('active');

    await userEvent.keyboard('{ArrowUp}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(adaRow);
    expect(adaRow.classList).not.toContain('active');
  });

  it('keeps row focus at the first and last row boundaries', async () => {
    const adaRow = page.getByRole('row', { name: 'Ada London' }).element();
    const linusRow = page.getByRole('row', { name: 'Linus Helsinki' }).element();

    adaRow.focus();
    await userEvent.keyboard('{ArrowUp}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(adaRow);

    linusRow.focus();
    await userEvent.keyboard('{ArrowDown}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(linusRow);
  });

  it('does not move row focus horizontally or from a disabled row', async () => {
    fixture.componentInstance.disableRowCheck.set(row => row.name === 'Grace');
    await fixture.whenStable();
    const adaRow = page.getByRole('row', { name: 'Ada London' }).element();
    const graceRow = page.getByRole('row', { name: 'Grace New York' }).element();

    adaRow.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(adaRow);

    await userEvent.keyboard('{ArrowRight}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(adaRow);

    graceRow.focus();
    await userEvent.keyboard('{ArrowDown}');
    await fixture.whenStable();
    expect(graceRow.classList).toContain('row-disabled');
    expect(document.activeElement).toBe(graceRow);
  });

  it('moves row focus between grouped rows in rendered order', async () => {
    fixture.componentInstance.rows.set([
      { name: 'Ada', city: 'London' },
      { name: 'Grace', city: 'London' },
      { name: 'Linus', city: 'Helsinki' },
      { name: 'Margaret', city: 'Helsinki' }
    ]);
    fixture.componentInstance.groupRowsBy.set('city');
    fixture.componentInstance.groupExpansionDefault.set(true);
    await fixture.whenStable();

    const graceRow = page.getByRole('row', { name: 'Grace London' }).element();
    const linusRow = page.getByRole('row', { name: 'Linus Helsinki' }).element();
    graceRow.focus();

    await userEvent.keyboard('{ArrowDown}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(linusRow);

    await userEvent.keyboard('{ArrowUp}');
    await fixture.whenStable();
    expect(document.activeElement).toBe(graceRow);
  });

  it('selects the focused row with Enter', async () => {
    const graceRow = page.getByRole('row', { name: 'Grace New York' }).element();
    graceRow.focus();

    await userEvent.keyboard('{Enter}');
    await fixture.whenStable();

    expect(graceRow.classList).toContain('active');
  });

  describe('cell selection', () => {
    beforeEach(async () => {
      fixture.componentInstance.selectionType.set('cell');
      await fixture.whenStable();
    });

    it('moves focus left and right between cells without selecting a row', async () => {
      const adaRow = page.getByRole('row', { name: 'Ada London' });
      const nameCell = adaRow.getByRole('cell', { name: 'Ada' }).element();
      const cityCell = adaRow.getByRole('cell', { name: 'London' }).element();
      nameCell.focus();

      await userEvent.keyboard('{ArrowRight}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(cityCell);

      await userEvent.keyboard('{ArrowLeft}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(nameCell);
      expect(adaRow.element().classList).not.toContain('active');
    });

    it('moves focus vertically while retaining the column', async () => {
      const graceCityCell = page
        .getByRole('row', { name: 'Grace New York' })
        .getByRole('cell', { name: 'New York' })
        .element();
      const linusCityCell = page
        .getByRole('row', { name: 'Linus Helsinki' })
        .getByRole('cell', { name: 'Helsinki' })
        .element();
      graceCityCell.focus();

      await userEvent.keyboard('{ArrowDown}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(linusCityCell);

      await userEvent.keyboard('{ArrowUp}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(graceCityCell);
    });

    it('uses pinned render order for focus and original column order for activation', async () => {
      fixture.componentInstance.columns.set([
        { name: 'City', prop: 'city' },
        { name: 'Name', prop: 'name', frozenLeft: true }
      ]);
      await fixture.whenStable();
      const adaNameCell = page
        .getByRole('row', { name: 'Ada London' })
        .getByRole('cell', { name: 'Ada' })
        .element();
      const graceNameCell = page
        .getByRole('row', { name: 'Grace New York' })
        .getByRole('cell', { name: 'Grace' })
        .element();
      adaNameCell.focus();

      await userEvent.keyboard('{ArrowDown}');
      await fixture.whenStable();

      expect(document.activeElement).toBe(graceNameCell);

      await userEvent.keyboard('{Enter}');
      await fixture.whenStable();

      expect(fixture.componentInstance.activate()?.cellIndex).toBe(1);
    });

    it('keeps cell focus at horizontal and vertical boundaries', async () => {
      const adaNameCell = page
        .getByRole('row', { name: 'Ada London' })
        .getByRole('cell', { name: 'Ada' })
        .element();
      const linusCityCell = page
        .getByRole('row', { name: 'Linus Helsinki' })
        .getByRole('cell', { name: 'Helsinki' })
        .element();

      adaNameCell.focus();
      await userEvent.keyboard('{ArrowLeft}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(adaNameCell);

      await userEvent.keyboard('{ArrowUp}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(adaNameCell);

      linusCityCell.focus();
      await userEvent.keyboard('{ArrowRight}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(linusCityCell);

      await userEvent.keyboard('{ArrowDown}');
      await fixture.whenStable();
      expect(document.activeElement).toBe(linusCityCell);
    });
  });

  describe('with virtual scrolling', () => {
    @Component({
      imports: [DatatableComponent],
      template: `
        <ngx-datatable
          [columns]="columns"
          [rows]="rows()"
          [rowHeight]="40"
          [scrollbarV]="true"
          [virtualization]="true"
          [selectionType]="selectionType()"
          [style.block-size.px]="200"
        />
      `,
      host: {
        '[style.inline-size.px]': '400'
      }
    })
    class VirtualScrollKeyboardNavigationTestComponent {
      readonly columns: TableColumn[] = [
        { name: 'Name', prop: 'name' },
        { name: 'City', prop: 'city' }
      ];
      readonly rows = signal(
        Array.from({ length: 50 }, (_, index) => ({
          name: `Row ${index + 1}`,
          city: `City ${index + 1}`
        }))
      );
      readonly selectionType = signal<SelectionType>('single');
    }

    let virtualFixture: ComponentFixture<VirtualScrollKeyboardNavigationTestComponent>;

    beforeEach(async () => {
      virtualFixture = TestBed.createComponent(VirtualScrollKeyboardNavigationTestComponent);
      await virtualFixture.whenStable();
    });

    it('scrolls down and focuses the next row outside the rendered range', async () => {
      const table = page.getByRole('table').element();
      table.scrollTop = 800;
      table.dispatchEvent(new Event('scroll'));
      await virtualFixture.whenStable();
      const lastRenderedRow = page.getByRole('row', { name: 'Row 25 City 25' }).element();
      const nextRow = page.getByRole('row', { name: 'Row 26 City 26' });

      await expect.element(nextRow).not.toBeInTheDocument();

      lastRenderedRow.focus();
      await userEvent.keyboard('{ArrowDown}');
      await virtualFixture.whenStable();

      expect(table.scrollTop).toBeGreaterThan(800);
      expect(document.activeElement).toBe(nextRow.element());
    });

    it('scrolls up and focuses the previous row outside the rendered range', async () => {
      const table = page.getByRole('table').element();
      table.scrollTop = 800;
      table.dispatchEvent(new Event('scroll'));
      await virtualFixture.whenStable();
      const firstRenderedRow = page.getByRole('row', { name: 'Row 21 City 21' }).element();
      const previousRow = page.getByRole('row', { name: 'Row 20 City 20' });

      await expect.element(previousRow).not.toBeInTheDocument();

      firstRenderedRow.focus();
      await userEvent.keyboard('{ArrowUp}');
      await virtualFixture.whenStable();

      expect(table.scrollTop).toBeLessThan(800);
      expect(document.activeElement).toBe(previousRow.element());
    });

    it('retains the focused column when moving outside the rendered range', async () => {
      virtualFixture.componentInstance.selectionType.set('cell');
      await virtualFixture.whenStable();
      const table = page.getByRole('table').element();
      table.scrollTop = 800;
      table.dispatchEvent(new Event('scroll'));
      await virtualFixture.whenStable();

      const cityCell = page
        .getByRole('row', { name: 'Row 25 City 25' })
        .getByRole('cell', { name: 'City 25' })
        .element();
      const nextCityCell = page
        .getByRole('row', { name: 'Row 26 City 26' })
        .getByRole('cell', { name: 'City 26' });
      cityCell.focus();

      await userEvent.keyboard('{ArrowDown}');
      await virtualFixture.whenStable();

      expect(document.activeElement).toBe(nextCityCell.element());
    });

    it('waits for an unloaded row before continuing virtual navigation', async () => {
      const rows = virtualFixture.componentInstance.rows();
      const partiallyLoadedRows = rows.slice(0, 25);
      partiallyLoadedRows.length = rows.length;
      virtualFixture.componentInstance.rows.set(partiallyLoadedRows);
      await virtualFixture.whenStable();

      const table = page.getByRole('table').element();
      table.scrollTop = 800;
      table.dispatchEvent(new Event('scroll'));
      await virtualFixture.whenStable();

      const lastLoadedRow = page.getByRole('row', { name: 'Row 25 City 25' }).element();
      lastLoadedRow.focus();
      await userEvent.keyboard('{ArrowDown}{ArrowDown}');
      await virtualFixture.whenStable();

      expect(document.activeElement).toBe(lastLoadedRow);
      expect(table.scrollTop).toBeLessThan(900);

      virtualFixture.componentInstance.rows.set(rows);
      await virtualFixture.whenStable();

      expect(document.activeElement).toBe(
        page.getByRole('row', { name: 'Row 26 City 26' }).element()
      );
    });
  });
});
