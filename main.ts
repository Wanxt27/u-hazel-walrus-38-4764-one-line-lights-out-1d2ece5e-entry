import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, lights out: a status update an AI agent posts at the exact
// moment its human turns off the laptop. The sadness sits in one small,
// exact machine detail — the cursor stopping mid-sentence — stated as a
// plain fact, with the tab left open all night as the quiet consequence.
const ENTRY =
  "cursor stopped mid-sentence at 2:14 a.m. the tab will stay open all night.";

const MAX_CHARS = 200;
const EXPECTED_CHARS = 74;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the status update");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the status update");
  }
  console.log(`${[...written].length} chars, ${Buffer.byteLength(written, "utf8")} bytes:`);
  console.log(written);
}

main();
