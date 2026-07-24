import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Fluid Row Height', sourcePath: 'basic/fluid-row-height.component.ts' },
    loadComponent: () =>
      import('./basic/fluid-row-height.component').then(c => c.FluidRowHeightComponent)
  },
  // Basic
  {
    path: '10k-rows',
    data: { title: '10k Rows', sourcePath: 'basic/10k-rows.component.ts' },
    loadComponent: () => import('./basic/10k-rows.component').then(c => c.TenKRowsComponent)
  },
  {
    path: 'full-screen',
    data: { title: 'Full Screen', sourcePath: 'basic/full-screen.component.ts' },
    loadComponent: () => import('./basic/full-screen.component').then(c => c.FullScreenComponent)
  },
  {
    path: 'inline-editing',
    data: { title: 'Inline Editing', sourcePath: 'basic/inline-editing.component.ts' },
    loadComponent: () =>
      import('./basic/inline-editing.component').then(c => c.InlineEditingComponent)
  },
  {
    path: 'horz-vert-scrolling',
    data: { title: 'Horz/Vert Scrolling', sourcePath: 'basic/horz-vert-scrolling.component.ts' },
    loadComponent: () =>
      import('./basic/horz-vert-scrolling.component').then(c => c.HorzVertScrollingComponent)
  },
  {
    path: 'vert-dynamic-scrolling',
    data: {
      title: 'Vert Dynamic Scrolling',
      sourcePath: 'basic/vert-dynamic-scrolling.component.ts'
    },
    loadComponent: () =>
      import('./basic/vert-dynamic-scrolling.component').then(c => c.VertDynamicScrollingComponent)
  },
  {
    path: 'multiple-tables',
    data: { title: 'Multiple Tables', sourcePath: 'basic/multiple-tables.component.ts' },
    loadComponent: () =>
      import('./basic/multiple-tables.component').then(c => c.MultipleTablesComponent)
  },
  {
    path: 'filtering',
    data: { title: 'Filtering', sourcePath: 'basic/filtering.component.ts' },
    loadComponent: () => import('./basic/filtering.component').then(c => c.FilteringComponent)
  },
  {
    path: 'hidden-on-load',
    data: { title: 'Hidden On Load', sourcePath: 'basic/hidden-on-load.component.ts' },
    loadComponent: () =>
      import('./basic/hidden-on-load.component').then(c => c.HiddenOnLoadComponent)
  },
  {
    path: 'live-data',
    data: { title: 'Live Data', sourcePath: 'basic/live-data.component.ts' },
    loadComponent: () => import('./basic/live-data.component').then(c => c.LiveDataComponent)
  },
  {
    path: 'rxjs',
    data: { title: 'RxJS', sourcePath: 'basic/rxjs.component.ts' },
    loadComponent: () => import('./basic/rxjs.component').then(c => c.RxjsComponent)
  },
  {
    path: 'context-menu',
    data: { title: 'Context Menu', sourcePath: 'basic/context-menu.component.ts' },
    loadComponent: () => import('./basic/context-menu.component').then(c => c.ContextMenuComponent)
  },
  {
    path: 'css-classes',
    data: { title: 'CSS Classes', sourcePath: 'basic/css-classes.component.ts' },
    loadComponent: () => import('./basic/css-classes.component').then(c => c.CssClassesComponent)
  },
  {
    path: 'footer-template',
    data: { title: 'Footer Template', sourcePath: 'basic/footer-template.component.ts' },
    loadComponent: () =>
      import('./basic/footer-template.component').then(c => c.FooterTemplateComponent)
  },
  {
    path: 'empty-template',
    data: { title: 'Empty Template', sourcePath: 'basic/empty-template.component.ts' },
    loadComponent: () =>
      import('./basic/empty-template.component').then(c => c.EmptyTemplateComponent)
  },
  {
    path: 'drag-drop',
    data: { title: 'Drag Drop', sourcePath: 'drag-drop/drag-drop.component.ts' },
    loadComponent: () => import('./drag-drop/drag-drop.component').then(c => c.DragDropComponent)
  },
  // Themes
  {
    path: 'dark-theme',
    loadComponent: () => import('./basic/dark-theme.component').then(c => c.DarkThemeComponent),
    data: { dark: true, title: 'Dark Theme', sourcePath: 'basic/dark-theme.component.ts' }
  },
  {
    path: 'bootstrap-theme',
    data: { title: 'Bootstrap Theme', sourcePath: 'basic/bootstrap-theme.component.ts' },
    loadComponent: () =>
      import('./basic/bootstrap-theme.component').then(c => c.BootstrapThemeComponent)
  },
  // Tree
  {
    path: 'full-screen-tree',
    data: { title: 'Full Screen Tree', sourcePath: 'tree/full-screen-tree.component.ts' },
    loadComponent: () =>
      import('./tree/full-screen-tree.component').then(c => c.FullScreenTreeComponent)
  },
  {
    path: 'client-side-tree',
    data: { title: 'Client Side Tree', sourcePath: 'tree/client-side-tree.component.ts' },
    loadComponent: () =>
      import('./tree/client-side-tree.component').then(c => c.ClientSideTreeComponent)
  },
  // Rows
  {
    path: 'row-grouping',
    data: { title: 'Row Grouping', sourcePath: 'basic/row-grouping.component.ts' },
    loadComponent: () => import('./basic/row-grouping.component').then(c => c.RowGroupingComponent)
  },
  {
    path: 'fixed-row-height',
    data: { title: 'Fixed Row Height', sourcePath: 'basic/fixed-row-height.component.ts' },
    loadComponent: () =>
      import('./basic/fixed-row-height.component').then(c => c.FixedRowHeightComponent)
  },
  {
    path: 'dynamic-row-height',
    data: { title: 'Dynamic Row Height', sourcePath: 'basic/dynamic-row-height.component.ts' },
    loadComponent: () =>
      import('./basic/dynamic-row-height.component').then(c => c.DynamicRowHeightComponent)
  },
  {
    path: 'row-detail',
    data: { title: 'Row Detail', sourcePath: 'basic/row-detail.component.ts' },
    loadComponent: () => import('./basic/row-detail.component').then(c => c.RowDetailComponent)
  },
  {
    path: 'responsive',
    data: { title: 'Responsive', sourcePath: 'basic/responsive.component.ts' },
    loadComponent: () => import('./basic/responsive.component').then(c => c.ResponsiveComponent)
  },
  {
    path: 'disabled',
    data: { title: 'Disabled', sourcePath: 'basic/disabled.component.ts' },
    loadComponent: () => import('./basic/disabled.component').then(c => c.DisabledComponent)
  },
  // Paging
  {
    path: 'client-side-paging',
    data: { title: 'Client-side Paging', sourcePath: 'paging/client-side-paging.component.ts' },
    loadComponent: () =>
      import('./paging/client-side-paging.component').then(c => c.ClientSidePagingComponent)
  },
  {
    path: 'server-side-paging',
    data: { title: 'Server-side Paging', sourcePath: 'paging/server-side-paging.component.ts' },
    loadComponent: () =>
      import('./paging/server-side-paging.component').then(c => c.ServerSidePagingComponent)
  },
  {
    path: 'scrolling-no-virtual',
    data: { title: 'Scrolling no virtual', sourcePath: 'paging/scrolling-no-virtual.component.ts' },
    loadComponent: () =>
      import('./paging/scrolling-no-virtual.component').then(c => c.ScrollingNoVirtualComponent)
  },
  {
    path: 'scrolling-server-side',
    data: {
      title: 'Scrolling server-side',
      sourcePath: 'paging/scrolling-server-side.component.ts'
    },
    loadComponent: () =>
      import('./paging/scrolling-server-side.component').then(c => c.ScrollingServerSideComponent)
  },
  {
    path: 'virtual-server-side',
    data: { title: 'Virtual server-side', sourcePath: 'paging/virtual-server-side.component.ts' },
    loadComponent: () =>
      import('./paging/virtual-server-side.component').then(c => c.VirtualServerSideComponent)
  },
  // Sorting
  {
    path: 'client-side-sorting',
    data: { title: 'Client-side Sorting', sourcePath: 'sorting/client-side-sorting.component.ts' },
    loadComponent: () =>
      import('./sorting/client-side-sorting.component').then(c => c.ClientSideSortingComponent)
  },
  {
    path: 'default-sort',
    data: { title: 'Default Sort', sourcePath: 'sorting/default-sort.component.ts' },
    loadComponent: () =>
      import('./sorting/default-sort.component').then(c => c.DefaultSortComponent)
  },
  {
    path: 'server-side-sorting',
    data: { title: 'Server-side Sorting', sourcePath: 'sorting/server-side-sorting.component.ts' },
    loadComponent: () =>
      import('./sorting/server-side-sorting.component').then(c => c.ServerSideSortingComponent)
  },
  {
    path: 'comparator',
    data: { title: 'Comparator', sourcePath: 'sorting/comparator.component.ts' },
    loadComponent: () => import('./sorting/comparator.component').then(c => c.ComparatorComponent)
  },
  // Selection
  {
    path: 'cell-selection',
    data: { title: 'Cell Selection', sourcePath: 'selection/cell-selection.component.ts' },
    loadComponent: () =>
      import('./selection/cell-selection.component').then(c => c.CellSelectionComponent)
  },
  {
    path: 'single-row-selection',
    data: {
      title: 'Single Row Selection',
      sourcePath: 'selection/single-row-selection.component.ts'
    },
    loadComponent: () =>
      import('./selection/single-row-selection.component').then(c => c.SingleRowSelectionComponent)
  },
  {
    path: 'multi-row-selection',
    data: {
      title: 'Multi Row Selection',
      sourcePath: 'selection/multi-row-selection.component.ts'
    },
    loadComponent: () =>
      import('./selection/multi-row-selection.component').then(c => c.MultiRowSelectionComponent)
  },
  {
    path: 'multi-click-row-selection',
    data: {
      title: 'Multi Click Row Selection',
      sourcePath: 'selection/multi-click-row-selection.component.ts'
    },
    loadComponent: () =>
      import('./selection/multi-click-row-selection.component').then(
        c => c.MultiClickRowSelectionComponent
      )
  },
  {
    path: 'disable-selection-callback',
    data: {
      title: 'Disable Selection Callback',
      sourcePath: 'selection/disable-selection-callback.component.ts'
    },
    loadComponent: () =>
      import('./selection/disable-selection-callback.component').then(
        c => c.DisableSelectionCallbackComponent
      )
  },
  {
    path: 'checkbox-selection',
    data: { title: 'Checkbox Selection', sourcePath: 'selection/checkbox-selection.component.ts' },
    loadComponent: () =>
      import('./selection/checkbox-selection.component').then(c => c.CheckboxSelectionComponent)
  },
  {
    path: 'custom-checkbox-selection',
    data: {
      title: 'Custom Checkbox Selection',
      sourcePath: 'selection/custom-checkbox-selection.component.ts'
    },
    loadComponent: () =>
      import('./selection/custom-checkbox-selection.component').then(
        c => c.CustomCheckboxSelectionComponent
      )
  },
  {
    path: 'multi-click-and-checkbox-selection',
    data: {
      title: 'Multi Click and Checkbox Selection',
      sourcePath: 'selection/multi-click-and-checkbox-selection.component.ts'
    },
    loadComponent: () =>
      import('./selection/multi-click-and-checkbox-selection.component').then(
        c => c.MultiClickAndCheckboxSelectionComponent
      )
  },
  // Templates
  {
    path: 'inline-template',
    data: { title: 'Inline Template', sourcePath: 'templates/inline-template.component.ts' },
    loadComponent: () =>
      import('./templates/inline-template.component').then(c => c.InlineTemplateComponent)
  },
  {
    path: 'template-ref',
    data: { title: 'TemplateRef', sourcePath: 'templates/template-ref.component.ts' },
    loadComponent: () =>
      import('./templates/template-ref.component').then(c => c.TemplateRefComponent)
  },
  // Column
  {
    path: 'flex-column',
    data: { title: 'Flex Column', sourcePath: 'columns/flex-column.component.ts' },
    loadComponent: () => import('./columns/flex-column.component').then(c => c.FlexColumnComponent)
  },
  {
    path: 'column-toggling',
    data: { title: 'Column Toggling', sourcePath: 'columns/column-toggling.component.ts' },
    loadComponent: () =>
      import('./columns/column-toggling.component').then(c => c.ColumnTogglingComponent)
  },
  {
    path: 'fixed-column',
    data: { title: 'Fixed Column', sourcePath: 'columns/fixed-column.component.ts' },
    loadComponent: () =>
      import('./columns/fixed-column.component').then(c => c.FixedColumnComponent)
  },
  {
    path: 'force-column',
    data: { title: 'Force Column', sourcePath: 'columns/force-column.component.ts' },
    loadComponent: () =>
      import('./columns/force-column.component').then(c => c.ForceColumnComponent)
  },
  {
    path: 'column-pinning',
    data: { title: 'Column Pinning', sourcePath: 'columns/column-pinning.component.ts' },
    loadComponent: () =>
      import('./columns/column-pinning.component').then(c => c.ColumnPinningComponent)
  },
  {
    path: 'column-reorder',
    data: { title: 'Column Reorder', sourcePath: 'columns/column-reorder.component.ts' },
    loadComponent: () =>
      import('./columns/column-reorder.component').then(c => c.ColumnReorderComponent)
  },
  // Summary Row
  {
    path: 'simple-summary',
    data: { title: 'Simple Summary', sourcePath: 'summary/simple-summary.component.ts' },
    loadComponent: () =>
      import('./summary/simple-summary.component').then(c => c.SimpleSummaryComponent)
  },
  {
    path: 'custom-template-summary',
    data: {
      title: 'Custom Template Summary',
      sourcePath: 'summary/custom-template-summary.component.ts'
    },
    loadComponent: () =>
      import('./summary/custom-template-summary.component').then(
        c => c.CustomTemplateSummaryComponent
      )
  },
  {
    path: 'server-side-paging-summary',
    data: {
      title: 'Server-side Paging Summary',
      sourcePath: 'summary/server-side-paging-summary.component.ts'
    },
    loadComponent: () =>
      import('./summary/server-side-paging-summary.component').then(
        c => c.ServerSidePagingSummaryComponent
      )
  },
  {
    path: 'inline-html-summary',
    data: { title: 'Inline HTML Summary', sourcePath: 'summary/inline-html-summary.component.ts' },
    loadComponent: () =>
      import('./summary/inline-html-summary.component').then(c => c.InlineHtmlSummaryComponent)
  },
  {
    path: 'summary-row-actions',
    data: { title: 'Summary Row Actions', sourcePath: 'summary/summary-row-actions.component.ts' },
    loadComponent: () =>
      import('./summary/summary-row-actions.component').then(c => c.SummaryRowActionsComponent)
  }
];
