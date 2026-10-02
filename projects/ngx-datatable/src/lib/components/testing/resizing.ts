import { inputBinding, outputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import { ColumnMode, ColumnResizeEvent } from '../../types/public.types';
import { TableColumn } from '../../types/table-column.type';
import { DatatableComponent } from '../datatable.component';

interface ResizeOptions {
  width?: number;
  scrollbarH?: boolean;
  scrollbarV?: boolean;
}

/** Full-table fixture shared by the strategy integration specs. */
export class ResizingTable {
  readonly columns = signal<TableColumn[]>([]);
  readonly rows = signal(makeRows(2));
  readonly scrollbarH = signal(false);
  readonly resize = vi.fn<(event: ColumnResizeEvent) => void>();
  readonly sort = vi.fn();
  readonly reorder = vi.fn();
  readonly grid = page.getByRole('table');
  readonly fixture: ComponentFixture<DatatableComponent>;
  readonly host: HTMLElement;

  private constructor(mode: ColumnMode, initialColumns: TableColumn[], options: ResizeOptions) {
    this.columns.set(initialColumns.map(column => ({ name: String(column.prop), ...column })));
    this.scrollbarH.set(options.scrollbarH ?? false);
    this.fixture = TestBed.createComponent(DatatableComponent, {
      bindings: [
        inputBinding('columns', this.columns),
        inputBinding('rows', this.rows),
        inputBinding('columnMode', () => mode),
        inputBinding('scrollbarH', this.scrollbarH),
        inputBinding('scrollbarV', () => options.scrollbarV ?? false),
        inputBinding('virtualization', () => false),
        inputBinding('rowHeight', () => 30),
        inputBinding('headerHeight', () => 30),
        inputBinding('hideFooter', () => true),
        inputBinding('reorderable', () => true),
        outputBinding('resize', this.resize),
        outputBinding('sortsChange', this.sort),
        outputBinding('reorder', this.reorder)
      ]
    });
    this.host = this.fixture.nativeElement as HTMLElement;
    this.host.style.width = `${options.width ?? 400}px`;
    this.host.style.height = '180px';
  }

  static async create(mode: ColumnMode, columns: TableColumn[], options: ResizeOptions = {}) {
    const table = new ResizingTable(mode, columns, options);
    await table.fixture.whenStable();
    await expect
      .poll(() => table.fixture.componentInstance.tableWidth())
      .toBe(options.width ?? 400);
    return table;
  }

  header(prop: string) {
    return page.getByRole('columnheader', { name: prop, exact: true });
  }

  cell(prop: string) {
    return page.getByRole('cell', { name: `${prop} 1`, exact: true });
  }

  handle(prop: string) {
    return this.header(prop).element().querySelector<HTMLElement>('.resize-handle');
  }

  async widths(expected: Record<string, number>) {
    for (const [prop, width] of Object.entries(expected)) {
      await expect.element(this.header(prop)).toBeInTheDocument();
      await expect.element(this.cell(prop)).toBeInTheDocument();
      // CSS grid tracks can be fractional; compare actual rendered geometry with
      // a subpixel tolerance, not rounded offsetWidth or internal width signals.
      await expect
        .poll(() => Math.abs(this.header(prop).element().getBoundingClientRect().width - width))
        .toBeLessThan(0.6);
      await expect
        .poll(() => Math.abs(this.cell(prop).element().getBoundingClientRect().width - width))
        .toBeLessThan(0.6);
      await expect
        .poll(() =>
          Math.abs(
            this.header(prop).element().getBoundingClientRect().left -
              this.cell(prop).element().getBoundingClientRect().left
          )
        )
        .toBeLessThan(0.6);
    }
  }

  async setWidth(width: number) {
    this.host.style.width = `${width}px`;
    await expect.poll(() => this.fixture.componentInstance.tableWidth()).toBe(width);
    await this.fixture.whenStable();
  }

  async drag(prop: string, delta: number) {
    // Resize handles become visible only while their header is hovered.
    // eslint-disable-next-line @angular-eslint/no-experimental
    await userEvent.hover(this.header(prop));
    await expect.element(this.handle(prop)).toBeVisible();
    const source = this.handle(prop)!.getBoundingClientRect();
    const target = this.grid.element().getBoundingClientRect();
    // userEvent uses the browser provider's real mouse input, including pointer
    // capture and bubbling through the draggable/header/datatable components.
    // eslint-disable-next-line @angular-eslint/no-experimental
    await userEvent.dragAndDrop(this.handle(prop)!, this.grid, {
      sourcePosition: { x: source.width / 2, y: source.height / 2 },
      targetPosition: {
        x: source.left + source.width / 2 + delta - target.left,
        y: source.top + source.height / 2 - target.top
      }
    });
    await this.fixture.whenStable();
  }

  async start(prop: string, pointerType = 'mouse') {
    const element = this.handle(prop)!;
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const pointerId = 41;
    // userEvent has no separate pointer-down/move/up API. For intermediate
    // states and touch/cancel cases dispatch DOM PointerEvents. Only capture is
    // stubbed: synthetic pointer IDs are not registered by the browser.
    const capture = vi.spyOn(element, 'setPointerCapture').mockImplementation(() => {});
    element.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId,
        pointerType,
        clientX: x,
        clientY: y,
        buttons: 1
      })
    );
    await expect.element(this.handle(prop)).toHaveClass('dragging');

    const send = async (type: string, delta: number, id = pointerId) => {
      document.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: id,
          pointerType,
          clientX: x + delta,
          clientY: y,
          buttons: type === 'pointermove' ? 1 : 0
        })
      );
      await this.fixture.whenStable();
    };

    return {
      move: (delta: number, id?: number) => send('pointermove', delta, id),
      end: async (delta = 0, cancel = false) => {
        await send(cancel ? 'pointercancel' : 'pointerup', delta);
        capture.mockRestore();
      }
    };
  }
}

const makeRows = (count: number) => {
  return Array.from({ length: count }, (_, index) =>
    Object.fromEntries(['A', 'B', 'C', 'D', 'E'].map(prop => [prop, `${prop} ${index + 1}`]))
  );
};

export const resizeRows = (count: number) => makeRows(count);

export const equalColumns = () => ['A', 'B', 'C', 'D'].map(prop => ({ prop, width: 100 }));
