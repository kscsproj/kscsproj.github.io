// kokudo-suchi-view/bus-route をビルドし、その成果物をこのサイトの
// public/busroute にコピーする。GitHub Pagesは静的ファイルしか配信できないため、
// 「/busroute」パスの実体としてビルド済みファイルを物理的に同居させる必要がある。
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const VIEW_PAGE_ROOT = new URL("..", import.meta.url).pathname;
const BUS_ROUTE_PROJECT_ROOT = join(VIEW_PAGE_ROOT, "../kokudo-suchi-view");
const BUS_ROUTE_DIST = join(BUS_ROUTE_PROJECT_ROOT, "bus-route/dist");
const DEST = join(VIEW_PAGE_ROOT, "public/busroute");

if (!existsSync(BUS_ROUTE_PROJECT_ROOT)) {
  console.error(`kokudo-suchi-view が見つかりません: ${BUS_ROUTE_PROJECT_ROOT}`);
  process.exit(1);
}

console.log("bus-route をビルド中...");
execFileSync("pnpm", ["run", "bus-route:build"], {
  cwd: BUS_ROUTE_PROJECT_ROOT,
  stdio: "inherit",
});

if (!existsSync(BUS_ROUTE_DIST)) {
  console.error(`ビルド成果物が見つかりません: ${BUS_ROUTE_DIST}`);
  process.exit(1);
}

rmSync(DEST, { recursive: true, force: true });
cpSync(BUS_ROUTE_DIST, DEST, { recursive: true });

console.log(`コピー完了: ${BUS_ROUTE_DIST} -> ${DEST}`);
