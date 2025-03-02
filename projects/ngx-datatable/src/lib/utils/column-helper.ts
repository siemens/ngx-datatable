import { camelCase, deCamelCase } from './camel-case';
import { id } from './id';
import { getterForProp } from './column-prop-getters';
import { TableColumn } from '../types/table-column.type';

/**
 * Sets the column defaults
 */
export function setColumnDefaults(columns: TableColumn[], defaultColumnWidth = 150) {
  if (!columns) {
    return;
  }

  // Only one column should hold the tree view
  // Thus if multiple columns are provided with
  // isTreeColumn as true we take only the first one
  let treeColumnFound = false;

  for (const column of columns) {
    if (!column.$$id) {
      column.$$id = id();
    }

    // prop can be numeric; zero is valid not a missing prop
    // translate name => prop
    if (isNullOrUndefined(column.prop) && column.name) {
      column.prop = camelCase(column.name);
    }

    if (!column.$$valueGetter) {
      column.$$valueGetter = getterForProp(column.prop);
    }

    // format props if no name passed
    if (!isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = deCamelCase(String(column.prop));
    }

    if (isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = ''; // Fixes IE and Edge displaying `null`
    }

    if (!Object.hasOwn(column, 'resizeable')) {
      column.resizeable = true;
    }

    if (!Object.hasOwn(column, 'sortable')) {
      column.sortable = true;
    }

    if (!Object.hasOwn(column, 'draggable')) {
      column.draggable = true;
    }

    if (!Object.hasOwn(column, 'canAutoResize')) {
      column.canAutoResize = true;
    }

    if (!Object.hasOwn(column, 'width')) {
      column.width = defaultColumnWidth;
    }

    if (!Object.hasOwn(column, 'isTreeColumn')) {
      column.isTreeColumn = false;
    } else {
      if (column.isTreeColumn && !treeColumnFound) {
        // If the first column with isTreeColumn is true found
        // we mark that treeColumn is found
        treeColumnFound = true;
      } else {
        // After that isTreeColumn property for any other column
        // will be set as false
        column.isTreeColumn = false;
      }
    }
  }
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}
