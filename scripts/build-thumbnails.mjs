#!/usr/bin/env node
// Generate 600px-wide JPEG thumbnails for every image in data/gallery.json.
// Output: images/gallery/thumbs/{year}/{filename} (gitignored, regenerated on deploy).
// Skips files whose thumbnail is already newer than the source image.
//
// Run via `bun run build:thumbs` (also called by `bun run build`).

import { readFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const THUMB_WIDTH = 600;

const photos = JSON.parse(readFileSync(join(ROOT, "data/gallery.json"), "utf8"));

const seen = new Set();
const tasks = [];
for (const p of photos) {
  if (seen.has(p.src)) continue;
  seen.add(p.src);
  const thumbRel = p.src.replace("images/gallery/", "images/gallery/thumbs/");
  tasks.push({ src: join(ROOT, p.src), thumb: join(ROOT, thumbRel), rel: thumbRel });
}

let built = 0,
  skipped = 0;
for (const { src, thumb, rel } of tasks) {
  if (existsSync(thumb) && statSync(thumb).mtimeMs >= statSync(src).mtimeMs) {
    skipped++;
    continue;
  }
  mkdirSync(dirname(thumb), { recursive: true });
  await sharp(src).resize(THUMB_WIDTH).jpeg({ quality: 80, progressive: true }).toFile(thumb);
  console.log(`✓ ${rel}`);
  built++;
}

console.log(`Thumbnails: ${built} built, ${skipped} up-to-date`);
