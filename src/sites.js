// ギャラリーに表示するサイト一覧。今後増えたらここに追記していく。
//
// thumbnail: 実画像のパス(bus-routeの場合は public/cover.jpg 由来。
//   kokudo-suchi-view/bus-route/public/cover.jpg → (ビルド) → bus-route/dist/cover.jpg
//   → (scripts/sync-busroute.mjs) → view-page/public/busroute/cover.jpg
//   という経路で永続化しているので、pnpm run build を繰り返しても消えない)
// thumbnailColors: 実画像が無いサイト用のフォールバック(抽象SVGを生成する)
export const SITES = [
  {
    category: "国土数値情報",
    title: "バスルート表示",
    href: "/busroute/",
    thumbnail: "/busroute/cover.jpg",
    thumbnailColors: ["#2f6fed", "#e0422b", "#1f9d6b", "#c98a1f"],
  },
  {
    // 実体は別リポジトリ(kokumei-eki)。scripts/sync-ryoseikoku.mjs でビルド時にコピーする。
    // サムネイルは仮のSVG(令制国=暖色、現代行政区域=寒色)。画面のスクリーンショットが
    // できたら kokumei-eki/overlay-cover.jpg に置き、ここに thumbnail: "/ryoseikoku/cover.jpg"
    // を追加する(sync-ryoseikoku.mjs が cover.jpg としてコピーする。readme.md参照)。
    category: "歴史地理",
    title: "令制国・郡・現代行政区域",
    href: "/ryoseikoku/",
    thumbnailColors: ["#e76f51", "#f6d58e", "#d98cb3", "#1f5fa6", "#4a90c2"],
  },
  {
    // 実体は別リポジトリ(kokudo-historical-region)。scripts/sync-historical-region.mjs でビルド時にコピーする。
    // サムネイルは仮のSVG。画面のスクリーンショットができたら kokudo-historical-region/cover.jpg に置いて
    // そちらで scripts/prepare_site.py を実行する(build/site/cover.jpg → dist → public/historical-region/cover.jpg
    // と渡る)。ここに thumbnail: "/historical-region/cover.jpg" を追加する。
    category: "歴史地理",
    title: "歴史行政区域ビューア",
    href: "/historical-region/",
    thumbnailColors: ["#2f6fed", "#e8590c", "#8fb8de", "#a8d5a2", "#f2c879"],
  },
];
