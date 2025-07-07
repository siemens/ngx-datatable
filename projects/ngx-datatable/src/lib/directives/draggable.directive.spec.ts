import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DraggableDirective } from './draggable.directive';

@Component({
  selector: 'test-fixture-component',
  imports: [DraggableDirective],
  template: ` <div draggable [dragModel]="model"></div> `
})
class TestFixtureComponent {
  model: any = {
    $$id: 'test',
    prop: 'test',
    draggable: true,
    dragging: false,
    resizeable: false,
    width: 100,
    minWidth: 50,
    maxWidth: 200,
    isTarget: false
  } as any;
}

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;
  let element: any;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }));

  describe('fixture', () => {
    let directive: DraggableDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(DraggableDirective))
        .injector.get(DraggableDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have DraggableDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    describe('mouse event', () => {
      let mouseDown: MouseEvent;

      beforeEach(() => {
        element.classList.add('draggable');
        mouseDown = new MouseEvent('mousedown');
        Object.defineProperty(mouseDown, 'target', { value: element });
      });

      // or else the document:mouseup event can fire again when resizing.
      describe('subscription should be destroyed', () => {
        it('when ngOnDestroy is called', () => {
          directive.onMousedown(mouseDown);
          expect(directive.subscription).toBeTruthy();

          directive.ngOnDestroy();

          expect(directive.subscription).toBeUndefined();
        });

        it('when onMouseup called and dragging', () => {
          directive.onMousedown(mouseDown);
          expect(directive.subscription).toBeTruthy();

          directive.onMouseup({} as MouseEvent);

          expect(directive.subscription).toBeUndefined();
        });
      });

      describe('subscription should not be destroyed', () => {
        it('when onMouseup is called and not dragging', () => {
          directive.onMousedown(mouseDown);
          directive.isDragging.set(false);

          expect(directive.subscription).toBeTruthy();

          directive.onMouseup({} as MouseEvent);

          expect(directive.subscription).toBeTruthy();
        });
      });
    });
  });
});
