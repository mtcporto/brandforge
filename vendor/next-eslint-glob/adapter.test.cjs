/* eslint-disable -- This standalone CommonJS compatibility package is validated by its Node integration test. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { getRootDirs } = require('@next/eslint-plugin-next/dist/utils/get-root-dirs');

test('Next rootDir preserves default, absolute, relative and array directory paths', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'next-eslint-glob-'));
  const one = path.join(root, 'apps', 'one');
  const two = path.join(root, 'apps', 'two');
  fs.mkdirSync(one, { recursive: true });
  fs.mkdirSync(two, { recursive: true });
  fs.writeFileSync(path.join(root, 'apps', 'file.txt'), 'not a directory');
  try {
    assert.deepEqual(getRootDirs({ cwd: root, settings: {} }), [root]);
    assert.deepEqual(getRootDirs({ cwd: root, settings: { next: { rootDir: root + '/apps/*' } } }).sort(), [one, two]);
    assert.deepEqual(getRootDirs({ cwd: root, settings: { next: { rootDir: [one, two] } } }).sort(), [one, two]);
    const relative = path.relative(process.cwd(), root).replaceAll('\\', '/');
    assert.deepEqual(getRootDirs({ cwd: root, settings: { next: { rootDir: relative + '/apps/*' } } }).sort(), [relative + '/apps/one', relative + '/apps/two']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
