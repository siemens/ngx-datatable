import { TableColumn } from './table-column.type';

export type PinDirection = 'left' | 'center' | 'right';

export interface PinnedColumns {
  type: PinDirection;
  columns: TableColumn[];
}

export interface ColumnGroupWidth {
  left: number;
  center: number;
  right: number;
  total: number;
}

export interface OrderableReorderEvent {
  prevIndex: number;
  newIndex: number;
  model: TableColumn;
}

export interface TargetChangedEvent {
  newIndex?: number;
  prevIndex: number;
  initialIndex: number;
}

export interface Page {
  number: number;
  text: string;
}

export interface DraggableDragEvent {
  event: MouseEvent;
  element: HTMLElement;
  model: TableColumn;
}

/** Represents the index of a row. */
export interface RowIndex {
  /** Index of the row. If the row is inside a group, it will hold the index the group. */
  index: number;
  /** Index of a row inside a group. Only present if the row is inside a group. */
  indexInGroup?: number;
}
