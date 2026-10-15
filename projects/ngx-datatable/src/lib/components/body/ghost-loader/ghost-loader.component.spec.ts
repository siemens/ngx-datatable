import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, computed, signal, TemplateRef, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideDatatableControllerMock } from '../../../../testing/datatable-controller.mock';
import { toInternalColumn } from '../../../utils/column-helper';
import { DataTableGhostLoaderComponent } from './ghost-loader.component';
import { GhostLoaderHarness } from './testing/ghost-loader.harness';

describe('DataTableGhostLoaderComponent', () => {
  let fixture: ComponentFixture<DataTableGhostLoaderComponent>;
  let loaderHarness: GhostLoaderHarness;
  let limit: WritableSignal<number>;

  beforeEach(async () => {
    limit = signal(10);
    TestBed.configureTestingModule({
      providers: [provideDatatableControllerMock({ limit })]
    });
    fixture = TestBed.createComponent(DataTableGhostLoaderComponent);
    fixture.componentRef.setInput(
      'columns',
      toInternalColumn([
        { prop: 'col1', width: 100 },
        { prop: 'col2', width: 200 }
      ])
    );
    fixture.componentRef.setInput('rowHeight', 30);
    loaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GhostLoaderHarness);
  });

  it('should create 5 ghost elements if page size is 5', async () => {
    limit.set(5);
    const count = await loaderHarness.getGhostElementCount();
    expect(count).toBe(5);
  });

  it('should create ghost cells for each column', async () => {
    const cellCount = await loaderHarness.getGhostCellCount();
    expect(cellCount).toBe(fixture.componentInstance.columns().length * limit());
  });

  it('should render a single ghost row regardless of page size', async () => {
    fixture.componentRef.setInput('singleRow', true);
    expect(await loaderHarness.getGhostElementCount()).toBe(1);
    limit.set(5);
    expect(await loaderHarness.getGhostElementCount()).toBe(1);
  });
});

@Component({
  selector: 'test-ghost-loader',
  imports: [DataTableGhostLoaderComponent],
  template: `<ghost-loader singleRow [rowHeight]="30" [columns]="columns()" />
    <ng-template #customGhostCell><div>custom ghost cell</div></ng-template>`,
  providers: [provideDatatableControllerMock({})]
})
class TestGhostLoaderComponent {
  readonly columns = computed(() =>
    toInternalColumn([
      { prop: 'col1', width: 100, ghostCellTemplate: this.ghostTemplate() },
      { prop: 'col2', width: 200 }
    ])
  );
  readonly ghostTemplate = viewChild.required('customGhostCell', { read: TemplateRef });
}

describe('with custom template', () => {
  let fixture: ComponentFixture<TestGhostLoaderComponent>;
  let loaderHarness: GhostLoaderHarness;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestGhostLoaderComponent);
    loaderHarness = await TestbedHarnessEnvironment.harnessForFixture(fixture, GhostLoaderHarness);
  });

  it('should render custom ghost cell template', async () => {
    await fixture.whenStable();
    const ghostCells = await loaderHarness.getGhostCellContent(0);
    expect(ghostCells).toBe('custom ghost cell');
  });
});
