import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataTableSelectionDirective } from './selection.directive';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'test-fixture-component',
  template: ` <div datatable-selection></div> `,
  standalone: true,
  imports: [DataTableSelectionDirective]
})
class TestFixtureComponent {
  @ViewChild(DataTableSelectionDirective, { static: true }) selector!: DataTableSelectionDirective;
}

describe('DataTableSelectionDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestFixtureComponent, DataTableSelectionDirective]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component.selector).toBeTruthy();
    });
  });
});
