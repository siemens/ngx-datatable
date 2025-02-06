import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScrollerDirective } from './scroller.directive';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'test-fixture-component',
  template: ` <datatable-scroller #scroller="scroller" /> `,
  standalone: true,
  imports: [ScrollerDirective]
})
class TestFixtureComponent {
  @ViewChild(ScrollerDirective, { static: true }) scroller!: ScrollerDirective;
}

describe('ScrollerDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestFixtureComponent, ScrollerDirective]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a directive instance', () => {
      expect(component.scroller).toBeTruthy();
    });
  });
});
