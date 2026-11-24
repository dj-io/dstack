/**
 * Keeps a module's export above its helpers, so a reader meets what the file
 * does before how. Constants may sit above the export; helper functions and
 * classes may not. Files with no runtime export (entry scripts) are skipped.
 */
const FUNCTION_INITS = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'ClassExpression']);

const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Put the export above helper functions and classes' },
    schema: [],
    messages: {
      helperFirst: '"{{name}}" is declared above the export. Move it below the export, in the order the export calls it.',
    },
  },
  create(context) {
    return {
      Program(program) {
        const exportIndex = program.body.findIndex(isRuntimeExport);
        if (exportIndex === -1) return;
        for (const statement of program.body.slice(0, exportIndex)) {
          for (const name of helperNames(statement)) {
            context.report({ node: statement, messageId: 'helperFirst', data: { name } });
          }
        }
      },
    };
  },
};

export default rule;

function isRuntimeExport(statement) {
  if (statement.type === 'ExportDefaultDeclaration') return true;
  if (statement.type !== 'ExportNamedDeclaration' || statement.exportKind === 'type') return false;
  const declaration = statement.declaration;
  if (!declaration) return statement.specifiers.length > 0;
  return !['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'].includes(declaration.type) && !declaration.declare;
}

function helperNames(statement) {
  if (statement.type === 'FunctionDeclaration' || statement.type === 'ClassDeclaration') {
    return [statement.id?.name ?? '(anonymous)'];
  }
  if (statement.type !== 'VariableDeclaration') return [];
  return statement.declarations
    .filter((declarator) => declarator.init && FUNCTION_INITS.has(declarator.init.type))
    .map((declarator) => declarator.id.name ?? '(destructured)');
}
