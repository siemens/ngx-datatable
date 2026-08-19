import { createBuilder, type BuilderContext, type BuilderOutput } from '@angular-devkit/architect';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

interface Options {
  sourceRoot: string;
  routesFile: string;
  webComponentsFile: string;
}

interface Example {
  componentName: string;
  filePath: string;
  importPath: string;
  path: string;
}

export const generateRoutes = async (options: Options, workspaceRoot: string): Promise<number> => {
  const sourceRoot = resolve(workspaceRoot, options.sourceRoot);
  const examples = await getExamples(sourceRoot);

  if (!examples.length) {
    throw new Error(`No example components found in ${options.sourceRoot}.`);
  }

  const defaultExample =
    examples.find(example => example.path === 'fluid-row-height') ?? examples[0];
  await Promise.all([
    writeGeneratedFile(
      resolve(workspaceRoot, options.routesFile),
      generateAngularRoutes(examples, defaultExample)
    ),
    writeGeneratedFile(
      resolve(workspaceRoot, options.webComponentsFile),
      generateWebComponentRoutes(examples)
    )
  ]);

  return examples.length;
};

const execute = async (options: Options, context: BuilderContext): Promise<BuilderOutput> => {
  const count = await generateRoutes(options, context.workspaceRoot);
  context.logger.info(`Generated routes for ${count} examples.`);
  return { success: true };
};

const getExamples = async (sourceRoot: string): Promise<Example[]> => {
  const files = await getFiles(sourceRoot);
  const examples = await Promise.all(
    files.filter(file => file.endsWith('.component.ts')).map(file => getExample(sourceRoot, file))
  );

  return examples
    .filter((example): example is Example => example !== undefined)
    .sort((a, b) => a.path.localeCompare(b.path));
};

const getFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(path)));
    } else {
      files.push(path);
    }
  }

  return files;
};

const getExample = async (sourceRoot: string, filePath: string): Promise<Example | undefined> => {
  const source = ts.createSourceFile(
    filePath,
    await readFile(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );

  for (const statement of source.statements) {
    if (!ts.isClassDeclaration(statement) || !statement.name) {
      continue;
    }

    const selector = getComponentSelector(statement);
    if (!selector) {
      continue;
    }
    if (!getExampleTitle(statement)) {
      throw new Error(
        `Example component ${statement.name.text} in ${filePath} must declare a static string exampleTitle.`
      );
    }

    const relativePath = relative(sourceRoot, filePath).split(sep).join('/');
    return {
      componentName: statement.name.text,
      filePath: relativePath,
      importPath: `./${relativePath.replace(/\.ts$/, '')}`,
      path: selector.replace(/-demo$/, '')
    };
  }

  return undefined;
};

const getExampleTitle = (declaration: ts.ClassDeclaration): string | undefined => {
  for (const member of declaration.members) {
    if (
      ts.isPropertyDeclaration(member) &&
      member.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
      ts.isIdentifier(member.name) &&
      member.name.text === 'exampleTitle' &&
      member.initializer &&
      ts.isStringLiteral(member.initializer)
    ) {
      return member.initializer.text;
    }
  }

  return undefined;
};

const getComponentSelector = (declaration: ts.ClassDeclaration): string | undefined => {
  for (const decorator of ts.getDecorators(declaration) ?? []) {
    if (
      !ts.isCallExpression(decorator.expression) ||
      !ts.isIdentifier(decorator.expression.expression)
    ) {
      continue;
    }
    if (decorator.expression.expression.text !== 'Component') {
      continue;
    }

    const metadata = decorator.expression.arguments[0];
    if (!metadata || !ts.isObjectLiteralExpression(metadata)) {
      return undefined;
    }
    const selector = metadata.properties.find(
      selectorProperty =>
        ts.isPropertyAssignment(selectorProperty) &&
        ts.isIdentifier(selectorProperty.name) &&
        selectorProperty.name.text === 'selector' &&
        ts.isStringLiteral(selectorProperty.initializer)
    );
    if (selector && ts.isPropertyAssignment(selector) && ts.isStringLiteral(selector.initializer)) {
      return selector.initializer.text.endsWith('-demo') ? selector.initializer.text : undefined;
    }
  }

  return undefined;
};

const generateAngularRoutes = (examples: Example[], defaultExample: Example): string => {
  const factory = ts.factory;
  const routes = [
    factory.createObjectLiteralExpression(
      [
        property('path', ''),
        property('redirectTo', defaultExample.path),
        property('pathMatch', 'full')
      ],
      true
    ),
    ...examples.map(createRoute)
  ];
  return printSource([
    createNamedImport('Routes', '@angular/router'),
    factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            'routes',
            undefined,
            factory.createTypeReferenceNode('Routes'),
            factory.createArrayLiteralExpression(routes, true)
          )
        ],
        ts.NodeFlags.Const
      )
    )
  ]);
};

const generateWebComponentRoutes = (examples: Example[]): string => {
  const factory = ts.factory;
  const loaderType = createLoaderType();
  return printSource([
    createNamedImport('Type', '@angular/core'),
    factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            'exampleLoaders',
            undefined,
            factory.createTypeReferenceNode('ReadonlyMap', [
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
              loaderType
            ]),
            factory.createNewExpression(
              factory.createIdentifier('Map'),
              [factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), loaderType],
              [
                factory.createArrayLiteralExpression(
                  examples.map(example =>
                    factory.createArrayLiteralExpression([
                      stringLiteral(example.path),
                      createComponentLoader(example)
                    ])
                  ),
                  true
                )
              ]
            )
          )
        ],
        ts.NodeFlags.Const
      )
    )
  ]);
};

const createLoaderType = (): ts.FunctionTypeNode => {
  const factory = ts.factory;
  return factory.createFunctionTypeNode(
    undefined,
    [],
    factory.createTypeReferenceNode('Promise', [
      factory.createTypeReferenceNode('Type', [
        factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
      ])
    ])
  );
};

const createRoute = (example: Example): ts.ObjectLiteralExpression => {
  const factory = ts.factory;
  return factory.createObjectLiteralExpression(
    [
      property('path', example.path),
      factory.createPropertyAssignment(
        'data',
        factory.createObjectLiteralExpression([property('sourcePath', example.filePath)], false)
      ),
      factory.createPropertyAssignment('loadComponent', createComponentLoader(example))
    ],
    true
  );
};

const createComponentLoader = (example: Example): ts.ArrowFunction => {
  const factory = ts.factory;
  return factory.createArrowFunction(
    undefined,
    undefined,
    [],
    undefined,
    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
    factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createCallExpression(factory.createIdentifier('import'), undefined, [
          stringLiteral(example.importPath)
        ]),
        'then'
      ),
      undefined,
      [
        factory.createArrowFunction(
          undefined,
          undefined,
          [factory.createParameterDeclaration(undefined, undefined, 'component')],
          undefined,
          factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
          factory.createPropertyAccessExpression(
            factory.createIdentifier('component'),
            factory.createIdentifier(example.componentName)
          )
        )
      ]
    )
  );
};

const createNamedImport = (name: string, moduleSpecifier: string): ts.ImportDeclaration => {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      undefined,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(name))
      ])
    ),
    stringLiteral(moduleSpecifier)
  );
};

const property = (name: string, value: string): ts.PropertyAssignment => {
  return ts.factory.createPropertyAssignment(name, stringLiteral(value));
};

const stringLiteral = (value: string): ts.StringLiteral => {
  return ts.factory.createStringLiteral(value, true);
};

const writeGeneratedFile = async (filePath: string, source: string): Promise<void> => {
  await writeFile(filePath, source);
};

const printSource = (statements: ts.Statement[]): string => {
  const sourceFile = ts.factory.updateSourceFile(
    ts.createSourceFile('generated.ts', '', ts.ScriptTarget.Latest, false),
    statements
  );
  return `// This file is generated by the example-routes builder. Do not edit manually.\n${ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(sourceFile)}`;
};

export default createBuilder(execute);
