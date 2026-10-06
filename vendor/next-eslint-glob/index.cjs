/* eslint-disable -- This standalone CommonJS compatibility package is validated by its Node integration test. */
const path = require("node:path");
const { globSync: tinyGlobSync } = require("tinyglobby");

// Next's ESLint plugin uses only globSync(pattern, { onlyDirectories: true }).
// Preserve fast-glob's absolute paths and directory output without braces.
function globSync(pattern, options = {}) {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const absolute = options.absolute ?? patterns.some((value) => path.isAbsolute(value));
  return tinyGlobSync(pattern, { ...options, absolute }).map((value) =>
    options.onlyDirectories ? value.replace(/\/$/, "") || "/" : value,
  );
}

module.exports = { globSync, sync: globSync };
