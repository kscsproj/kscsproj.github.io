// kokudo-historical-region(歴史行政区域ビューア)をビルドし、その dist をこのサイトの
// public/historical-region にコピーする。
//
// bus-route(sync-busroute.mjs)と同じく物理的に同居させる。ただし、ビューアが読むデータ
// (build/site: タイル・版テーブル・検索索引)は kokudo-historical-region 側の
// `scripts/prepare_site.py` で作る前提で、ここでは作らない(元データ約24GBからの変換が必要なため)。
// ビューアは相対パスでデータを読むので、サブパス(/historical-region/)配下でもそのまま動く。
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const VIEW_PAGE_ROOT = new URL("..", import.meta.url).pathname;
const SRC_ROOT = join(VIEW_PAGE_ROOT, "../kokudo-historical-region");
const SRC_DIST = join(SRC_ROOT, "dist");
const DEST = join(VIEW_PAGE_ROOT, "public/historical-region");

if (!existsSync(SRC_ROOT)) {
  console.error(`kokudo-historical-region が見つかりません: ${SRC_ROOT}`);
  process.exit(1);
}
if (!existsSync(join(SRC_ROOT, "build/site/region.pmtiles"))) {
  console.error("build/site がありません。先に kokudo-historical-region で次を実行してください:");
  console.error("  .venv/bin/python -I scripts/prepare_site.py");
  process.exit(1);
}

console.log("historical-region をビルド中...");
execFileSync("pnpm", ["build"], { cwd: SRC_ROOT, stdio: "inherit" });

if (!existsSync(SRC_DIST)) {
  console.error(`ビルド成果物が見つかりません: ${SRC_DIST}`);
  process.exit(1);
}

rmSync(DEST, { recursive: true, force: true });
cpSync(SRC_DIST, DEST, { recursive: true });

console.log(`コピー完了: ${SRC_DIST} -> ${DEST}`);
