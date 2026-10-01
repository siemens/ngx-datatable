import { untracked } from '@angular/core';

import { TableColumnInternal } from '../types/internal.types';
import { columnsByPinArr, gridColumnTemplate } from './column';
import { ColumnLayoutContext, ColumnModeStrategy } from './column-mode-strategy';

export class ForceColumnModeStrategy implements ColumnModeStrategy {
  gridColumnTemplate(columns: TableColumnInternal[]): string {
    return gridColumnTemplate(columnsByPinArr(columns));
  }

  /**
   * Distributes available space among columns to the right of a resized column,
   * overflowing when necessary and respecting minimum and maximum widths.
   */
  recalculate(context: ColumnLayoutContext): void {
    untracked(() => this.distribute(context));
  }

  private distribute({
    columns,
    width,
    forceIdx,
    allowBleed,
    defaultColumnWidth,
    verticalScrollWidth
  }: ColumnLayoutContext): void {
    const columnsToResize = columns
      .slice(forceIdx + 1, columns.length)
      .filter(c => c.canAutoResize !== false);

    let additionWidthPerColumn: number;
    let exceedsWindow: boolean;
    let contentWidth = this.getContentWidth(columns, defaultColumnWidth);
    let remainingWidth = width - contentWidth;
    const initialRemainingWidth = remainingWidth;
    const columnsProcessed: TableColumnInternal[] = [];
    const remainingWidthLimit = 1; // Stop when less than one pixel remains.

    do {
      additionWidthPerColumn = remainingWidth / columnsToResize.length;
      exceedsWindow = contentWidth >= width;

      for (const column of columnsToResize) {
        // Do not bleed when the initial difference equals the vertical scrollbar width.
        if (exceedsWindow && allowBleed && initialRemainingWidth !== -1 * verticalScrollWidth) {
          column.width.update(value => value || defaultColumnWidth);
        } else {
          const newSize = (column.width() || defaultColumnWidth) + additionWidthPerColumn;

          if (column.minWidth && newSize < column.minWidth) {
            column.width.set(column.minWidth);
            columnsProcessed.push(column);
          } else if (column.maxWidth && newSize > column.maxWidth) {
            column.width.set(column.maxWidth);
            columnsProcessed.push(column);
          } else {
            column.width.set(newSize);
          }
        }

        column.width.update(value => Math.max(0, value));
      }

      contentWidth = this.getContentWidth(columns, defaultColumnWidth);
      remainingWidth = width - contentWidth;
      this.removeProcessedColumns(columnsToResize, columnsProcessed);
    } while (remainingWidth > remainingWidthLimit && columnsToResize.length !== 0);
  }

  private removeProcessedColumns(
    columnsToResize: TableColumnInternal[],
    columnsProcessed: TableColumnInternal[]
  ): void {
    for (const column of columnsProcessed) {
      const index = columnsToResize.indexOf(column);
      columnsToResize.splice(index, 1);
    }
  }

  private getContentWidth(columns: TableColumnInternal[], defaultColumnWidth: number): number {
    let contentWidth = 0;

    for (const column of columns) {
      contentWidth += column.width() || defaultColumnWidth;
    }

    return contentWidth;
  }
}
