/**
 * Caps raw (intrinsic) JSX elements like <div> and <span> per file. Anything
 * past the cap should be a named component, so the tree reads like the UI.
 */
const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Limit raw HTML elements per file; name the rest as components' },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 0 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooMany: 'More than {{max}} raw elements in this file. Extract <{{tag}}> and its siblings into a named component.',
    },
  },
  create(context) {
    const max = context.options[0]?.max ?? 3;
    let count = 0;

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        if (!/^[a-z]/.test(node.name.name)) return;
        count += 1;
        if (count > max) {
          context.report({ node, messageId: 'tooMany', data: { max: String(max), tag: node.name.name } });
        }
      },
    };
  },
};

export default rule;
