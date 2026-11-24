/**
 * Caps private top-level helpers per module. A file with one export and many
 * helpers is a folder in disguise: its steps belong in their own modules.
 */
const FUNCTION_INITS = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'ClassExpression']);

const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Limit private top-level helpers per file' },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 0 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooMany: '"{{name}}" is private helper #{{count}} (max {{max}}). Split this file by step into its own modules.',
    },
  },
  create(context) {
    const max = context.options[0]?.max ?? 3;
    return {
      Program(program) {
        const exportedNames = collectExportedNames(program);
        const helpers = program.body.flatMap(privateHelpers).filter(({ name }) => !exportedNames.has(name));
        helpers.slice(max).forEach(({ name, node }, index) => {
          context.report({ node, messageId: 'tooMany', data: { name, count: String(max + index + 1), max: String(max) } });
        });
      },
    };
  },
};

export default rule;

function collectExportedNames(program) {
  const names = new Set();
  for (const statement of program.body) {
    if (statement.type === 'ExportNamedDeclaration') {
      for (const specifier of statement.specifiers) names.add(specifier.local.name);
    }
    if (statement.type === 'ExportDefaultDeclaration' && statement.declaration.type === 'Identifier') {
      names.add(statement.declaration.name);
    }
  }
  return names;
}

function privateHelpers(statement) {
  if (statement.type === 'FunctionDeclaration' || statement.type === 'ClassDeclaration') {
    return statement.id ? [{ name: statement.id.name, node: statement }] : [];
  }
  if (statement.type !== 'VariableDeclaration') return [];
  return statement.declarations
    .filter((declarator) => declarator.init && FUNCTION_INITS.has(declarator.init.type))
    .map((declarator) => ({ name: declarator.id.name ?? '(destructured)', node: declarator }));
}
