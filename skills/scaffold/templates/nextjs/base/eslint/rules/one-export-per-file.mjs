/**
 * Allows one runtime export per module. Type-only exports erase at build time,
 * so they don't count. With `onlyNames`, the file may export only those names
 * (Next.js convention files such as page.tsx, where the framework fixes them).
 */
const rule = {
  meta: {
    type: 'problem',
    docs: { description: 'Allow at most one module-level runtime export per file' },
    schema: [
      {
        type: 'object',
        properties: { onlyNames: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooMany: 'One module-level export per file. "{{name}}" is export #{{count}}; move it into its own file.',
      notFramework: '"{{name}}" is not a framework export for this file. Move it into its own module.',
    },
  },
  create(context) {
    const onlyNames = context.options[0]?.onlyNames;
    const exported = [];

    const isTypeOnly = (declaration) =>
      declaration.type === 'TSTypeAliasDeclaration' ||
      declaration.type === 'TSInterfaceDeclaration' ||
      declaration.declare === true;

    const collectDeclaration = (declaration, node) => {
      if (isTypeOnly(declaration)) return;
      if (declaration.type === 'VariableDeclaration') {
        for (const declarator of declaration.declarations) {
          exported.push({ name: declarator.id.name ?? '(destructured)', node });
        }
        return;
      }
      exported.push({ name: declaration.id?.name ?? '(anonymous)', node });
    };

    return {
      ExportNamedDeclaration(node) {
        if (node.exportKind === 'type') return;
        if (node.declaration) collectDeclaration(node.declaration, node);
        for (const specifier of node.specifiers) {
          if (specifier.exportKind === 'type') continue;
          exported.push({ name: specifier.exported.name ?? specifier.exported.value, node: specifier });
        }
      },
      ExportDefaultDeclaration(node) {
        exported.push({ name: 'default', node });
      },
      ExportAllDeclaration(node) {
        if (node.exportKind !== 'type') exported.push({ name: '*', node });
      },
      'Program:exit'() {
        if (onlyNames) {
          for (const { name, node } of exported) {
            if (!onlyNames.includes(name)) context.report({ node, messageId: 'notFramework', data: { name } });
          }
          return;
        }
        exported.slice(1).forEach(({ name, node }, index) => {
          context.report({ node, messageId: 'tooMany', data: { name, count: String(index + 2) } });
        });
      },
    };
  },
};

export default rule;
