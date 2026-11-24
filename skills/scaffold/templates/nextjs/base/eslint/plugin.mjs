import exportFirst from './rules/export-first.mjs';
import maxModuleHelpers from './rules/max-module-helpers.mjs';
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
    'export-first': exportFirst,
    'max-module-helpers': maxModuleHelpers,
    'max-raw-elements': maxRawElements,
    'module-comments-jsdoc': moduleCommentsJsdoc,
    'one-export-per-file': oneExportPerFile,
  },
};

export default plugin;
