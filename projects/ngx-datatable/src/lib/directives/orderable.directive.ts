import { DOCUMENT } from '@angular/common';
import {
  computed,
  contentChildren,
  Directive,
  effect,
  inject,
  KeyValueChangeRecord,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  output,
  OutputRefSubscription
} from '@angular/core';

import {
  DraggableDragEvent,
  ReorderEventInternal,
  TableColumnInternal,
  TargetChangedEvent
} from '../types/internal.types';
import { getPositionFromEvent } from '../utils/events';
import { DraggableDirective } from './draggable.directive';

interface OrderPosition {
  left: number;
  right: number;
  index: number;
  element: HTMLElement;
}

@Directive({
  selector: '[orderable]'
})
export class OrderableDirective implements OnDestroy {
  private document = inject(DOCUMENT);

  readonly reorder = output<ReorderEventInternal>();
  readonly targetChanged = output<TargetChangedEvent>();

  readonly draggables = contentChildren<DraggableDirective>(DraggableDirective, {
    descendants: true
  });

  readonly diffMap = computed(() => {
    return this.draggables().reduce(
      (acc, curr) => {
        acc[curr.dragModel().$$id] = curr;
        return acc;
      },
      {} as Record<string, DraggableDirective>
    );
  });

  readonly subscriptions = new Map<string, OutputRefSubscription[]>();

  positions?: Record<string, OrderPosition>;
  readonly differ: KeyValueDiffer<string, DraggableDirective> = inject(KeyValueDiffers)
    .find({})
    .create();
  lastDraggingIndex?: number;

  constructor() {
    effect(() => {
      this.updateSubscriptions(this.diffMap());
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subList => subList.forEach(sub => sub.unsubscribe()));
  }

  updateSubscriptions(diffMap: Record<string, DraggableDirective>): void {
    const differResult = this.differ.diff(diffMap);
    if (!differResult) {
      return;
    }
    differResult.forEachAddedItem(this.subscribeToDraggable);
    differResult.forEachRemovedItem(this.unsubscribeFromDraggable);
  }

  private subscribeToDraggable = (
    record: KeyValueChangeRecord<string, DraggableDirective>
  ): void => {
    this.unsubscribeFromDraggable(record);
    const { key, currentValue } = record;
    if (!currentValue) {
      return;
    }
    const subs = this.subscriptions.get(key) || [];
    subs.push(
      currentValue.dragStart.subscribe(() => this.onDragStart()),
      currentValue.dragging.subscribe(e => this.onDragging(e)),
      currentValue.dragEnd.subscribe(e => this.onDragEnd(e))
    );
    this.subscriptions.set(key, subs);
  };

  private unsubscribeFromDraggable = (
    record: KeyValueChangeRecord<string, DraggableDirective>
  ): void => {
    const { key, previousValue } = record;
    if (!previousValue) {
      return;
    }
    const subs = this.subscriptions.get(key);
    if (!subs) {
      return;
    }
    subs.forEach(sub => sub.unsubscribe());
    this.subscriptions.delete(key);
  };

  onDragStart(): void {
    const positions: Record<string, OrderPosition> = {};
    this.draggables().forEach((draggable, idx) => {
      const elm = draggable.element;
      const left = parseInt(elm.offsetLeft.toString(), 10);
      positions[draggable.dragModel().$$id] = {
        left,
        right: left + parseInt(elm.offsetWidth.toString(), 10),
        index: idx,
        element: elm
      };
    });
    this.positions = positions;
  }

  onDragging({ model, event }: DraggableDragEvent): void {
    if (!this.positions) {
      return;
    }
    const prevPos = this.positions[model.$$id];
    const target = this.isTarget(model, event);
    if (target) {
      if (this.lastDraggingIndex !== target.index) {
        this.targetChanged.emit({
          prevIndex: this.lastDraggingIndex!,
          newIndex: target.index,
          initialIndex: prevPos.index
        });
        this.lastDraggingIndex = target.index;
      }
    } else if (this.lastDraggingIndex !== prevPos.index) {
      this.targetChanged.emit({
        prevIndex: this.lastDraggingIndex!,
        initialIndex: prevPos.index
      });
      this.lastDraggingIndex = prevPos.index;
    }
  }

  onDragEnd({ element, model, event }: DraggableDragEvent): void {
    if (!this.positions) {
      return;
    }
    const prevPos = this.positions[model.$$id];
    const target = this.isTarget(model, event);
    if (target) {
      this.reorder.emit({
        prevValue: prevPos.index,
        newValue: target.index,
        column: model
      });
    }
    this.lastDraggingIndex = undefined;
    element.style.left = 'auto';
  }

  isTarget(
    model: TableColumnInternal,
    event: MouseEvent | TouchEvent
  ): { pos: OrderPosition; index: number } | undefined {
    if (!this.positions) {
      return undefined;
    }
    const { clientX, clientY } = getPositionFromEvent(event);
    const elementsAtPoint = this.document.elementsFromPoint(clientX, clientY);
    return Object.entries(this.positions).reduce<{ pos: OrderPosition; index: number } | undefined>(
      (acc, [id, pos], idx) => {
        if (!acc && model.$$id !== id && elementsAtPoint.some(el => el === pos.element)) {
          return { pos, index: idx };
        }
        return acc;
      },
      undefined
    );
  }
}
