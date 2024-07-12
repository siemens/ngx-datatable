import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StickyHeaderDirective } from './sticky-header.directive';

@Component({
  selector: 'test-fixture-component',
  template: ` <div sticky-header></div> `
})
class TestFixtureComponent {}

describe('StickyHeaderDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;
  let element;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StickyHeaderDirective, TestFixtureComponent]
    });
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TestFixtureComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
    })
  );

  describe('fixture', () => {
    let directive: StickyHeaderDirective;

    beforeEach(() => {
      directive = fixture.debugElement.query(By.directive(StickyHeaderDirective)).injector.get(StickyHeaderDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have LongPressDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should have isLongPress set to false', () => {
      expect(directive._isFixed).toBeFalsy();
    });
  });
});
