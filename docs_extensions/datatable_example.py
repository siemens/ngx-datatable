from pathlib import Path


def datatable_example(
    source_file: str, component: str, height: str = '24rem'
) -> str:
    source = Path(source_file)
    if not source.is_file():
        raise ValueError(f'Datatable example source does not exist: {source}')
    source_content = source.read_text().rstrip()

    return f'''<div class="datatable-example-card" markdown="1">
  <div style="block-size: {height}">
    <ngx-datatable-{component} example></ngx-datatable-{component}>
  </div>

/// details | Show source
    type: example

```ts
{source_content}
```
///
</div>

<script>
  window.addEventListener('ngx-datatable-examples-ready', async () => {{
    await window.loadDatatableExample('{component}');
  }});
</script>'''


def define_env(env) -> None:
    env.macro(datatable_example)
