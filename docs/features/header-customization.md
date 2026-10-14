# Header Customization

Header cells provide separate customization points for their label, adjacent actions, and complete
inner content.

{{ datatable_example('src/app/templates/header-customization.component.ts', 'header-customization', '500px') }}

## Default interaction model

A sortable column renders its label and sort indicator inside a native button.
The button is the header's keyboard focus target.
`aria-sort` is exposed on the surrounding `columnheader`.

A non-sortable column renders a static label and does not introduce a tab stop.

When column reordering is enabled, dragging starts from the sort button or static label. Header actions,
selection controls, resize handles, and unused header space do not start reordering.

## Header label

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

All three templates receive the same [header context](#shared-header-context).

## Header Actions

Use `ngx-datatable-header-actions` for inputs, menus, filter buttons, and other interactive content.
Actions are rendered next to the label as independent focus targets.

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
    <button type="button" (click)="sort()">
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

When a complete header-cell template is present, label and actions templates for that column are not
rendered.

## Shared Header Context

Label, actions, and complete-cell templates all receive the same
[`HeaderCellContext`](../api/reference/header-cell-context.md). See the API reference for available
context properties.

## TemplateRef Inputs

The same customization points are available when columns are supplied as objects. Assign template
references to `headerLabelTemplate`, `headerActionsTemplate`, or `headerCellTemplate` on the
`TableColumn` definition.
