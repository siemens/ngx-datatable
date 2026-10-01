import { TableColumnInternal } from '../types/internal.types';
import { ColumnMode } from '../types/public.types';
import { columnsByPinArr, gridColumnTemplate } from './column';
import { FlexColumnModeStrategy } from './flex-column-mode-strategy';
import { ForceColumnModeStrategy } from './force-column-mode-strategy';

export interface ColumnLayoutContext {
  columns: TableColumnInternal[];
  width: number;
  forceIdx: number;
  allowBleed: boolean;
  defaultColumnWidth: number;
  verticalScrollWidth: number;
}

export interface ColumnModeStrategy {
  recalculate(context: ColumnLayoutContext): void;
  gridColumnTemplate(columns: TableColumnInternal[]): string;
}

export class StandardColumnModeStrategy implements ColumnModeStrategy {
  recalculate(_context: ColumnLayoutContext): void {}

  gridColumnTemplate(columns: TableColumnInternal[]): string {
    return gridColumnTemplate(columnsByPinArr(columns));
  }
}

export const columnModeStrategyFactories: Record<ColumnMode, () => ColumnModeStrategy> = {
  standard: () => new StandardColumnModeStrategy(),
  flex: () => new FlexColumnModeStrategy(),
  force: () => new ForceColumnModeStrategy()
};
