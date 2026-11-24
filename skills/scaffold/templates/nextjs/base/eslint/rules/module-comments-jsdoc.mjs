/**
 * Requires comments at module level (outside any function body) to be JSDoc
 * blocks. Tool directives such as eslint-disable and @ts-expect-error pass.
 */
const FUNCTION_TYPES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression']);
const DIRECTIVE = /^\s*(eslint|@ts-|global\s|globals\s|istanbul|c8\s|prettier-ignore|\/\s*<reference)/;

const rule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Module-level comments must be JSDoc' },
    schema: [],
    messages: {
      useJsdoc: 'Module-level comments must be JSDoc (/** ... */). Delete it if it only restates the code.',
    },
  },
  create(context) {
    const { sourceCode } = context;

    const insideFunction = (node) => {
      for (let current = node; current; current = current.parent) {
        if (FUNCTION_TYPES.has(current.type)) return true;
      }
      return false;
    };

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (comment.type === 'Shebang') continue;
          if (comment.type === 'Block' && comment.value.startsWith('*')) continue;
          if (DIRECTIVE.test(comment.value)) continue;
          if (insideFunction(sourceCode.getNodeByRangeIndex(comment.range[0]))) continue;
          context.report({ loc: comment.loc, messageId: 'useJsdoc' });
        }
      },
    };
  },
};

export default rule;
