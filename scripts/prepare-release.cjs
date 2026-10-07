const assert = require('node:assert/strict');
const { cpSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = path.join(root, '.release-package');
const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.equal(manifest.name, '@neosapience/n8n-nodes-typecast');
assert.ok(manifest.overrides, 'Keep development security pins in the source project');
const developmentPins = manifest.overrides;
assert.equal(Object.keys(manifest.dependencies || {}).length, 0);

// Development overrides do not apply to consumers. Validate the actual publish
// package with the unchanged official community rules and pinned parent tooling.
delete manifest.overrides;
delete manifest.devDependencies;
mkdirSync(target);
for (const file of [
  ...manifest.files,
  'eslint.config.mjs',
  'tsconfig.json',
  '.npmrc',
  'CHANGELOG.md',
]) {
  cpSync(path.join(root, file), path.join(target, file), { recursive: true });
}
mkdirSync(path.join(target, 'tests'));
for (const file of ['remove-silence.test.cjs', 'seed-retirement.test.cjs']) {
  cpSync(path.join(root, 'tests', file), path.join(target, 'tests', file));
}
writeFileSync(path.join(target, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
assert.deepEqual(
  JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')).overrides,
  developmentPins,
);
console.log('Prepared .release-package; source development security pins retained');
