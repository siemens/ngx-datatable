import {
  Component,
  Directive,
  inject,
  InjectionToken,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

/**
 * This component is passed as ng-template and rendered by BodyComponent.
 * BodyComponent uses rowDefInternal to first inject actual row template.
 * This component will render that actual row template.
 */
@Component({
  selector: 'datatable-row-def',
  template: `<ng-container
    *ngIf="rowDef.rowDefInternal.rowTemplate"
    [ngTemplateOutlet]="rowDef.rowDefInternal.rowTemplate"
    [ngTemplateOutletContext]="rowDef"
  />`
})
export class DatatableRowDefComponent {
  rowDef = inject(RowDefToken);
}

@Directive({
  selector: '[rowDef]'
})
export class DatatableRowDefDirective {
  static ngTemplateContextGuard(
    _dir: DatatableRowDefDirective,
    ctx: unknown
  ): ctx is RowDefContext {
    return true;
  }
}

/**
 * @internal To be used internally by ngx-datatable.
 */
@Directive({
  selector: '[rowDefInternal]'
})
export class DatatableRowDefInternalDirective implements OnInit {
  vc = inject(ViewContainerRef);

  @Input() rowDefInternal?: RowDefContext;

  ngOnInit(): void {
    this.vc.createEmbeddedView(
      this.rowDefInternal.template,
      {
        ...this.rowDefInternal
      },
      {
        injector: Injector.create({
          providers: [
            {
              provide: RowDefToken,
              useValue: this
            }
          ]
        })
      }
    );
  }
}
const RowDefToken = new InjectionToken<DatatableRowDefInternalDirective>('RowDef');
type RowDefContext = {
  template: TemplateRef<unknown>;
  rowTemplate: TemplateRef<unknown>;
  row: any;
  index: number;
};
