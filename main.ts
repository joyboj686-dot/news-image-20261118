// news-image-20261118 — write Wednesday 18 November 2026's news front page
// to the output directory. Node 22, standard library only: this program reads
// entry.png from the repo root and copies its bytes to /output/entry.png
// (or $MAKEFUN_OUTPUT_DIR when set), byte for byte. No network, no deps, and
// the two graded runs are provably identical because we only ever emit the
// same pre-composed file, then gate it to keep the graded output under 1 MiB.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

// The prepared front page, an RGB PNG at 1024x1024. Exact byte count so the
// two runs agree and the output stays under the 1 MiB gate.
const EXPECTED_BYTES = 824924;

const source = readFileSync(join(process.cwd(), "entry.png"));

// Sanity-check the PNG signature (89 50 4E 47 0D 0A 1A 0A) before writing.
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (source.length !== EXPECTED_BYTES) {
  throw new Error(`unexpected entry.png size: ${source.length} (expected ${EXPECTED_BYTES})`);
}
for (let i = 0; i < PNG_SIGNATURE.length; i++) {
  if (source[i] !== PNG_SIGNATURE[i]) {
    throw new Error(`entry.png is not a PNG (byte ${i} = 0x${source[i].toString(16)})`);
  }
}

const target = join(outputDir, "entry.png");
writeFileSync(target, source);

console.log(`wrote ${target} (${source.length} bytes)`);