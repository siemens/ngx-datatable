import { computed, signal } from '@angular/core';

import { TableColumnInternal } from '../types/internal.types';
import { SortDirection, SortPropDir } from '../types/public.types';
import { sortRows, orderByComparator } from './sort';

describe('sortRows', () => {
  const mockRows = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 }
  ];

  const mockColumns: TableColumnInternal[] = [
    {
      prop: 'name',
      name: 'Name',
      sortable: true,
      comparator: orderByComparator,
      $$id: '1',
      $$valueGetter: () => {},
      resizeable: true,
      draggable: true,
      canAutoResize: true,
      width: 150,
      isTreeColumn: false
    },
    {
      prop: 'age',
      name: 'Age',
      sortable: true,
      comparator: orderByComparator,
      $$id: '2',
      $$valueGetter: () => {},
      resizeable: true,
      draggable: true,
      canAutoResize: true,
      width: 150,
      isTreeColumn: false
    }
  ];

  it('should sort rows by name ascending', () => {
    const dirs: SortPropDir[] = [{ prop: 'name', dir: SortDirection.asc }];
    const result = sortRows(mockRows, mockColumns, dirs);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Charlie');
  });

  it('should sort rows by age descending', () => {
    const dirs: SortPropDir[] = [{ prop: 'age', dir: SortDirection.desc }];
    const result = sortRows(mockRows, mockColumns, dirs);
    expect(result[0].age).toBe(35);
    expect(result[1].age).toBe(30);
    expect(result[2].age).toBe(25);
  });

  it('should handle undefined comparator gracefully with fallback', () => {
    const columnsWithUndefinedComparator: TableColumnInternal[] = [
      {
        ...mockColumns[0],
        comparator: undefined as any // Simulate undefined comparator
      }
    ];
    const dirs: SortPropDir[] = [{ prop: 'name', dir: SortDirection.asc }];
    const result = sortRows(mockRows, columnsWithUndefinedComparator, dirs);
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Charlie');
  });

  it('should handle reactive sorting with computed signals (Angular 20 scenario)', () => {
    // Simulate Angular 20 reactive context with signals
    const rowsSignal = signal(mockRows);
    const sortDirsSignal = signal<SortPropDir[]>([{ prop: 'name', dir: SortDirection.asc }]);

    // Create columns that might have undefined comparators during reactive updates
    const columnsSignal = signal<TableColumnInternal[]>([
      {
        prop: 'name',
        name: 'Name',
        sortable: true,
        comparator: orderByComparator,
        $$id: '1',
        $$valueGetter: () => {},
        resizeable: true,
        draggable: true,
        canAutoResize: true,
        width: 150,
        isTreeColumn: false
      }
    ]);

    // Simulate computed sorting like in datatable component
    const sortedRows = computed(() => {
      const rows = rowsSignal();
      const dirs = sortDirsSignal();
      const cols = columnsSignal();

      // This simulates what happens in _internalRows computed signal
      if (dirs.length && cols.length) {
        return sortRows(rows, cols, dirs);
      }
      return rows;
    });

    // Initial sort should work
    let result = sortedRows();
    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Charlie');

    // Simulate data update (like adding an item)
    rowsSignal.update(rows => [...rows, { id: 4, name: 'David', age: 28 }]);
    result = sortedRows();
    expect(result.length).toBe(4);
    expect(result[0].name).toBe('Alice'); // Should still be sorted

    // Simulate column comparator becoming undefined (Angular 20 reactive issue)
    columnsSignal.update(cols => [
      {
        ...cols[0],
        comparator: undefined as any // Simulate reactive context losing reference
      }
    ]);

    // Should not throw error and should still sort using fallback
    result = sortedRows();
    expect(result.length).toBe(4);
    expect(result[0].name).toBe('Alice'); // Should still sort correctly with fallback
    expect(result[3].name).toBe('David');
  });
});