// kokumei-eki(令制国・郡・現代行政区域ビューア)の overlay.html とビルド済みの
// overlay.pmtiles を、このサイトの public/ryoseikoku にコピーする。
//
// bus-route(sync-busroute.mjs)と違い、ここではビルドを実行しない。タイルの元データは
// N03(約580MB)などで巨大かつ重く、kokumei-eki側で `pnpm build:overlay` して作る前提。
// overlay.html は pmtiles を相対パス(data/overlay/overlay.pmtiles)で読むため、
// index.html と同じ相対構成でコピーすればサブパス配下でもそのまま動く。
import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const VIEW_PAGE_ROOT = new URL("..", import.meta.url).pathname;
const SRC_ROOT = join(VIEW_PAGE_ROOT, "../kokumei-eki");
const DEST = join(VIEW_PAGE_ROOT, "public/ryoseikoku");

// [コピー元(kokumei-eki内), コピー先(public/ryoseikoku内)]
const FILES = [
  ["overlay.html", "index.html"],
  ["data/overlay/overlay.pmtiles", "data/overlay/overlay.pmtiles"],
];

// あればコピーする(無くてもエラーにしない)。ギャラリーのサムネイル用スクリーンショット。
// public/ryoseikoku は毎回作り直すので、画像の置き場は kokumei-eki 側にする。
const OPTIONAL_FILES = [["overlay-cover.jpg", "cover.jpg"]];

if (!existsSync(SRC_ROOT)) {
  console.error(`kokumei-eki が見つかりません: ${SRC_ROOT}`);
  process.exit(1);
}

for (const [src] of FILES) {
  if (!existsSync(join(SRC_ROOT, src))) {
    console.error(`見つかりません: ${join(SRC_ROOT, src)}`);
    console.error("先に kokumei-eki で `pnpm build:overlay` を実行してタイルを作成してください。");
    process.exit(1);
  }
}

const optional = OPTIONAL_FILES.filter(([src]) => existsSync(join(SRC_ROOT, src)));

rmSync(DEST, { recursive: true, force: true });
for (const [src, dest] of [...FILES, ...optional]) {
  const to = join(DEST, dest);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(join(SRC_ROOT, src), to);
  const mb = (statSync(to).size / 1024 / 1024).toFixed(1);
  console.log(`コピー: ${src} -> public/ryoseikoku/${dest} (${mb}MB)`);
}
