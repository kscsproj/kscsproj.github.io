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

## ディレクトリ構成

```
view-page/
├── index.html          # トップページ
├── src/
│   ├── main.js          # ギャラリー描画・Aboutダイアログのロジック
│   ├── sites.js         # 掲載サイト一覧(ここに追記して増やす)
│   └── style.css
├── scripts/
│   └── sync-busroute.mjs  # bus-routeをビルドしてpublic/busrouteへコピーするスクリプト
├── public/
│   └── busroute/         # ↑スクリプトが生成する(gitignore対象、手元には無いことがある)
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
- ただし`/busroute`へのリンクは、`public/busroute`が存在しない限り開発サーバー上では404になる(下記「bus-routeとの連携」を参照)

停止は起動したターミナルで`Ctrl+C`。バックグラウンドで残ってしまった場合:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN   # PIDを確認
kill <PID>
```

### 本番ビルド(bus-route込みの完全な静的サイトを生成)

```bash
pnpm run build
```

内部で以下を順番に実行する:

1. `scripts/sync-busroute.mjs` — 隣の`kokudo-suchi-view`リポジトリで`bus-route`をビルドし、成果物を`public/busroute`にコピー
2. `vite build` — ホームページ本体をビルド

結果として `dist/` 配下に、トップページ(`index.html`)と `busroute/`(バスルートアプリ一式)を含む、**そのままGitHub Pagesにデプロイできる単一の静的ディレクトリ**ができる。

ビルド結果をローカルで確認する場合:

```bash
pnpm run preview
```

`bus-route`だけを個別にビルドしたい場合(ホームページ本体はビルドしない):

```bash
pnpm run build:busroute
```

## 注意事項 

### 免責事項

本プロジェクトは国土数値情報のバス停、バスルート情報を加工、配布していますが、完全な正確性には担保しておりません。

### 生成AIの使用について

本プロジェクトには生成AIを使用しています。

### データライセンスについて

本プロジェクトは国土数値情報のデータを加工して配布しています。利用する際には国土数値情報の[利用規約](https://nlftp.mlit.go.jp/ksj/other/agreement.html)を従ってください. 
