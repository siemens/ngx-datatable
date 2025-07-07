# [24.0.0](https://github.com/siemens/ngx-datatable/compare/23.0.0...24.0.0) (2025-07-02)


### Features

* add aria-labels to row selection checkboxes ([ae8c946](https://github.com/siemens/ngx-datatable/commit/ae8c9467cda04a20642658aff8d1fa28c177bc18))
* support using string values in previous enum locations ([9033187](https://github.com/siemens/ngx-datatable/commit/9033187ddaa82d467ee5fbf069a1e14ba8273fb5))


### Bug Fixes

* add treeToggleTemplate property in toInternalColumn method to make custom tree template work ([97e8529](https://github.com/siemens/ngx-datatable/commit/97e8529dfd7118e624293891a6c716e9f1fce5ab))
* calculate correct column width in flex mode after resize ([f6d6cf9](https://github.com/siemens/ngx-datatable/commit/f6d6cf99d2e61684888813878561c5d6e5e5e30c)), closes [#155](https://github.com/siemens/ngx-datatable/issues/155)
* never render a resize handle after the last column ([51e3daf](https://github.com/siemens/ngx-datatable/commit/51e3daf4979bb6cc35344b4efd2b7a42665e98b4))
* prevent column reordering between frozen and non-frozen columns ([9c38292](https://github.com/siemens/ngx-datatable/commit/9c38292b0a8930af3c867ae1565fba4e9f57f78f)), closes [#145](https://github.com/siemens/ngx-datatable/issues/145)


### DEPRECATIONS

* All constants that replaced the previous enums should no longer be used. Use the plain string value instead.
  
  Example:
  ```ts
  // Before
  @Component({template: `<ngx-datatable [columnMode]="ColumnMode.Force" />`})
  class MyComponent {
    ColumnMode = ColumnMode;
  }
  
  // After
  @Component({template: `<ngx-datatable [columnMode]="'force'" />`})
  class MyComponent { }

### BREAKING CHANGES

* All output properties are now readonly and cannot be reassigned.

# 23.0.0 (2025-06-24)

See our [release announcement](https://blog.siemens.com/2025/06/siemens-ngx-datatable-23-release/).

_No changes since `23.0.0-rc.2`._

See [`23.0.0-rc.0`](#2300-rc0-2025-06-18), [`23.0.0-rc.1`](#2300-rc1-2025-06-22), and [`23.0.0-rc.2`](#2300-rc2-2025-06-24)
for all changes since the last stable release.

# 23.0.0-rc.2 (2025-06-24)

- Fix: fix keyboard interaction for cell selection mode

# 23.0.0-rc.1 (2025-06-22)

- Feature: introduce a new `providedNgxDatatableConfig` for a standalone way to configure the datatable (#259)
- Breaking: Previously the datatable applied `box-sizing: border-box` to all its
  elements. This is no longer the case. Custom themes that depend on this must
  set this behavior manually, using:

  ```css
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  ```

# 23.0.0-rc.0 (2025-06-18)

- Feature: include sorts in page event (#248)
- Feature: include pager aria labels in text messages
- Feature: add touch support for reorderable and resizable features (#181)
- Feature: update project to Angular 19
- Feature: add type for details toggle event (#173)
- Feature: add type for context menu event (#174)
- Feature: configurable defaultColumnWidth
- Feature: introduce proper types for public API (#49)
- Fix: prevent errors with row-specific ghost in combination with grouping, selection and trees (#241)
- Fix: introduce a default value for rows
- Fix: remove unwanted space below the rows (#214)
- Fix: apply even/odd classes correctly when rows are grouped (#111)
- Fix: add missing type to comparator (#167)
- Fix: only run disabled check on rows
- Fix: allow partial overrides of messages (#152)
- Fix: allow partial overrides of CSS classes (#151)
- Fix: add missing space before headerClass (#138)
- Fix: do not bind content as `innerHTML` by default (#126)
- Fix: update group checkbox state on child row selection state change
- Fix: horizontal scroll
- Fix: partial values for messages and cssClasses
- Fix: hide rows when ghostLoading with no virtualization
- Fix: calculate column widths only when table is visible
- Fix: add missing type for header and cell style classes
- Fix: resetting table with empty array
- Fix: align TableColumn directive and interface types
- Fix: improve `ActivateEvent`
- Fix: type cell context
- Fix: improve types for row grouping
- Fix: `datatable-scroller` width should update on recalculate (#79)
- Breaking: All inputs except `template` of `DatatableFooterDirective` have been
  dropped from the footer directive. Those were unused. Remove any usages without
  replacement.
- Breaking: Angular v19 or higher is required.
- Breaking: The datatable no longer accepts `undefined` as a value of the `count`
  input.
- Breaking: The datatable body no longer has spacing below the last row. If
  needed for whatever reason, this must be added manually. Workarounds removing
  this extra space must be dropped.
- Breaking: Previously `CellContext.rowIndex` was a `string` if the row was
  inside a group. Now `CellContext.rowIndex` is always a number. Either
  containing the index of the row or if the row is inside a group, the index of
  the group. To access the index value of a row within a group, use the new
  `CellContext.rowInGroupIndex`.
- Breaking: Removed `ResizeableDirective`. This directive was intended for
  internal use to handle column resizing, which is now managed directly in the
  `DataTableHeaderCellComponent`.
- Breaking: The row detail context (`RowDetailContext`) no longer contains
  `disableRow$?: Observable<boolean>`. Use the new `disabled: boolean` value
  instead.
- Breaking: The cell context (`CellContext`) no longer contains
  `disableRow$?: Observable<boolean>`. Use the new `disabled: boolean` value
  instead.
- Breaking: `disableRowCheck` will only be called with actual rows. Although
  documented otherwise, in the case of groups, the `disableRowCheck` was only
  called for groups instead of each row inside that group. This allows disabling
  single rows inside a group and not only entire groups. To update the disabled
  state of a row just update the row itself instead of using the previous
  `disableRow$` subject.
- Breaking: Removed several symbols from the public API that were intended to be
  internal.
- Breaking: Removed polyfill for `elementsFromPoint` since `elementsFromPoint`
  is now supported by all major browsers.
- Breaking: Previously, cell values were bound using `innerHTML`. With this
  change they are now bound using normal data binding. This means that any html
  markup will no longer be rendered. To restore the previous behavior set
  `bindAsUnsafeHtml` on columns where needed. We decided to change this behavior,
  as binding `innerHTML` can lead to HTML injection. Especially in table content
  which are often untrusted user generated content.
- Breaking: Header cell names are now bound using data binding instead of `innerHTML`.
  Use a `headerTemplate` to provide custom html markup.
- Breaking: Changed `Keys` enum to use `key` value instead of `keyCode`. `keyCode`
  is deprecated from `KeyBoardEvent` and should be replaced with `key`.
- Breaking: Vendor prefixes are no longer applied for css `transform`. The
  related helpers are removed from the public api.
- Breaking: Change signature from `onBodyPage({ offset }: any): void` to `onBodyPage(offset: number): void`.
- Breaking: Almost every public API has now proper types. While this should in
  theory not affect applications it will now fail compilation if the APIs were
  used in an incorrect manner.

# 22.4.1 (2024-07-26)

- Fix: recalculate only if row differs (#73)
- Fix: tree grouping breaks if rows are assigned statically (#77)

# 22.4.0

- Feature: support removing sort on column (#64)
- Feature: support row group checkbox (#62)
- Fix: correct expanding all row groups (#60)
- Fix: support changing row group height (#61)
- Fix: correct table width on empty table (#63)

# 22.3.0

- Feature: support row wrapper for adding custom directives,
  like CDK Drag and Drop
- Fix: horizontal scroll on grouped rows had infinite width
- Fix: support sorting with grouped rows
- Fix: remove right spacing on fixed column when no vertical scroll is needed
- Fix: keep horizontal scrolling in empty tables, if columns do not fit on screen
- Fix: support grouped row selection
- Fix: support tabbing over header cells

# 22.2.2

- Fix: prefer un-prefixed style attributes over prefixed one

  Fixes an issue on Firefox 126 (released May 2024), which no longer support
  `-moz-transform` but `transform`. But when we get style attributes from an element,
  `-moz-transform` is still available, which makes our `testStyle` fails. So to resolve
  this issue, we want to use un-prefixed attribute if available.

# 22.2.1

- Fix: revert add types for table rows

  We introduced a breaking change, as `undefined` was
  not allowed as row input any more. Reverting the change
  and will re-introduce as the typing later.

# 22.2.0

- Feature: add types for table rows
- Fix: move footer outside of aria role table

# 22.1.1

- Fix: emit page objects when changing page offset

# 22.1.0

- Feature: support keyboard shortcuts for all rows selection

# 22.0.2

- Fix: adjust for overflow when scaling columns in flex mode

# 22.0.1

- Fix: allow row disabling through side effects

# 22.0.0

- Feature: upgrade project to Angular 17
- Breaking Change: update to Angular 17

# 21.6.0

- Feature: upgrade project to Angular 15

# 21.5.0

- Feature: add `cssClasses`, `headerHeight`, `footerHeight` and `rowHeight` to global configuration

# 21.4.1

- Fix: emit missing `dragleave` drag-and-drop event

# 21.4.0

- Feature: add row drag and drop capability

# 21.3.1

- Fix: remove ghost placeholder cells after data load

# 21.3.0

- Feature: allow support to mark complete row as disable
- Fix: increase style compilation budget

# 21.2.1

- Fix: correct dynamic vertical scrolling

# 21.2.0

- Feature: Add on-demand vertical scrolling support

# 21.1.3

- Fix: add missing aria-label to tree icons

# 21.1.2

- Fix: only show ghost loading indicator when active

# 21.1.1

- Fix: add ghost loading indicator support
- Fix: scroll bar re-draw issue and enabled DOM virtualization
- Fix: loading indicator memory leak
- Fix: redraw issue with virtual scrolling while dragging scrollbar

# 21.1.0

- Feature: decouple checkboxable and headerCheckboxable from SelectionType.checkbox
- Feature: update to Angular 13 and ivy
- Chore: switch from TSLint/Prettier to ESLint

# 21.0.0

- Feature: support custom loading indicator
- Fix: prevent internal sorting if `externalSorting` is set
- Breaking: `emptyCustomContent` input no longer required/supported

# 20.1.0

- Feature: support custom content for empty table
- Fix: tabindex on datatable body
- Fix: orderable directive
- Fix: column resizing cases
- Fix: refresh virtual grid after scroll
- Fix: clearTimeout/\_destroySubscription race
- Fix: CSP script-src 'self'
- Fix: emit page event on page size change for virtual paging

# 20.0.0

- Breaking: Update to angular 12
- Breaking: fork into `@siemens` scope

# 19.0.0

- Breaking: Update to angular 11

# 18.0.0

- Breaking: Update to angular 10

# 17.1.0

- Feature: Add sorting: unset icon

# 17.0.0

- Chore: explicitly only suppot ng9

# 16.1.1

- Chore: Patch release to override 16.1.0

# 16.1.0

- Fix: [selectAllRowsOnPage] is broken. (swimlane/ngx-datatable#1809)
- Fix: Bug when using cellClass as string. (swimlane/ngx-datatable#1817)
- Fix: Docs. (swimlane/ngx-datatable#1812, swimlane/ngx-datatable#1837, swimlane/ngx-datatable#1845, swimlane/ngx-datatable#1854)
- Fix: redraw after recalculate (swimlane/ngx-datatable#1816)
- Fix: undefined row index for rows in groups (swimlane/ngx-datatable#1857)
- Chore: Add pretty-quick as a precommit hook using husky (swimlane/ngx-datatable#1841)
- Chore: Bump dependecies (swimlane/ngx-datatable#1858, swimlane/ngx-datatable#1862, swimlane/ngx-datatable#1859)

# 16.0.3

- Bug: Fix disappearing rows with vertical scrollbar, virtual scrolling & rowdetail auto height (swimlane/ngx-datatable#1799)
- Bug: Fix memory leak due to created element not cleaned up (swimlane/ngx-datatable#1792)
- Bug: do not collapse row details when row updated (swimlane/ngx-datatable#1778)

# 16.0.2

- Bug: Remove barrel files because ng-packagr doesn't work well with them

# 16.0.1

- Bug: Include styles, assets and themes in release

# 16.0.0

- Breaking: the release files are not under the `/release` folder any more. Also, paths to `themes` and `assets` have changed. If you are importing any assets or styles from the release folder, you would need to update the paths.
- Chore: Migrates the project to angular-cli, making it compatible with Ivy (swimlane/ngx-datatable#1738)
- Feature: Implements global module config via forRoot (swimlane/ngx-datatable#1688)
- Feature: Colors of material style can be modified by target application (swimlane/ngx-datatable#1651)
- Bug: Fixes Exception in scoller component destroy (swimlane/ngx-datatable#1685)
- Bug: Fixes issue 1686: column resizing issue in force columns mode (no horizontal scroll) when container get smaller (swimlane/ngx-datatable#1687)
- Docs: Updates demo pages (swimlane/ngx-datatable#1738)

# 15.0.2

- Fix: Fixes issue where footer pagination does not work when virtual scrolling is enabled (swimlane/ngx-datatable#1704)

# 15.0.1

- Fix: Fixes issue where using conditional templates would not render them (swimlane/ngx-datatable#1701)

# 15.0.0

- Breaking: Upgrade to angular 8 (swimlane/ngx-datatable#1697)
- Fix: Module not found: Error: Can't resolve '.' (swimlane/ngx-datatable#1646)
- Fix: trackByProp can't work. (swimlane/ngx-datatable#1622)

# 14.0.0

- Breaking: Upgrade to angular 7
- Fix: Fix compile error when using TemplateTypeCheck set to true (swimlane/ngx-datatable#1520)

# 13.1.0

- Feature: Added support for tree grid (swimlane/ngx-datatable#1273)
- Fix: Improve virtualization as a flag (swimlane/ngx-datatable#1297)
- Fix: Fix issue when count is undefined swimlane/ngx-datatable#838 (swimlane/ngx-datatable#1499)
- Fix: Fix usage withing prerendered SPA (swimlane/ngx-datatable#1438)

# 13.0.1

- Fix: Run scroll event listeners inside angular zone (swimlane/ngx-datatable#1375)

# 13.0.0

- Breaking: Fixes several issues related to the summary row feature (swimlane/ngx-datatable#1418)
- Fix: DataTableColumnDirective Input Binding Changes (swimlane/ngx-datatable#1384)
- Fix: angular version (swimlane/ngx-datatable#1420)
- Fix: issues when running npm run build --prod (swimlane/ngx-datatable#1410)

# 12.0.0

- Breaking: Upgraded to Angular 6 (swimlane/ngx-datatable#1400)
- Feat: Added reorderable input (swimlane/ngx-datatable#1261)
- Fix: Fixed rowHeight type in body component (swimlane/ngx-datatable#1295)
- Fix: Fixed row selection for bootstrap theme (swimlane/ngx-datatable#1357)
- Fix: Reflect minWidh & maxWidth props to body cell (swimlane/ngx-datatable#1361)

# 11.3.0

- Feat: Added summary row (swimlane/ngx-datatable#1233)
- Fix: Fixed issue wi
  th misaligned body content (swimlane/ngx-datatable#1326)
- Fix: Fixed Default Sort Behavior Of Table With Custom Templates (swimlane/ngx-datatable#1308)
- Chore: Fixed link in column api docs (swimlane/ngx-datatable#1343)
- Chore: Fixed typo in docs (swimlane/ngx-datatable#1342)

# 11.2.0

- Feat: Add resize handler for non-resizable columns (swimlane/ngx-datatable#1225)
- Fix: Pager Component Accessibility (swimlane/ngx-datatable#1259)
- Fix: Fix missing row with virtualization and scrollbarV (swimlane/ngx-datatable#1235)
- Fix: Fall back to view mode when select field value doesn't change (swimlane/ngx-datatable#1241)
- Fix: Fix virtual-paging (swimlane/ngx-datatable#1229)
- Fix: Fix column scaling on resize (swimlane/ngx-datatable#1236)
- Fix: Propagate sortDir changes to template (swimlane/ngx-datatable#1243)
- Fix: Add setStylesByGroup() in set column prop (swimlane/ngx-datatable#1244)

# 11.1.7

- Fix: Fix error w/ rows undefined on init

# 11.1.6

- Bug: Ignore rxjs/operators
- Feat: Ability to disable virtualization (swimlane/ngx-datatable#1191)
- Feat: Universal Support (swimlane/ngx-datatable#1178)

# 11.1.5

- Compat: Fix Angular 4.x Compat

# 11.1.4

- Bug: Fix column templates not updating with loops/ifs
- Bug: Fix sorting on cross browser
- Chore: Switch to lettable operators

# 11.1.3

- Bug: Angular SSR Event Undefined (swimlane/ngx-datatable#1144)

# 11.1.2

- Bug: Fix total undefined (swimlane/ngx-datatable#1140)

# 11.1.1

- Bug: Fix race case with rows

# 11.1.0

- Perf: Better performance on scrolling y and x
- Feature: Select All on Current Page (swimlane/ngx-datatable#1132)
- Bug: Don't show empty on loading (swimlane/ngx-datatable#1139)

# 11.0.4

- Bug: Fix Angular5 Aot Issue
- Bug: Fix Vendor Prefix Error

# 11.0.1, 11.0.2, 11.0.3

- Bug: Angular 5 bugs

# 11.0.0

- Chore: Upgrade to Angular5

# 10.4.0

- Feature: Ability to filter checkable rows (swimlane/ngx-datatable#1056)
- Feature: Allow sorting based on whole row (swimlane/ngx-datatable#1074)
- Bug: Fix protractor events (swimlane/ngx-datatable#1081)
- Bug: Fix misalignment on smaller screens (swimlane/ngx-datatable#1081)

# 10.3.0

- Feature: Bootstrap theme
- Bug: Fix CSS for row grouping (swimlane/ngx-datatable#1053)
- Bug: Fix group row values (swimlane/ngx-datatable#1034)
- Bug: Fix cell overflow w/ fluid height (swimlane/ngx-datatable#1030)
- Bug: Fix for column sort (swimlane/ngx-datatable#1018)
- Bug: Strip HTML for null values (swimlane/ngx-datatable#966)
- Bug: Update context in cell header (swimlane/ngx-datatable#935)
- Bug: Add bounds to offset (swimlane/ngx-datatable#978)
- Bug: Make selection apply to all rows (swimlane/ngx-datatable#974)

# 10.2.3

- Bug: Fix checkbox not being shown (swimlane/ngx-datatable#956)
- Bug: Fix IE displaying null (swimlane/ngx-datatable#967)
- Bug: Fix emptry string is row is null (swimlane/ngx-datatable#951)

# 10.2.2

- Bug: Recalculate limit properly (swimlane/ngx-datatable#963)

# 10.2.1

- Bug: Detail Row Broken

# 10.2.0

- Feature: Row Grouping

# 10.1.0

- Feature: Row Hover Event
- Bug: Columns are no longer mutated!
- Bug: Fixes for Angular v5!
- Bug: Fix expand all row detail not working (swimlane/ngx-datatable#917)
- Chore: Remove useless jsdoc comments

# 10.0.5

- Style: Material styles closer to spec
- Bug: Non-sortable header showing pointer cursor

# 10.0.4

- Perf: Changed everything internal to OnPush
- Perf: Fixed header cell outlet cd
- Bug: Fixed sort mutating original rows

# 10.0.3

- Perf: Better performance in cells

# 10.0.2

- Enhancement: Add `rowIndex` to row-detail template
- Bug: Add `index.css` back to build

# 10.0.1

- Bug: Fix old references to `$$index` and `$$expanded`
- Bug: Add `$$index` in cell templates as `rowIndex`
- Bug: Fix MouseEvent undefined in JIT (swimlane/ngx-datatable#893)

# 10.0.0

- BREAKING: `$$expanded` is no longer on row of detail templates, use `let-expanded` to get pop now
- Feature: Always center activated page on pager
- Bug: Remove row mutations of `$$index` and `$$expanded`
- Bug: Pagination broken on large number of rows
- Bug: Strip HTML from title tags (swimlane/ngx-datatable#892)

## 9.3.1

- Bug: More Universal Rendering Fixes (swimlane/ngx-datatable#795)
- Chore: Build optimizations from new webpack version

## 9.3.0

- Feature: Unviseral Rendering (swimlane/ngx-datatable#764)

## 9.2.0

- Enhancement: Add header context menu event
- Bug: Fix sort blowing up when undefined and adding new sort
- Bug: Fix multi-selection key with Mac

## 9.1.0

- Enhancement: Add more context to cells (swimlane/ngx-datatable#720)
- Enhancement: Export Pager component (swimlane/ngx-datatable#735)
- Bug: Header checkbox when row selection is changed (swimlane/ngx-datatable#659)
- Bug: When rowClass() returns a string, the class is not properly added (swimlane/ngx-datatable#710)
- Bug: Rename icons so don't conflict with other libs (swimlane/ngx-datatable#729)

## 9.0.0

- BREAKING: Fixes for external pagination fixes. Index calculation change being last page = `0 + pageSize` (swimlane/ngx-datatable#714, swimlane/ngx-datatable#138, swimlane/ngx-datatable#391)
- Feature: Server-side virtual scrolling pagination
- Demos: Deep linking of demo pages

## 8.2.1

- Bug: Fix footer styles

## 8.2.0

- Feature: Footer Templates

## 8.1.0

- Feature: Dark Theme

## 8.0.1

- Bug: Fix memory leak (swimlane/ngx-datatable#702)
- Bug: Don't add column header title attribute when custom template provided (swimlane/ngx-datatable#643)
- Bug: Only apply pointer to header text (swimlane/ngx-datatable#682)
- Bug: Fix prop field name with dots (swimlane/ngx-datatable#596)
- Bug: Virtual scroll + dynamic height in cell detail not working right (swimlane/ngx-datatable#703)
- Bug: Fix dynamic row height not working right if using server-side pagination
- Chore: Implement `noImplicitAny` (swimlane/ngx-datatable#671)

## 8.0.0

- Breaking: Removed `cssClass` from columns in favor of explicit
- Feature: Added explicit `headerClass` and `cellClass`
- Feature: Add ability to have callback for those class getters
- Bug: Fix checkbox select all not updating ui correctly

## 7.3.1

- Bug: Fix resize handle drag triggering long press
- Bug: Fix dragging trigging column sorting
- Bug: Fix column re-ordering not working on FF

## 7.3.0

- Feature: Dynamic row heights for virtual scrolling
- Bug: Do not use `document` for universal support (swimlane/ngx-datatable#668)

## 7.2.1

- Bug: Fix missing type

## 7.2.0

- Feature: Allow for dynamic Detail Row heights (swimlane/ngx-datatable#653)
- Feature: Numeric prop support via support array rows (swimlane/ngx-datatable#494)
- Perf: Optimize sort code by caching valueGetter and compareFn outside loop.
- Perf: Set ValueGetter on `TableColumn.$$valueGetter`
- Bug: Alter setColumnDefaults to work with numeric prop values.

## 7.1.1

- Perf: Fix memory leaks with templates (swimlane/ngx-datatable#464)
- Bug: Fix row detail expanded and then collapsed not showing anything until scroll

## 7.1.0

- Bug: Fix title not set on cell template (swimlane/ngx-datatable#629)
- Chore: Update to official Angular4
- Chore: Misc build dep updates

## 7.0.0

- BREAKING: Update to Angular4!
- Feature: Row classes (swimlane/ngx-datatable#571), (swimlane/ngx-datatable#348)
- Bug: Show first page after sorting (swimlane/ngx-datatable#553)
- Bug: When reordering and skipping a column, the column gets duplicated (swimlane/ngx-datatable#497), (swimlane/ngx-datatable#562), (swimlane/ngx-datatable#563)
- Chore: Upgrade misc deps and lint fixes

_NOTE: If you need support for ~Angular2, use version 6.x._

## 6.3.0

- Bug: Perform sort when sort icon is clicked (swimlane/ngx-datatable#536)
- Bug: Fix resize handle overlaped by label (swimlane/ngx-datatable#521)
- Chore: Fix relative imports for rollup (swimlane/ngx-datatable#542)
- Chore: Linting

## 6.2.1

- Bug: Revert swimlane/ngx-datatable#516 causing server-side paging issue (swimlane/ngx-datatable#543)

## 6.2.0

- Bug: Fix AoT builds with SCSS (swimlane/ngx-datatable#534)
- Bug: Fix offset incorrect when filtering (swimlane/ngx-datatable#516)
- Bug: Fix mouse press subscription cleanups (swimlane/ngx-datatable#522)
- Bug: Fix header cell wrapper empty span (swimlane/ngx-datatable#504)
- Bug: Fix selected count undefined in footer template (swimlane/ngx-datatable#537)
- Bug: Fix orderable unsubscribe listeners (swimlane/ngx-datatable#538)
- Chore: Update Angular and ZoneJS

## 6.1.2

- Bug: Fix default sort (swimlane/ngx-datatable#475)

## 6.1.1

- Bug: Fix tree-shaking issue (swimlane/ngx-datatable#511)

## 6.1.0

- Feature: Add selected count in footer (swimlane/ngx-datatable#508)
- Bug: Fix drag/drop/long-press (swimlane/ngx-datatable#506)
- Bug: Fix row widths not set correctly (swimlane/ngx-datatable#510)
- Perf: Better mouseup handling (swimlane/ngx-datatable#507)
- Chore: Bump Depedencies

## 6.0.2

- Bug: Move scss to release dir (swimlane/ngx-datatable#459)

## 6.0.1

- Bug: Fix CSS not working with AoT (swimlane/ngx-datatable#459)
- Chore: Fix ExtractText plugin causing build issue
- Chore: Upgrade Angular 2.4.5

## 6.0.0 (2017-01-25)

- BREAKING: Renamed `datatable` css class to `ngx-datatable`
- BREAKING: Embedded core css file with Angular `styleUrls`
- Enhancement: Allow sorting from inline templates (swimlane/ngx-datatable#431)
- Enhancement: Fix re-ordering columns throwing errors (swimlane/ngx-datatable#438)
- Enhancement: Add nice drag indicator to material theme
- Chore: Update Depedencies

## 5.0.0

- BREAKING: Re-worked all inputs, methods and outputs of row detail to its own container
- Enhancement: Implement Finder/Explorer shift selection behavior
- Bug: Fix reverse selection de-selecting first index in reverse
- Bug: Fix row detail not rendering

## 4.2.0

- Enhancement: Ability to add CSS Classes on Header/Column
- Bug: Fix CPU Perf on Resort (swimlane/ngx-datatable#409)
- Chore: Upgrade to Angular ^2.4.3
- Chore: Correct RxJS Imports

## 4.1.0

- Feature: Adding multi-click selection
- Bug: Use tracking fn vs inline (swimlane/ngx-datatable#388)
- Bug: Fix AoT header issue (swimlane/ngx-datatable#389)
- Bug: Fix `reorderable` not being honored (swimlane/ngx-datatable#387)
- Bug: Fix multi-select CTRL not working (swimlane/ngx-datatable#381)
- Chore: Upgrade Angular to ^2.4.1
- Docs: Multi-select

## 4.0.0

- BREAKING!!!! - Renamed project from `angular2-datatable` to `ngx-datatable`
  and updated components from `<swui-datatable>` to `<ngx-datatable>`

## 3.0.0

- BREAKING: Removed `shiftMulti` option, its not useful and creates odd scenarios
- Bug: Permanently high CPU utilization after sorting (swimlane/ngx-datatable#359)
- Bug: Fix checkbox showing in header if defined but not using checkbox select
- Bug: Fix AoT errors (swimlane/ngx-datatable#370)
- Bug: Fix build not outputing AoT files in correct directory
- Bug: Fix checkbox selection not working w/ shift key
- Chore: Upgrade Angular/Webpack

# 2.2.3

- Bug: Fix header checkbox mutating selection array

# 2.2.2

- Bug: Fix default selections and don't mutate selection arrow now

# 2.2.1

- Bug: Fix AoT by reverting TypeScript upgrade until CLI is updated

# 2.2.0

- Bug: Fix AoT private props (swimlane/ngx-datatable#352)
- Bug: Added null chk to selection getter (swimlane/ngx-datatable#340)
- Bug: multiShift not working after first page (swimlane/ngx-datatable#294)
- Chore: Update Angular to 2.3.0
- Chore: Update TypeScript to 2.1.x
- Chore: Update RxJS to 5.0.0-rc.4
- Chore: Update ZoneJS to 0.7.2
- Demo: Add templates for Webpack plugin for Google Analytics

# 2.1.3

- Bug: Fix footer not updating when all removes removed
- Bug: Fix Add/Remove items in array not updating (swimlane/ngx-datatable#255)

# 2.1.2

- Bug: Fix sizing method being debounced on view inits rather than just window resize.

# 2.1.1

- Bug: Fix memory leak with visibility observer

# 2.1.0

- Feature: Checkbox selection mode
- Enhancement: Selection mode auto added to host class for easier styling
- Style: Remove row active/select state when in cell mode of material theme
- Bug: Force fill column mode w/ scrollbarH false allowing bleed when resized
- Perf: Faster render time by adding css class via host
- Perf: Debounce window resize calcs

# 2.0.0

- BREAKING: Rename from `datatable` to `swui-datatable` (swimlane/ngx-datatable#320)
- BREAKING: Redo how row-detail/cell/header templates are described in markup (swimlane/ngx-datatable#304)
- BREAKING: Change Detection switched back to normal
- Enhancement: Row Context Menu Event `rowContextmenu` (swimlane/ngx-datatable#331)
- Bug: Set default value for selected (swimlane/ngx-datatable#314)
- Bug: Fix widths being int vs float (swimlane/ngx-datatable#309)
- Bug: Fix column resize not setting widths to the right (swimlane/ngx-datatable#308)
- Bug: Fix row object mutations (swimlane/ngx-datatable#255)
- Bug: Async Problem when using @Input (swimlane/ngx-datatable#253)
- Bug: Sort doesn't work on the first click (swimlane/ngx-datatable#254)
- Bug: Pagination "skip to last page" is not selected after click (swimlane/ngx-datatable#324)
- Bug: ngFor Not working in the datatable-row-detail-template (swimlane/ngx-datatable#274)
- Chore: Resolve all implicit `any`s (swimlane/ngx-datatable#330)
- Chore: Bump Angular to latest `2.2.4`

# 1.7.0

- Enhancement: Add RxJS Support
- Chore: Fix builds on windows

# 1.6.0

- Bug: Column headers not re-ordering (swimlane/ngx-datatable#238)
- Bug: Datatable doesn't sort data correctly when data changed (swimlane/ngx-datatable#284)
- BREAKING: `comparator` now is a normal sort function arguments of `propA, propB`.

# 1.5.1

- Bug: Custom comparator should return new array (swimlane/ngx-datatable#286)
- Bug: Init selection to empty array (swimlane/ngx-datatable#285)

# 1.5.0

- Enhancement: `externalSorting` input for simpler server-sorting usage (swimlane/ngx-datatable#281)
- Enhancement: Add `trackByProp` for change detection with mutation of row data
- Bug: Row height variable access protection (swimlane/ngx-datatable#280)
- Chore: Upgrade to Angular 2.2.0
- Demo: Inline editing updates
- Demo: Live data refresh demo
- Breaking: Remove `refresh` method per recommendation by @robwormald

# 1.4.1

- Bug: Ignore next page when already at last (swimlane/ngx-datatable#223)
- Chore: Redid Webpack Config to be clean
- Chore: TESTS! TRAVIS BUILDS! COVERAGE REPORTING!

# 1.4.0

- Enhancement: Added `refresh` API for updating table (swimlane/ngx-datatable#255)
- Bug: Fix intersection observer type errors (swimlane/ngx-datatable#268)

# 1.3.1

- Bug: Fix force column width distribution overriding new resize (swimlane/ngx-datatable#245)

# 1.3.0

- Enhancement: `selectCheck` fn to prevent selection
- Bug: Fix columns leaking event handlers
- Bug: Fix column toggling errors (swimlane/ngx-datatable#245)
- Bug: Fix AoT Metadata not creating

# 1.2.0

- Bug: Fix columns loosing templates on resize (swimlane/ngx-datatable#252)
- Bug: Fix pager not having right pages when hidden by default
- Bug: Fix expressive column width as attribute with standard column distribution
- Bug: Fix body columns not readjusting after window resize (swimlane/ngx-datatable#251)
- Enhancement: Refactor `emptyMessage` and `totalMessage` to `messages` object
- Enhancement: Huge perf improvement for tables hidden by default

# 1.1.0

- Feature: NGC Complation
- Bug: Null value in deepValueGetter (swimlane/ngx-datatable#243)
- Chore: Update Depedencies

# 1.0.0

- Feature: Cell Selection and Keyboard Navigation
- Feature: `activation` events
- Enhancement: `OnPush` all the things!
- Enhancement: Add `totalMessage` option for localization
- Enhancement: Demo Page
- Enhancement: Page Count Formatted
- Enhancement: Automatically format column `prop` when no `name` passed
- Enhancement: Add ability to pass false to `comparator` for sort handling via event
- Bug: Window resize not updating rows in virtual scrolling
- Chore: Switch to SemVer
- BREAKING: `TableOptions` has been removed and options are `Input` on component now
- BREAKING: `TableColumn` class has been removed, just pass normal objects
- BREAKING: Event names has been renamed using Angular2 standards
- BREAKING: Components have been renamed to Angular2 standards
- BREAKING: Removed `StateService`

# 0.12.0

- Bug: Return empty string on undefined deep values (swimlane/ngx-datatable#232)
- Bug: Fix force fill alog (swimlane/ngx-datatable#218)
- Enhancement: Support for other icon types (swimlane/ngx-datatable#235)
- Enhancement: Add ability to identify rows for proper selection (swimlane/ngx-datatable#154)

# 0.11.2

- Enhancement: Add ability to define css icon classes for pager / header
- Chore: Uprade to Angular 2.1.1

# 0.11.1

- Chore: Polish on new build

# 0.11.0

- Chore: New build process
- Bug: Fix detail row bug (swimlane/ngx-datatable#212)

# 0.10.1

- Bug: Fix `$$expanded` undefined with server paging (swimlane/ngx-datatable#210)

# 0.10.0

- Chore: Upgrade to Angular 2.1.0 (swimlane/ngx-datatable#202)
- Chore: Removed engine restrictions (swimlane/ngx-datatable#195)
- Bug: windows builds with node-sass (swimlane/ngx-datatable#207)
- Bug: resizing not closing correctly (swimlane/ngx-datatable#196)
- Bug: Fix height paging (swimlane/ngx-datatable#208)
- Enhancement: Improve Active CSS (swimlane/ngx-datatable#204)
- Enhancement: Add Empty Message (swimlane/ngx-datatable#194)
- Enhancement: Add deep value getter to sortRows function (swimlane/ngx-datatable#181)
- Enhancement: Sort Classes are applied to body cells (swimlane/ngx-datatable#166)
- Enhancement: AoT Compatibility (swimlane/ngx-datatable#199)
- Feature: Row Detail (swimlane/ngx-datatable#201)

# 0.9.3

- Column resize sometimes gives weird behaviour on mouse resize/click (swimlane/ngx-datatable#155)
- Fix order of setters in DataTable ngOnChanges (swimlane/ngx-datatable#179)
- Remove document event listener subscription leak in draggable & resizeable
- Fix `setScrollTop` undefined error (swimlane/ngx-datatable#182)

# 0.9.2

- Fix `name` being `undefined` introduced in 0.9.0 release

# 0.9.1

- Export component references for external consumption (swimlane/ngx-datatable#176)

# 0.9.0

- Fix accidental breaking change of renaming `HeaderCell` column property to `model`. See [commit](https://github.com/swimlane/angular2-data-table/commit/6c56b51ab918e380edb0d511730b28e66cb80afe#diff-aee46548d5e0b9f72917dd179250d4fe).
- Ensure minWidth and maxWidth values are specified saved as numbers (swimlane/ngx-datatable#167)
- Add row double click option (swimlane/ngx-datatable#168)

# 0.8.0

- Added the ability to define header templates expressively
  _Breaking Change!_ Renamed `template` to `cellTemplate` in column options

# 0.7.4

- Removed swimlane/ngx-datatable#142 in favor of style height
- Fixed issue with height + scrollbarV not sizing right
- Fix limit not applied (swimlane/ngx-datatable#133)
- Fix sort not resetting to top of page (swimlane/ngx-datatable#136)
- Added option validation

# 0.7.3

- Huge perf bumps (swimlane/ngx-datatable#149)

# 0.7.2

- Build fixes

# 0.7.1

- Removed template wrapper in favor of native template outlet

# 0.7.0

- Upgrade Angular 2.0.1 & ZoneJS
- Angular Code Style Compliance (swimlane/ngx-datatable#147)
- Fix initial load of rows jumbled (swimlane/ngx-datatable#156)
- Update row/options setting to ngOnChanges (swimlane/ngx-datatable#151)
- Fix column height not set correctly (swimlane/ngx-datatable#144)

# 0.6.1

- Virtual Scrolling Emits Paging (swimlane/ngx-datatable#130)

# 0.6.0

- Update to Angular 2.0.0!
- Fix horizontal header issue (swimlane/ngx-datatable#129)

# 0.5.1

- Fixed Multiple Tables on Same Page (swimlane/ngx-datatable#103)
- Fix TS Helpers not being included in release (swimlane/ngx-datatable#107)
- Update `onPage` API to reflect docs (swimlane/ngx-datatable#116)

# 0.5.0

- Upgrade to Angular2 RC7
