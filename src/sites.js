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
];
