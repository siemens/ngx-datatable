import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  ApiDeclaredItem,
  ApiItem,
  ApiItemKind,
  ApiModel,
  ApiPropertyItem,
  ReleaseTag
} from '@microsoft/api-extractor-model';
import {
  DocExcerpt,
  DocHtmlEndTag,
  DocHtmlStartTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocPlainText
} from '@microsoft/tsdoc';
import P from 'parsimmon';

type SignalKind = 'input' | 'output';
type SignalInfo = { kind: SignalKind; valueType: string };

const root = resolve(import.meta.dirname, '..');
const outputRoot = resolve(root, 'docs/api');
const referenceRoot = resolve(outputRoot, 'reference');

const apiModel = new ApiModel();
const apiPackage = apiModel.loadPackage(resolve(root, 'temp/ngx-datatable.api.json'));
const entryPoint = apiPackage.entryPoints[0];
if (!entryPoint) throw new Error('Unable to find the package entry point in the API model.');

const inputWrappers = [
  '_angular_core.InputSignalWithTransform',
  '_angular_core.ModelSignalWithTransform',
  '_angular_core.InputSignal',
  '_angular_core.ModelSignal'
];
const outputWrapper = '_angular_core.OutputEmitterRef';
const importAliases = ['_angular_core.', '_siemens_ngx_datatable.'];
const removeImportAliases = P.alt(...importAliases.map(alias => P.string(alias).result('')), P.any)
  .many()
  .skip(P.eof)
  .map(parts => parts.join(''));
const genericArgument: P.Parser<string> = P.lazy(() =>
  P.alt(
    P.string('<')
      .then(genericArgument.sepBy(P.string(',')))
      .skip(P.string('>'))
      .map(arguments_ => `<${arguments_.join(',')}>`),
    P.noneOf('<>,')
  )
    .many()
    .map(parts => parts.join(''))
);
const signalType = P.alt(
  ...inputWrappers.map(wrapper => P.string(wrapper).result('input' as const)),
  P.string(outputWrapper).result('output' as const)
).chain(kind =>
  P.string('<')
    .then(genericArgument.sepBy(P.string(',')))
    .skip(P.string('>'))
    .skip(P.eof)
    .map(arguments_ => ({ kind, valueType: arguments_[0]?.trim() ?? '' }))
);

function declaredExcerpt(item: ApiItem): string {
  return item instanceof ApiDeclaredItem
    ? readableTokens(item.excerptTokens.map(token => token.text))
    : '';
}

function readableTokens(tokens: readonly string[]): string {
  return removeImportAliases.tryParse(tokens.join(''));
}

function signalInfo(item: ApiItem): SignalInfo | undefined {
  if (!(item instanceof ApiPropertyItem)) return undefined;
  const result = signalType.parse(item.propertyTypeExcerpt.text);
  return result.status
    ? { ...result.value, valueType: readableTokens([result.value.valueType]) }
    : undefined;
}

function description(item: ApiItem): string {
  if (!(item instanceof ApiDeclaredItem) || !item.tsdocComment) return '';
  const summary = renderDocNode(item.tsdocComment.summarySection);
  const remarks = item.tsdocComment.remarksBlock
    ? renderDocNode(item.tsdocComment.remarksBlock.content)
    : '';
  return [summary, remarks].filter(Boolean).join('\n\n').trim();
}

function renderDocNode(node: DocNode): string {
  if (node.kind === DocNodeKind.PlainText) return (node as DocPlainText).text;
  if (node.kind === DocNodeKind.SoftBreak) return '\n';
  if (node.kind === DocNodeKind.Excerpt) return (node as DocExcerpt).content.toString();
  if (node.kind === DocNodeKind.HtmlStartTag) return (node as DocHtmlStartTag).emitAsHtml();
  if (node.kind === DocNodeKind.HtmlEndTag) return (node as DocHtmlEndTag).emitAsHtml();
  if (node.kind === DocNodeKind.LinkTag) {
    const link = node as DocLinkTag;
    return link.linkText ?? link.urlDestination ?? link.codeDestination?.emitAsTsdoc() ?? '';
  }
  return node.getChildNodes().map(renderDocNode).join('');
}

function isDocumented(item: ApiItem): boolean {
  return (
    (item.kind === ApiItemKind.Constructor ||
      (item.displayName !== '' && item.displayName[0] !== '_' && item.displayName[0] !== 'ɵ')) &&
    (!('releaseTag' in item) || item.releaseTag !== ReleaseTag.Internal)
  );
}

function slug(name: string): string {
  let result = '';
  for (const character of name) {
    const isUpperCase = character >= 'A' && character <= 'Z';
    if (isUpperCase && result.length > 0) result += '-';
    result += character.toLowerCase();
  }
  return result;
}

function renderReferenceMember(item: ApiItem): string {
  const signal = signalInfo(item);
  const excerpt = declaredExcerpt(item).trim();
  const declaration = signal
    ? `${item.displayName} = ${signal.kind}<${signal.valueType}>()`
    : excerpt.endsWith(';')
      ? excerpt.slice(0, -1)
      : excerpt;
  const details = description(item);
  const heading = item.kind === ApiItemKind.Constructor ? 'constructor' : item.displayName;
  return `### ${heading}\n\n\`\`\`typescript\n${declaration}\n\`\`\`${details ? `\n\n${details}` : ''}`;
}

function groupTitle(item: ApiItem): string {
  const signal = signalInfo(item);
  if (signal?.kind === 'input') return 'Inputs';
  if (signal?.kind === 'output') return 'Outputs';
  if (item.kind === ApiItemKind.Constructor) return 'Constructor';
  if (
    item.kind === ApiItemKind.Method ||
    item.kind === ApiItemKind.MethodSignature ||
    item.kind === ApiItemKind.Function
  )
    return 'Functions';
  return 'Properties';
}

function renderReferencePage(item: ApiItem): string {
  const groups = new Map<string, ApiItem[]>();
  for (const child of item.members.filter(isDocumented)) {
    const title = groupTitle(child);
    groups.set(title, [...(groups.get(title) ?? []), child]);
  }
  const groupOrder = ['Constructor', 'Inputs', 'Outputs', 'Properties', 'Functions'];
  const sections = groupOrder
    .flatMap(title => {
      const members = groups.get(title);
      return members
        ? [
            `## ${title}\n\n${members
              .sort((a, b) => a.displayName.localeCompare(b.displayName))
              .map(renderReferenceMember)
              .join('\n\n')}`
          ]
        : [];
    })
    .join('\n\n');
  const details = description(item);
  return `<!-- This file is generated by npm run docs:api. -->\n\n# ${item.displayName}\n\n\`\`\`typescript\n${declaredExcerpt(item).trim()}\n\`\`\`${details ? `\n\n${details}` : ''}${sections ? `\n\n${sections}` : ''}\n`;
}

await rm(referenceRoot, { recursive: true, force: true });
await mkdir(referenceRoot, { recursive: true });

const declarations = [
  ...new Map(
    entryPoint.members.filter(isDocumented).map(member => [member.displayName, member])
  ).values()
];
for (const declaration of declarations)
  await writeFile(
    resolve(referenceRoot, `${slug(declaration.displayName)}.md`),
    renderReferencePage(declaration)
  );
const links = declarations
  .map(declaration => `- [${declaration.displayName}](./${slug(declaration.displayName)}.md)`)
  .join('\n');
await writeFile(
  resolve(referenceRoot, 'index.md'),
  `<!-- This file is generated by npm run docs:api. -->\n\n# API Reference\n\n${links}\n`
);
await writeFile(
  resolve(outputRoot, 'index.md'),
  `<!-- This file is generated by npm run docs:api. -->\n\n# API Reference\n\n${links.replaceAll('./', './reference/')}\n`
);
