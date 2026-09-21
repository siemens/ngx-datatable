# Header Customization

Header cells provide separate customization points for their label, adjacent actions, and complete
inner content. The table continues to own the outer `columnheader` semantics and resize handle.

{{ datatable_example('src/app/templates/header-customization.component.ts', 'header-customization', '500px') }}

## Default Interaction Model

A sortable column renders its label and sort indicator inside a native button. The button is the
header's keyboard focus target and supports Enter and Space through native browser behavior.
`aria-sort` is exposed on the surrounding `columnheader`.

A non-sortable column renders a static label and does not introduce a tab stop. When column
reordering is enabled, dragging starts from the sort button or static label. Header actions,
selection controls, resize handles, and unused header space do not start reordering.

## Header Label

Use `ngx-datatable-header-label` to customize label content while retaining the table's sorting,
keyboard, sort-indicator, and reordering behavior. Label templates should contain presentation
content rather than interactive controls because sortable labels are rendered inside a button.

```html
<ngx-datatable-column name="Name" prop="name">
  <ng-template let-column="column" ngx-datatable-header-label>
    <span aria-hidden="true">★</span>
    <span [textContent]="column.name"></span>
  </ng-template>
</ngx-datatable-column>
```

The label context provides `column`.

## Header Actions

Use `ngx-datatable-header-actions` for inputs, menus, filter buttons, and other interactive content.
Actions are rendered next to the label as independent focus targets. Activating an action does not
sort or reorder the column.

```html
<ngx-datatable-column name="Company" prop="company">
  <ng-template let-column="column" ngx-datatable-header-actions>
    <input
      type="search"
      [attr.aria-label]="'Filter ' + column.name"
      (input)="filterCompany($event)"
    />
  </ng-template>
</ngx-datatable-column>
```

The actions context provides `column`, `sortDir`, `allRowsSelected`, and `selectFn`.

## Complete Header Cell Content

Use `ngx-datatable-header-cell` when the complete inner layout must be controlled by the
application. The template owns its focusable controls and invokes `sortFn` from a native button.
The table still manages the outer `columnheader`, `aria-sort`, sizing, and resize handle.

```html
<ngx-datatable-column name="Gender" prop="gender">
  <ng-template
    let-column="column"
    let-sort="sortFn"
    let-sortDir="sortDir"
    ngx-datatable-header-cell
  >
    <button type="button" ngxDatatableReorderHandle (click)="sort()">
      <span [textContent]="column.name"></span>
      <span
        aria-hidden="true"
        [textContent]="sortDir === 'asc' ? '↑' : sortDir === 'desc' ? '↓' : '↕'"
      ></span>
    </button>

    <button type="button" (click)="openFilter(column)">Filter</button>
  </ng-template>
</ngx-datatable-column>
```

Add `ngxDatatableReorderHandle` to each custom element from which pointer-based column reordering
may start. Keyboard activation of that element continues to perform only its native action.

The complete-cell context provides `column`, `sortDir`, `sortFn`, `allRowsSelected`, and `selectFn`.
When a complete header-cell template is present, label and actions templates for that column are not
rendered.

## TemplateRef Inputs

The same customization points are available when columns are supplied as objects. Assign template
references to `headerLabelTemplate`, `headerActionsTemplate`, or `headerCellTemplate` on the
`TableColumn` definition.
