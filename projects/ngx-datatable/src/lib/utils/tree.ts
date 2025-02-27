import { getterForProp } from './column-prop-getters';
import { TableColumnProp } from '../types/table-column.type';
import { TreeStatus } from '../types/public.types';

export type OptionalValueGetter = (row: any) => any | undefined;
export function optionalGetterForProp(prop: TableColumnProp): OptionalValueGetter {
  return prop && (row => getterForProp(prop)(row, prop));
}

/**
 * This functions rearrange items by their parents
 * Also sets the level value to each of the items
 *
 * Note: Expecting each item has a property called parentId
 * Note: This algorithm will fail if a list has two or more items with same ID
 * NOTE: This algorithm will fail if there is a deadlock of relationship
 *
 * For example,
 *
 * Input
 *
 * id -> parent
 * 1  -> 0
 * 2  -> 0
 * 3  -> 1
 * 4  -> 1
 * 5  -> 2
 * 7  -> 8
 * 6  -> 3
 *
 *
 * Output
 * id -> level
 * 1      -> 0
 * --3    -> 1
 * ----6  -> 2
 * --4    -> 1
 * 2      -> 0
 * --5    -> 1
 * 7     -> 8
 *
 *
 * @param rows
 *
 */
export function groupRowsByParents<TRow>(
  rows: TRow[],
  from?: OptionalValueGetter,
  to?: OptionalValueGetter,
  statusIndex = 'treeStatus'
): TRow[] {
  if (from && to) {
    const nodeById = {};
    const l = rows.length;
    let node: TreeNode | null = null;

    nodeById[0] = new TreeNode(null, statusIndex); // that's the root node

    const uniqIDs = rows.reduce((arr, item) => {
      const toValue = to(item);
      if (arr.indexOf(toValue) === -1) {
        arr.push(toValue);
      }
      return arr;
    }, []);

    for (let i = 0; i < l; i++) {
      // make TreeNode objects for each item
      nodeById[to(rows[i])] = new TreeNode(rows[i], statusIndex);
    }

    for (let i = 0; i < l; i++) {
      // link all TreeNode objects
      node = nodeById[to(rows[i])];
      let parent = 0;
      const fromValue = from(node.row);
      if (!!fromValue && uniqIDs.indexOf(fromValue) > -1) {
        parent = fromValue;
      }
      node.parent = nodeById[parent];
      node.row.level = node.parent.row.level + 1;
      node.parent.children.push(node);
    }

    let resolvedRows: any[] = [];
    nodeById[0].flatten(function () {
      resolvedRows = [...resolvedRows, this.row];
    }, true);

    return resolvedRows;
  } else {
    return rows;
  }
}

export const getByNestedIndex = (obj: any, index: string) => {
  console.log(obj);
  let prop: any = obj;
  index.split('.').forEach(indexPart => {
    if (prop !== undefined) {
      prop = prop[indexPart];
    }
  });
  console.log(prop);
  return prop;
};

export const createWithNestedIndex = (index: string, val: any) => {
  const rootProp: any = {};
  let prop: any = rootProp;
  const splitIndex = index.split('.');
  splitIndex.forEach((indexPart, i) => {
    if (i === splitIndex.length - 1) {
      prop[indexPart] = val;
      return;
    }
    if (prop[indexPart] === undefined) {
      prop[indexPart] = {};
    }
    prop = prop[indexPart];
  });
  return rootProp;
};

class TreeNode {
  public row: any;
  public parent: any;
  public children: any[];
  private statusIndex: string;

  constructor(row: any | null = null, statusIndex = 'treeStatus') {
    if (!row) {
      row = {
        level: -1,
        ...createWithNestedIndex(statusIndex, 'expanded')
      };
    }
    this.row = row;
    this.parent = null;
    this.children = [];
    this.statusIndex = statusIndex;
  }

  get treeStatus(): TreeStatus {
    return getByNestedIndex(this.row, this.statusIndex);
  }

  flatten(f: any, recursive: boolean) {
    if (this.treeStatus === 'expanded') {
      for (let i = 0, l = this.children.length; i < l; i++) {
        const child = this.children[i];
        f.apply(child, Array.prototype.slice.call(arguments, 2));
        if (recursive) {
          child.flatten.apply(child, arguments);
        }
      }
    }
  }
}
