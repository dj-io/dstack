import maxRawElements from './rules/max-raw-elements.mjs';
import moduleCommentsJsdoc from './rules/module-comments-jsdoc.mjs';
import oneExportPerFile from './rules/one-export-per-file.mjs';

/**
 * Project-local ESLint plugin for the dstack conventions that no published
 * plugin covers. Each rule lives in its own file under ./rules.
 */
const plugin = {
  meta: { name: 'dstack' },
  rules: {
    'max-raw-elements': maxRawElements,
    'module-comments-jsdoc': moduleCommentsJsdoc,
    'one-export-per-file': oneExportPerFile,
  },
};

export default plugin;
