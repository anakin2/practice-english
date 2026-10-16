# Word Garden · 英文單字練習

Vue 3 + Vite 製作的國中英文單字卡。包含 100 個單字、美式 IPA 音標、中文意思、分類篩選、中英文搜尋，以及瀏覽器語音發音。

## 本機開發

使用 Node.js 20.19+ 或 22.12+（目前已用 Node.js 24 驗證）。

```sh
npm ci
npm run dev
```

## 正式建置

```sh
npm run build
npm run preview
```

產出檔案位於 `dist/`，可部署到靜態網站服務。

發音透過 Web Speech API，無須 API 金鑰。需使用支援語音合成的瀏覽器，並安裝可用的英文語音；音色、可用性及是否需要網路依瀏覽器及作業系統而異。音標以美式英文為主；不同地區發音可能不同。字型服務無法連線時會使用系統備用字型。

## 專案結構

- `src/App.vue`：共用版面與路由出口。
- `src/views/VocabularyView.vue`：單字練習頁。
- `src/components/`：頁首、頁尾與單字卡。
- `src/composables/usePronunciation.js`：語音播放狀態與清理。
- `src/router/index.js`：hash 路由；新增頁面時在此登記路由。

GitHub Pages 的部署路徑已設為 `/practice-english/`，hash 路由可直接重新整理。部署時執行 `npm run build`，將 `dist/` 內容放到 `gh-pages` 分支根目錄，並保留 `.nojekyll`。

## Supabase

資料表、安全規則、100 個單字匯入與部署設定請參閱 [supabase/README.md](supabase/README.md)。
連線設定透過本機 `.env.local` 或 GitHub Actions Secrets 提供，不寫入原始碼。
`npm run test:db` 使用本機 PostgreSQL WASM 驗證資料表與 RLS，不會連線到正式資料庫。
啟用 GitHub Actions 部署後，不再手動推送 `dist/` 到 `gh-pages`。
