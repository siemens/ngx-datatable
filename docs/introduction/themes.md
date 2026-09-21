# Themes

Out of the box, the data-table is not styled. This gives you maximum flexibility.

There is a separate material theme distributed with data-table. In order to use it, you need to
include that in your application `themes/material.css` and add the CSS class `material` to your data-table.

This is a simple way to apply the style of the demo.

```scss
@use '~@siemens/ngx-datatable/themes/material.scss';
@import '~@siemens/ngx-datatable/assets/icons.css';
```

You can just add above to your `scss` file and then specify the class of your ngx-datatable to `<ngx-datatable class="material">`

## CSS Classes

- `ngx-datatable`: Main Table class
  - `fixed-header`: The header is fixed on the table

- `datatable-header`: Header row class
  - `datatable-header-cell`: Header cell class
    - `resizeable`: Cell resizeable class
    - `sortable`: Column supports sorting through its sort button
    - `draggable`: Column supports drag/drop reordering
    - `longpress`: Cell long-press activated
    - `dragging`: Cell dragging activated
    - `sort-active`: Sort active on column
    - `sort-asc`: Sort active on column with ascending applied
    - `sort-desc`: Sort active on column with descending applied
    - `datatable-header-sort-button`: Native button containing the label and sort indicator for a sortable column
      - `draggable`: Button is the drag target for column reordering
      - `datatable-header-label-content`: Span containing the label text or custom label template
    - `datatable-header-label`: Label container for any column; also applied to the sort button for sortable columns
      - `draggable`: Label is the drag target for column reordering
      - `datatable-header-label-content`: Span containing the label text or custom label template
    - `datatable-header-actions`: Container for additional header actions next to the label or sort button

- `datatable-body-row`: Body row class
  - `datatable-row-even`: Odd row class
  - `datatable-row-odd`: Even row class
    - `datatable-body-cell`: Body cell class
      - `sort-active`: Sort active on column
      - `sort-asc`: Sort active on column with ascending applied
      - `sort-desc`: Sort active on column with descending applied
