import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  numberAttribute,
  input
} from '@angular/core';

import { TableColumnInternal } from '../../../types/internal.types';

@Component({
  selector: 'ghost-loader',
  templateUrl: './ghost-loader.component.html',
  styleUrl: './ghost-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class DataTableGhostLoaderComponent {
  readonly columns = input.required<TableColumnInternal[]>();
  readonly pageSize = input.required<number, unknown>({ transform: numberAttribute });
  readonly rowHeight = input.required<number | 'auto' | ((row?: any) => number)>();
  readonly ghostBodyHeight = input<string>();
  readonly cellMode = input(false, { transform: booleanAttribute });

  protected readonly rowHeightComputed = () => {
    const rowHeight = this.rowHeight();
    if (typeof rowHeight === 'function') {
      return rowHeight() + 'px';
    }
    return rowHeight === 'auto' ? 'auto' : rowHeight + 'px';
  };
}
