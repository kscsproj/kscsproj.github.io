import { defineConfig } from "vite";

// このリポジトリ自体がGitHub Pagesのルート(username.github.io)である前提。
// プロジェクトページとして/<リポジトリ名>/配下にデプロイする場合はbaseを変更する。
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
});
