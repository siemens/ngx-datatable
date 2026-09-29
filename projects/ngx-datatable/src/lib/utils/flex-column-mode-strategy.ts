import { untracked } from '@angular/core';

import { TableColumnGroup, TableColumnInternal } from '../types/internal.types';
import { TableColumnProp } from '../types/table-column.type';
import { columnsByPin, columnTotalWidth } from './column';
import { ColumnLayoutContext, ColumnModeStrategy } from './column-mode-strategy';

export class FlexColumnModeStrategy implements ColumnModeStrategy {
  /** Adjusts widths according to flexGrow while respecting manually resized columns. */
  recalculate(context: ColumnLayoutContext): void {
    // Width signals are both read and written by the distribution algorithm.
    untracked(() => this.distribute(context));
  }

  private distribute({ columns, width }: ColumnLayoutContext): void {
    const columnsWidth = columnTotalWidth(columns);
    const totalFlexGrow = columns.reduce((total, column) => total + (column.flexGrow ?? 0), 0);
    const colsByGroup = columnsByPin(columns);

    if (columnsWidth !== width) {
      this.scaleColumns(colsByGroup, width, totalFlexGrow);
    }
  }

  private scaleColumns(
    colsByGroup: TableColumnGroup,
    maxWidth: number,
    totalFlexGrow: number
  ): void {
    const columns: TableColumnInternal[] = Object.values(colsByGroup).flat();
    let remainingWidth = maxWidth;

    // Calculate the available width and flexGrow points for resizable columns.
    for (const column of columns) {
      if (column.$$oldWidth) {
        // Stop auto-resizing manually resized columns.
        column.canAutoResize = false;
      }
      if (!column.canAutoResize) {
        remainingWidth -= column.width();
        totalFlexGrow -= column.flexGrow ?? 0;
      } else {
        column.width.set(0);
      }
    }

    const hasMinWidth: Record<TableColumnProp, boolean> = {};

    // Distribute width until no space remains.
    do {
      const widthPerFlexPoint = remainingWidth / totalFlexGrow;
      remainingWidth = 0;

      for (const column of columns) {
        // Resize eligible columns that have not reached their minimum width.
        if (column.canAutoResize && !hasMinWidth[column.prop]) {
          const newWidth = column.width() + (column.flexGrow ?? 0) * widthPerFlexPoint;
          if (column.minWidth !== undefined && newWidth < column.minWidth) {
            remainingWidth += newWidth - column.minWidth;
            column.width.set(column.minWidth);
            hasMinWidth[column.prop] = true;
          } else {
            column.width.set(newWidth);
          }
        }
      }
    } while (remainingWidth !== 0);

    // Adjust for any remaining difference between the computed widths and maxWidth.
    const totalWidthAchieved = columns.reduce((acc, col) => acc + col.width(), 0);
    const delta = maxWidth - totalWidthAchieved;

    if (delta === 0) {
      return;
    }

    // Adjust the first auto-resizable column that can accommodate the difference.
    for (const col of columns.filter(c => c.canAutoResize).sort((a, b) => a.width() - b.width())) {
      if (
        (delta > 0 && (!col.maxWidth || col.width() + delta <= col.maxWidth)) ||
        (delta < 0 && (!col.minWidth || col.width() + delta >= col.minWidth))
      ) {
        col.width.update(value => value + delta);
        break;
      }
    }
  }
}
