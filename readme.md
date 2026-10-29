# view-page

国土数値情報などのオープンデータをもとに作ったGISビューア群を、
ひとつのサイトにまとめて公開するためのホームページ(サイトルート)。

## 紹介

トップページはギャラリー形式で、公開中のビューアをカード一覧で表示する。カードをクリックすると
各ビューアのページに遷移する。

- ホームページ本体: このリポジトリ(素のHTML/CSS/JS、Viteでビルド)
- 掲載サイトの追加・編集: [src/sites.js](src/sites.js) の配列に1件追記するだけでよい
- 現在掲載中のビューア:
  - **バスルート表示**(`/busroute`) — 実体は別リポジトリで開発しているアプリ。ビルド時にこのリポジトリへコピーして同居させている(詳細は下記)
  - **令制国・郡・現代行政区域**(`/ryoseikoku/`) — 実体は別リポジトリ`kokumei-eki`。`overlay.html`とビルド済みの`overlay.pmtiles`だけをビルド時にコピーして同居させている(タイル生成は`kokumei-eki`側)
  - **歴史行政区域ビューア**(`/historical-region/`) — 実体は別リポジトリ`kokudo-historical-region`。1920〜2026年の行政区域を時点スライダーで見て、合併・改称・分割をたどる。そのリポジトリでビルドした`dist/`を、ビルド時にコピーして同居させている(データ変換・タイル生成は`kokudo-historical-region`側)

## ディレクトリ構成

```
view-page/
├── index.html          # トップページ
├── src/
│   ├── main.js          # ギャラリー描画・Aboutダイアログのロジック
│   ├── sites.js         # 掲載サイト一覧(ここに追記して増やす)
│   └── style.css
├── scripts/
│   ├── sync-busroute.mjs    # bus-routeをビルドしてpublic/busrouteへコピーするスクリプト
│   ├── sync-ryoseikoku.mjs  # kokumei-eki(令制国)のoverlay.htmlとoverlay.pmtilesをpublic/ryoseikokuへコピー(ビルドはしない)
│   └── sync-historical-region.mjs  # kokudo-historical-regionをビルドし、そのdistをpublic/historical-regionへコピー
├── public/
│   ├── busroute/         # ↑sync-busroute.mjsが生成する(gitignore対象、手元には無いことがある)
│   ├── ryoseikoku/       # ↑sync-ryoseikoku.mjsが生成する(gitignore対象)
│   └── historical-region/  # ↑sync-historical-region.mjsが生成する(gitignore対象)
└── vite.config.js
```

## 起動方法

前提: `pnpm`(mise管理。`node -v && pnpm -v`で確認可能)。初回のみ依存関係のインストールが必要。

```bash
cd ~/dir/to/view-page
pnpm install
```

### 開発サーバー

```bash
pnpm run dev
```

- **http://localhost:5173** が立ち上がる
- ホームページ自体(カード一覧・Aboutダイアログ)の確認はこれで十分
- ただし`/busroute`・`/ryoseikoku/`・`/historical-region/`へのリンクは、`public/busroute`・`public/ryoseikoku`・`public/historical-region`が存在しない限り開発サーバー上では404になる(下記の`build:busroute`・`build:ryoseikoku`・`build:historical-region`でコピーできる)

停止は起動したターミナルで`Ctrl+C`。バックグラウンドで残ってしまった場合:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN   # PIDを確認
kill <PID>
```

### 本番ビルド(bus-route・令制国ページ込みの完全な静的サイトを生成)

```bash
pnpm run build
```

内部で以下を順番に実行する:

1. `scripts/sync-busroute.mjs` — 隣の`kokudo-suchi-view`リポジトリで`bus-route`をビルドし、成果物を`public/busroute`にコピー
2. `scripts/sync-ryoseikoku.mjs` — 隣の`kokumei-eki`リポジトリの`overlay.html`と`data/overlay/overlay.pmtiles`を`public/ryoseikoku`にコピー(**ビルドはしない**。pmtilesが無い場合は先に`kokumei-eki`で`pnpm build:overlay`を実行する)
3. `scripts/sync-historical-region.mjs` — 隣の`kokudo-historical-region`リポジトリで`pnpm build`(Viteのみ)を実行し、その`dist/`を`public/historical-region`にコピー(**データ変換はしない**。`build/site`が無い場合は先に`kokudo-historical-region`で`.venv/bin/python -I scripts/prepare_site.py`を実行する)
4. `vite build` — ホームページ本体をビルド

結果として `dist/` 配下に、トップページ(`index.html`)、`busroute/`(バスルートアプリ一式)、`ryoseikoku/`(令制国・郡・現代行政区域ページ)、`historical-region/`(歴史行政区域ビューア)を含む、**そのままGitHub Pagesにデプロイできる単一の静的ディレクトリ**ができる。

ビルド結果をローカルで確認する場合:

```bash
pnpm run preview
```

`bus-route`だけを個別にビルドしたい場合(ホームページ本体はビルドしない):

```bash
pnpm run build:busroute
```

令制国ページだけをコピーしたい場合:

```bash
pnpm run build:ryoseikoku
```

歴史行政区域ビューアだけをビルド・コピーしたい場合:

```bash
pnpm run build:historical-region
```

### 歴史行政区域ビューア(`/historical-region/`)を更新する流れ

`kokudo-historical-region`が正で、ここはビルド結果を受け取るだけ。データや画面を直したときの手順:

```bash
# 1. kokudo-historical-region 側でデータを作り直す(画面(app/)だけの変更なら不要)
#    タイルを作り直したときは build_tiles.py の後に prepare_site.py を実行する(README参照)
cd ~/Documents/jss/kokudo-historical-region
.venv/bin/python -I scripts/prepare_site.py

# 2. view-page 側でビルド+コピー → 手元で確認
cd ~/Documents/jss/view-page
pnpm run build
pnpm run preview              # http://localhost:4173/historical-region/ を開く(末尾の/が必要)
```

### 令制国ページ(`/ryoseikoku/`)を更新する流れ

データや`overlay.html`を直したときの手順(`kokumei-eki`が正、ここはコピーを受け取るだけ):

```bash
# 1. kokumei-eki 側でタイルを作り直す(overlay.htmlだけの変更ならこの手順は不要)
cd ~/Documents/jss/kokumei-eki
pnpm build:overlay            # 郡だけなら node scripts/build-overlay-data.mjs gun && pnpm build:overlay-tiles

# 2. view-page 側でコピー+ビルド → 手元で確認
cd ~/Documents/jss/view-page
pnpm run build
pnpm run preview              # http://localhost:4173/ryoseikoku/ を開く(末尾の/が必要)
```

ギャラリーのサムネイルを仮SVGから実画像に替える場合: 画面のスクリーンショットを
`kokumei-eki/overlay-cover.jpg`に置き(`sync-ryoseikoku.mjs`が`cover.jpg`としてコピーする)、
[src/sites.js](src/sites.js)の該当エントリに `thumbnail: "/ryoseikoku/cover.jpg",` を追加する。

## 公開(GitHub Pages)

`dist/`をリモートの`gh-pages`ブランチへ公開している(`gh-pages`パッケージ)。コミット・pushは手作業:

```bash
# 1. ソースの変更を main にコミット・push(public/ryoseikoku・public/historical-region と dist は gitignore 済みで含まれない)
git status
git add -A
git commit -m "add historical-region page"   # 例。内容に合わせて変える
git push origin main

# 2. ビルド済みの dist/ を gh-pages ブランチへ公開
pnpm run build
pnpm exec gh-pages -d dist -m "Update site"
```

`public/busroute`(約107MB)や`overlay.pmtiles`(約18MB)はバイナリで、更新のたびに丸ごと履歴に積み上がる。
`gh-pages`ブランチの履歴は不要なので、肥大を避けたい場合は履歴を残さない公開にできる
(親コミットなしで強制pushする。`dist/`はいつでも再生成できるので問題ない):

```bash
pnpm exec gh-pages -d dist -m "Update site" --no-history
```

公開後のURL(末尾の`/`が必要):

- https://kscsproj.github.io/ryoseikoku/
- https://kscsproj.github.io/historical-region/

## 注意事項 

### 免責事項

本プロジェクトは国土数値情報のバス停、バスルート情報を加工、配布していますが、完全な正確性には担保しておりません。

### 生成AIの使用について

本プロジェクトには生成AIを使用しています。

### データライセンスについて

本プロジェクトは国土数値情報のデータを加工して配布しています。利用する際には国土数値情報の[利用規約](https://nlftp.mlit.go.jp/ksj/other/agreement.html)を従ってください. 

令制国・郡・現代行政区域ページ(`/ryoseikoku/`)は、次のデータを加工して配布しています。

| データ | 提供 | ライセンス |
|---|---|---|
| [幕末明治地勢地図境界データ](https://bridge.nihu.jp/accumulateddata_detail/18045150)(令制国・郡境界) | 人間文化研究機構 | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.ja) |
| [国土数値情報 行政区域データ N03-20260101](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html) | 国土交通省 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja) |

**幕末明治地勢地図境界データはCC BY-NC(非営利)です。** このデータから作ったタイル(`overlay.pmtiles`)を
含むこのサイトの公開は非営利の範囲に限り、広告収益や有料サービスへの組み込みなどの商用利用はできません。

歴史行政区域ビューア(`/historical-region/`)は、次のデータを加工して配布しています。
このページは、上の CC BY-NC のデータを含みません。

| データ | 提供 | ライセンス |
|---|---|---|
| [国土数値情報 行政区域データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html)(1920〜2026年の各年版)を加工 | 国土交通省 | 2018年版以降は[利用規約](https://nlftp.mlit.go.jp/ksj/other/agreement_01.html)(CC BY 4.0 と互換)、それ以前は「商用可」の[利用規約](https://nlftp.mlit.go.jp/ksj/other/agreement.html) |
| [地理院タイル(淡色地図)](https://maps.gsi.go.jp/development/ichiran.html)(背景) | 国土地理院 | 出典の表示 |

各年版の原典と国土地理院長の承認表示は、ビューアの「出典・ご利用にあたって」に載せています。
前後の版(合併・改称・分割など)は面積の重なりから機械的に推定したもので、公式の沿革ではありません。
