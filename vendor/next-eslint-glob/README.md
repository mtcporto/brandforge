# Next.js ESLint glob adapter

The Next.js ESLint plugin uses `fast-glob.globSync` to expand `settings.next.rootDir`.
This adapter implements that specific call using tinyglobby, avoiding the vulnerable
braces dependency (GHSA-vfj7-8cjw-p6xm). It preserves absolute paths and strips the
directory suffix returned by tinyglobby, matching the output expected by Next.js.

The npm override is restricted to `@next/eslint-plugin-next`. This is not a general
replacement for every fast-glob API. Remove it when the upstream dependency no
longer includes vulnerable braces, and recheck compatibility on Next.js upgrades.
