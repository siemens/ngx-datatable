# Pagination and Scrolling

Pagination and vertical scrolling are currently strongly coupled concepts in `ngx-datatable`.
For the user, pagination can occur in two ways:

1. **Continuous pagination** — Pages form one continuous scroll range. Scrolling across a page
   boundary updates `offset` and emits `(page)`. The pager and scrollbar control the same position.
2. **Discrete pagination** — Only the current page is presented. Scrolling stays within that page;
   another page is reached through the pager or application logic.

Neither mode is enabled by default. Without `scrollbarV` or `limit`, the page size is the number of
supplied rows. A pager can be displayed for both modes.

## Continuous pagination

Setting `scrollbarV="true"` enables continuous pagination. The table uses its available height as a
viewport and adds a vertical scrollbar when the rows exceed that height. Give the table, or its
containing element, an explicit height for this calculation. Set `scrollbarVDynamic="true"`
together with `scrollbarV` if the table should reclaim the scrollbar width when no vertical
scrollbar is needed.

The table divides the scroll range into pages internally, but the user can still scroll through the
entire list. `pageSize` is the number of rows that are at least partially visible in the viewport.
When scrolling crosses a page boundary, `offset` is updated and a `(page)` event is emitted.

/// warning | Page size with continuous pagination
`limit` does not override the calculated page size while `scrollbarV` and virtualization are
enabled.
To use a fixed page size and restrict scrolling to the current page, set `limit`, disable virtualization,
and enable `externalPaging` while supplying only the current page's rows.
///

{{ datatable_example('src/app/basic/horz-vert-scrolling.component.ts', 'horz-vert-scrolling', '400px') }}

The footer and pager are shown automatically when more than one page is available (see
[Pager component](#pager-component)). In continuous mode, selecting a page scrolls the body to the
first row of that page. Set `hideFooter` to hide them explicitly.

{{ datatable_example('src/app/paging/virtual-server-side.component.ts', 'virtual-server-side', '400px') }}

## Discrete pagination

/// warning | Discrete scrolling requires external paging
A vertically scrollable discrete page only works with `externalPaging="true"`. The application must
supply only the rows for the current page and load another page when the pager emits `(page)`.
///

Set `limit` to the desired page size to enable discrete pagination. Without vertical scrolling, the
table renders only that number of rows and selecting another page replaces the visible row range.

{{ datatable_example('src/app/paging/client-side-paging.component.ts', 'client-side-paging', 'auto') }}

Vertical scrolling can also be enabled for a discrete page by setting `scrollbarV="true"` and
`virtualization="false"`. All rows supplied for the current page are rendered, and the user can
scroll within that page but not into another one. The pager or application logic must change the
page.

/// warning | Disable virtualization for discrete scrolling
`virtualization` is enabled by default. If `scrollbarV` is enabled without disabling virtualization,
the table uses continuous pagination and `limit` is ignored.
///

{{ datatable_example('src/app/paging/scrolling-no-virtual.component.ts', 'scrolling-no-virtual', '400px') }}

## Pager component

The table displays its footer automatically when more than one page is available. The default
footer shows the total row count and the built-in pager. Custom footer content also causes the
footer to be displayed, even when all rows fit on one page. The footer takes its height from its
content and works with both continuous and discrete pagination. Set `hideFooter` to suppress it.

/// note | Deprecated `footerHeight`
`footerHeight` is deprecated. Omit it to use automatic visibility and content-based sizing, and
use `hideFooter` when the footer must always be hidden. Existing numeric values remain supported
as a minimum height during the deprecation period; a value of `0` retains the previous hidden
behavior.
///

When using a custom footer, place the `ngx-datatable-pager` component inside the template
if the standard navigation controls should remain available.

{{ datatable_example('src/app/basic/footer-template.component.ts', 'footer-template', 'auto') }}

## Virtualization

Row virtualization is enabled by default. It limits DOM rendering to the rows in the visible
viewport while the scrollbar still represents the complete data set. This is what allows
continuous pagination to move across page boundaries without rendering every row at once.

With virtualization enabled, `rowHeight` must be a number or a function that returns each row's
height. The table uses those heights to calculate the scroll range and visible rows. With a fixed
numeric row height, the available body height also determines the page size.

Set `virtualization="false"` to render every supplied row. `rowHeight="auto"` can then be used for
rows that grow with their content. When `externalPaging` is also enabled, body scrolling stays
within the supplied page and does not emit requests for adjacent pages.
