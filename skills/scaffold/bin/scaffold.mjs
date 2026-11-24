#!/usr/bin/env node
/**
 * Copies a recipe's base template plus any layers into a new project folder.
 * Everything that should come out the same on every run happens here, so the
 * agent only writes what is specific to the project.
 *
 * Usage: node scaffold.mjs --recipe fastapi --name my-api --target ../my-api [--layers graphql,auth]
 *
 * Template features:
 * - Layers: folders next to base/ whose files are copied on top of it. Two layers may not provide the same file.
 * - Combinations: a folder named `a+b` is applied when layers a and b are both chosen. It may replace files from a or b.
 * - layer.json: `requires` (other layers it needs), `slots` (lines to put at slot markers), and for Node
 *   recipes, `dependencies`/`devDependencies` merged into package.json.
 * - Slots: a line holding only `__SLOT_NAME__` is replaced by every layer's lines for that slot, indented
 *   to match, or removed when no layer fills it.
 * - `__APP_NAME__` and `__CONVENTIONS__` are filled everywhere. The conventions are the rules.md files of
 *   the skills listed in the recipe's conventions.json, in order.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const SKILL_DIR = path.resolve(import.meta.dirname, '..');
const SKILLS_ROOT = path.resolve(SKILL_DIR, '..');
const TEXT_EXTENSIONS = new Set([
  '', '.css', '.example', '.ini', '.js', '.json', '.mako', '.md', '.mdx', '.mjs', '.py', '.toml', '.ts', '.tsx', '.yaml', '.yml',
]);
const RENAMES = {
  _gitignore: '.gitignore',
  _dockerignore: '.dockerignore',
  '_env.example': '.env.example',
  '_python-version': '.python-version',
};
const SLOT_LINE = /^(\s*)(__[A-Z][A-Z0-9_]*__)\s*$/;

const options = readOptions();
const recipe = loadRecipe(options);
assertEmptyTarget(options.target);
assertNoSharedFiles(recipe);
copyTemplates(recipe, options.target);
mergePackageJson(recipe, options.target);
renameDotfiles(options.target);
fillPlaceholders(recipe, options);
writeRecord(recipe, options);
console.log(`scaffold: wrote ${recipe.name}${recipe.layers.length ? ` + ${recipe.layers.map((layer) => layer.name).join(', ')}` : ''} to ${options.target}`);

function readOptions() {
  const { values } = parseArgs({
    options: {
      recipe: { type: 'string' },
      name: { type: 'string' },
      target: { type: 'string' },
      layers: { type: 'string', default: '' },
    },
  });
  if (!values.recipe || !values.name || !values.target) fail('--recipe, --name and --target are required');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(values.name)) fail(`"${values.name}" is not a valid name (lowercase letters, digits, dashes)`);
  return {
    recipe: values.recipe,
    name: values.name,
    target: path.resolve(values.target),
    layers: values.layers.split(',').map((layer) => layer.trim()).filter(Boolean),
  };
}

function loadRecipe({ recipe, layers }) {
  const dir = path.join(SKILL_DIR, 'templates', recipe);
  if (!existsSync(path.join(dir, 'base'))) fail(`no templates for recipe "${recipe}"`);
  for (const name of layers) {
    const layerDir = path.join(dir, name);
    if (name === 'base' || name.includes('+') || !existsSync(layerDir) || !statSync(layerDir).isDirectory()) {
      fail(`recipe "${recipe}" has no layer "${name}"`);
    }
  }
  const chosen = layers.map((name) => loadOverlay(dir, name));
  for (const layer of chosen) {
    const missing = (layer.manifest.requires ?? []).filter((required) => !layers.includes(required));
    if (missing.length) fail(`layer "${layer.name}" requires ${missing.map((name) => `"${name}"`).join(', ')}`);
  }
  const combos = readdirSync(dir)
    .filter((entry) => entry.includes('+') && entry.split('+').every((part) => layers.includes(part)))
    .sort()
    .map((name) => ({ ...loadOverlay(dir, name), parts: name.split('+') }));
  return { name: recipe, dir, layers: chosen, combos, overlays: [...chosen, ...combos] };
}

function loadOverlay(recipeDir, name) {
  const dir = path.join(recipeDir, name);
  const manifestPath = path.join(dir, 'layer.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  return { name, dir, manifest, files: listFiles(dir).filter((file) => file !== 'layer.json') };
}

function assertEmptyTarget(target) {
  if (existsSync(target) && readdirSync(target).length > 0) fail(`${target} exists and is not empty`);
}

/* Layers may replace base files but not each other's. A combination may replace files from its own parts only. */
function assertNoSharedFiles(recipe) {
  const owners = new Map();
  for (const overlay of recipe.overlays) {
    for (const file of overlay.files) {
      const owner = owners.get(file);
      if (owner && !(overlay.parts ?? []).includes(owner)) fail(`"${owner}" and "${overlay.name}" both provide ${file}`);
      owners.set(file, overlay.name);
    }
  }
}

function copyTemplates(recipe, target) {
  mkdirSync(target, { recursive: true });
  cpSync(path.join(recipe.dir, 'base'), target, { recursive: true });
  for (const overlay of recipe.overlays) {
    cpSync(overlay.dir, target, { recursive: true, filter: (source) => path.basename(source) !== 'layer.json' });
  }
}

function mergePackageJson(recipe, target) {
  const packageJsonPath = path.join(target, 'package.json');
  if (!existsSync(packageJsonPath)) return;
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  for (const field of ['dependencies', 'devDependencies']) {
    const merged = Object.assign({}, packageJson[field], ...recipe.overlays.map((overlay) => overlay.manifest[field]));
    packageJson[field] = Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
  }
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function renameDotfiles(target) {
  for (const [from, to] of Object.entries(RENAMES)) {
    if (existsSync(path.join(target, from))) renameSync(path.join(target, from), path.join(target, to));
  }
}

function fillPlaceholders(recipe, { name, target }) {
  const conventions = readConventions(recipe);
  const slots = collectSlots(recipe);
  const used = new Set();
  for (const file of listFiles(target)) {
    if (!TEXT_EXTENSIONS.has(path.extname(file))) continue;
    const filePath = path.join(target, file);
    const original = readFileSync(filePath, 'utf8');
    const named = original.replaceAll('__APP_NAME__', name).replaceAll('__CONVENTIONS__', conventions);
    const filled = fillSlots(named, slots, used);
    if (filled !== original) writeFileSync(filePath, filled);
  }
  const unused = [...slots.keys()].filter((slot) => !used.has(slot));
  if (unused.length) fail(`layers fill slots no template has: ${unused.join(', ')}`);
}

function readConventions(recipe) {
  const listPath = path.join(recipe.dir, 'conventions.json');
  const skills = existsSync(listPath) ? JSON.parse(readFileSync(listPath, 'utf8')) : [];
  return skills
    .map((skill) => {
      const rulesPath = path.join(SKILLS_ROOT, skill, 'rules.md');
      if (!existsSync(rulesPath)) fail(`conventions.json names "${skill}", but ${rulesPath} does not exist`);
      return readFileSync(rulesPath, 'utf8').trim();
    })
    .join('\n\n');
}

function collectSlots(recipe) {
  const slots = new Map();
  for (const overlay of recipe.overlays) {
    for (const [slot, lines] of Object.entries(overlay.manifest.slots ?? {})) {
      slots.set(slot, [...(slots.get(slot) ?? []), ...lines]);
    }
  }
  return slots;
}

function fillSlots(text, slots, used) {
  return text
    .split('\n')
    .flatMap((line) => {
      const match = SLOT_LINE.exec(line);
      if (!match) return [line];
      const [, indent, slot] = match;
      used.add(slot);
      return (slots.get(slot) ?? []).map((filled) => `${indent}${filled}`);
    })
    .join('\n');
}

function writeRecord(recipe, { target }) {
  const record = {
    recipe: recipe.name,
    layers: recipe.layers.map((layer) => layer.name),
    scaffoldedAt: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(path.join(target, 'dstack.json'), `${JSON.stringify(record, null, 2)}\n`);
}

function listFiles(dir, prefix = '') {
  return readdirSync(dir).flatMap((entry) => {
    const relative = path.join(prefix, entry);
    return statSync(path.join(dir, entry)).isDirectory() ? listFiles(path.join(dir, entry), relative) : [relative];
  });
}

function fail(message) {
  console.error(`scaffold: ${message}`);
  process.exit(1);
}
