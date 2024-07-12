# Table directives

## `stickyHeader`

The `stickyHeader` directive is designed to make a header element sticky at the top of the page as the user scrolls down. This directive ensures that the header remains visible at the top of the viewport, enhancing the user experience by keeping important navigational controls or information in view.

> **WARNING:** However, it's important to note that for the sticky behavior to work correctly, none of the element's parent containers should have CSS properties like transform, filter, perspective, or height: 100% applied to them.

To apply this directive, simply add the stickyHeader attribute to the `ngx-datatable` HTML tag in your HTML template:
```html
<ngx-datatable stickyHeader ...>your ngx-datatable content</ngx-datatable>
```
This example makes the header of the ngx-datatable sticky at the top of the page as you scroll along your table. However, once the entirety of the content has been scrolled past, the header will no longer be sticky and will scroll away.
