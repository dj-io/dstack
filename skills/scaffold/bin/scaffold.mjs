#!/usr/bin/env node
/**
 * Copies a recipe's base template plus any layers into a new project folder,
 * fills in the name, and copies the conventions skills listed in the recipe's
 * conventions.json into AGENTS.md, in order.
 * Everything that should come out the same on every run happens here, so the
 * agent only writes what is specific to the project.
 *
 * Usage: node scaffold.mjs --recipe nextjs --name my-site --target ../my-site [--layers auth,docs]
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const SKILL_DIR = path.resolve(import.meta.dirname, '..');
const SKILLS_ROOT = path.resolve(SKILL_DIR, '..');
const TEXT_EXTENSIONS = new Set(['.json', '.ts', '.tsx', '.mjs', '.js', '.md', '.mdx', '.css', '.example', '']);
const RENAMES = { _gitignore: '.gitignore', '_env.example': '.env.example' };

const fail = (message) => {
  console.error(`scaffold: ${message}`);
  process.exit(1);
};

const { values } = parseArgs({
  options: {
    recipe: { type: 'string' },
    name: { type: 'string' },
    target: { type: 'string' },
    layers: { type: 'string', default: '' },
  },
});

const { recipe, name } = values;
if (!recipe || !name || !values.target) fail('--recipe, --name and --target are required');
if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) fail(`"${name}" is not a valid package name (lowercase letters, digits, dashes)`);

const target = path.resolve(values.target);
const layers = values.layers.split(',').map((layer) => layer.trim()).filter(Boolean);
const recipeDir = path.join(SKILL_DIR, 'templates', recipe);

if (!existsSync(path.join(recipeDir, 'base'))) fail(`no templates for recipe "${recipe}"`);
for (const layer of layers) {
  const layerDir = path.join(recipeDir, layer);
  if (layer === 'base' || !existsSync(layerDir) || !statSync(layerDir).isDirectory()) {
    fail(`recipe "${recipe}" has no layer "${layer}"`);
  }
}
if (existsSync(target) && readdirSync(target).length > 0) fail(`${target} exists and is not empty`);

const listFiles = (dir, prefix = '') =>
  readdirSync(dir).flatMap((entry) => {
    const relative = path.join(prefix, entry);
    return statSync(path.join(dir, entry)).isDirectory() ? listFiles(path.join(dir, entry), relative) : [relative];
  });

/* Layers add files on top of base. A layer may replace a base file, but two layers may not replace the same one. */
const owners = new Map();
for (const layer of layers) {
  for (const file of listFiles(path.join(recipeDir, layer))) {
    if (file === 'layer.json') continue;
    if (owners.has(file)) fail(`layers "${owners.get(file)}" and "${layer}" both provide ${file}`);
    owners.set(file, layer);
  }
}

mkdirSync(target, { recursive: true });
cpSync(path.join(recipeDir, 'base'), target, { recursive: true });

const packageJsonPath = path.join(target, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

for (const layer of layers) {
  const layerDir = path.join(recipeDir, layer);
  cpSync(layerDir, target, { recursive: true, filter: (source) => path.basename(source) !== 'layer.json' });
  const manifestPath = path.join(layerDir, 'layer.json');
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  for (const field of ['dependencies', 'devDependencies']) {
    packageJson[field] = { ...packageJson[field], ...manifest[field] };
  }
}

const sortKeys = (object) => Object.fromEntries(Object.entries(object ?? {}).sort(([a], [b]) => a.localeCompare(b)));
packageJson.dependencies = sortKeys(packageJson.dependencies);
packageJson.devDependencies = sortKeys(packageJson.devDependencies);
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

for (const [from, to] of Object.entries(RENAMES)) {
  if (existsSync(path.join(target, from))) renameSync(path.join(target, from), path.join(target, to));
}

const conventionsListPath = path.join(recipeDir, 'conventions.json');
const conventionSkills = existsSync(conventionsListPath) ? JSON.parse(readFileSync(conventionsListPath, 'utf8')) : [];
const conventions = conventionSkills
  .map((skill) => {
    const rulesPath = path.join(SKILLS_ROOT, skill, 'rules.md');
    if (!existsSync(rulesPath)) fail(`conventions.json names "${skill}", but ${rulesPath} does not exist`);
    return readFileSync(rulesPath, 'utf8').trim();
  })
  .join('\n\n');

for (const file of listFiles(target)) {
  if (!TEXT_EXTENSIONS.has(path.extname(file))) continue;
  const filePath = path.join(target, file);
  const original = readFileSync(filePath, 'utf8');
  const replaced = original.replaceAll('__APP_NAME__', name).replaceAll('__CONVENTIONS__', conventions);
  if (replaced !== original) writeFileSync(filePath, replaced);
}

const record = { recipe, layers, scaffoldedAt: new Date().toISOString().slice(0, 10) };
writeFileSync(path.join(target, 'dstack.json'), `${JSON.stringify(record, null, 2)}\n`);

console.log(`scaffold: wrote ${recipe}${layers.length ? ` + ${layers.join(', ')}` : ''} to ${target}`);
