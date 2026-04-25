import { readFileSync, writeFileSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';
import { globSync } from 'fs';

const STABLE_HASH = 'stable';
const DOCS = join(import.meta.dirname, '../../../docs');

const manifestGlob = globSync(join(DOCS, 'static-loader-data-manifest-*.json'));
if (manifestGlob.length === 0) process.exit(0);

const manifestPath = manifestGlob[0];
const hash = manifestPath.match(/static-loader-data-manifest-(.+)\.json$/)[1];

if (hash === STABLE_HASH) process.exit(0);

// Rename static-loader-data/{page}.{hash}.json → {page}.stable.json
const dataDir = join(DOCS, 'static-loader-data');
const dataFiles = globSync(join(dataDir, `*.${hash}.json`));
for (const f of dataFiles) {
  renameSync(f, f.replace(`.${hash}.json`, `.${STABLE_HASH}.json`));
}

// Update manifest content and rename it
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8').replaceAll(hash, STABLE_HASH));
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(
  join(DOCS, `static-loader-data-manifest-${STABLE_HASH}.json`),
  JSON.stringify(sorted)
);
unlinkSync(manifestPath);

// Update HTML files: replace the injected hash
const htmlFiles = globSync(join(DOCS, '**/*.html'));
for (const f of htmlFiles) {
  const content = readFileSync(f, 'utf8');
  if (content.includes(hash)) {
    writeFileSync(f, content.replaceAll(hash, STABLE_HASH));
  }
}
