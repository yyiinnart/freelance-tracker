# 驗收進度（2026-10-29）

|階段|狀態|
|---|---|
|P0|Done|
|P1|Done|
|P2|Done|
|P3|Done|
|P4|Done|
|P5|Done|

## 已完成調查
- 實際 F:/Desktop/freelance-tracker，分支 codex/ui-task-theme；不操作 D 槽舊副本。
- 既有修改 UI-REDESIGN.md、appearance-controls.css、editorial.css、editorial.js、index.html、navy-glass.css；未追蹤 AGENTS.md、UI-COLOR-AUDIT.md、theme-tokens.css，全部保留。
- v19 的 editorial.js 每次 DOMContentLoaded 強制 original，頂部唯一 selector；沒有主題持久化鍵。
- 設定用 setCfgPane/CFG_PANES，ft_cfg_pane 本機保存子頁；其他偏好分別用 ft_* localStorage，沒有統一設定 service。
- 無根 package.json／正式 build/typecheck；有 test/ 舊 Node、jsdom、Playwright 腳本。
- 已知既有問題：窄版群組標題擠壓，舊測試有失敗，需本次實跑比對。

## 初始調查時的下一步（歷史紀錄）
建立基準快照/雜湊，執行可用基準測試，再最小範圍實作 P1。目前尚未修改應用程式。

## 恢復指引與風險
先讀 acceptance-plan.md，再檢查 Git status/diff 及本文。不得以 HEAD 覆蓋既有 UI 修改。實際檔案優先，外部變更需記錄衝突。
暫存與基準預定位置 D:/Temp/ft-acceptance-MEA5Z5；後續證據保存 docs/acceptance-evidence/，不能只依賴暫存。
舊版選擇只在 DOM/session，沒有儲存的歷史偏好可遷移。更新前未保存的選擇無法跨 reload 推回，須在報告明示。
## P0 完成
- 基準 v19 的 test/test_value.js 通過（語法、產值計算、舊資料日期等）；test/test_value_ui.js 通過（啟動、分析、收付款、詳情、兩種工時編輯入口）。
- 基準 hash：acceptance-evidence/baseline-hashes.json；原檔快照 D:/Temp/ft-acceptance-MEA5Z5。未改應用來源。
- 決策：新增 ft_editorial_theme，值 original/dark/light；本機外觀偏好比照 ft_cfg_pane，不加入雲端/業務備份 CFG，避免擴大資料同步契約。僅使用單一主題來源。不存在舊持久化鍵，故不猜測其他鍵。
- P0 Done；P1 In Progress。下一步：前置載入套用主題、設定外觀子頁、儲存失敗與跨視窗更新，接續隔離瀏覽器測試。

## P1 小步：來源已實作，待驗證
- 新增 theme-preload.js：同步於 head 最前載入，單一 ft_editorial_theme，合法值 original/dark/light，無效/缺值 fallback dark。storage 事件同步跨視窗；儲存失敗只預覽並顯示未儲存。
- index.html：初始 dark，頂部 selector 移到設定/外觀，保留三主題，CFG_PANES 新增 appearance，快取 v20。
- editorial.js：移除 session 強制 original，使用 FTTheme；Canvas 改監聽主題事件。appearance-controls.css：外觀子頁控制樣式。
- 程式修改尚未完成瀏覽器驗證，P1 仍 In Progress。下一步先語法再隔離主題/刷新/重啟/儲存失敗測試。

## P1 完成（2026-10-29）
- 通過：新使用者 dark、三主題自動保存/刷新、無效值 fallback、跨視窗同步、儲存寫入失敗明確回饋、真正關閉及重啟獨立 persistent-profile Edge 後保留 original。
- first-paint/FCP 儀器記錄 light/dark 正確；original reload 當次未捕獲 paint entry，將於 P2 補測，不將空資料視為 FOUC 通過。
- 所有 inline scripts、theme-preload.js、editorial.js 語法通過，P1 瀏覽器零 pageerror。
- 證據：acceptance-evidence/p1-results.json、appearance-dark.png。
- 驗證曾因工具 20 秒逾時重置，未視為產品錯誤；拆成兩步重跑真正重啟成功。
- P1 Done；P2 In Progress。下一步：三主題跨頁面/各設定子頁/詳情與選單、響應式、FOUC 補測，處理直接主題問題。

## P2 小步：跨頁矩陣及首次繪製完成
- 三主題 × 1440/768/390 × 11 個分頁＋6 個設定子頁，共 153 組。141 組無頁面溢出；12 組為窄版既有設定 finance/analysis/maint 及保留該子頁時的 cfg 溢出。以修改前 v19 重新執行確認 finance/maint 寬 394、analysis 寬 437（viewport 390），非本次新增。列為 Medium 待修，不擴大修改獨立排版。
- 三主題詳情無水平溢出、下拉選單底色/文字隨主題、鍵盤 focus 2px。三主題 first-paint 與 FCP 均記錄正確主題，未觀察錯誤主題閃現。
- 主題切換 selector 為同一 DOM 節點，三主題 bounding box 完全相同；業務 PJ/P/GRPS/DLOGS 前後一致，零 pageerror。
- 證據 p2-matrix.json、p2-interactions.json。尚需完成 Disabled/Error、靜態殘留與主要 CRUD 後再定稿 P2/P3。

## P2 完成／P3 開始
- 新外觀控制 Selected、Hover、Focus、原生 Disabled 經瀏覽器操作；Error 為 P1 儲存失敗回饋已測。新介面主要文字/底色均為主題變數，保留瀏覽器原生 select 行為。
- taste-skill lint（theme-preload.js/editorial.js/appearance-controls.css）：0 FAIL、1 WARN，為既有 Chart 原深藍辨識色，不是新色碼殘留。
- P2 的新主題整合回歸標準通過；既有窄版問題不視為通過項目，於最終報告保留「未通過」。全面所有特殊狀態/原生系統選單尚未窮盡。
- P2 Done；P3 In Progress。下一步：以測試資料 UI CRUD、搜尋/篩選/排序、匯出入，及既有 sched/whatif/dom/value 測試前後比對。

## P3 完成
- 實際隔離 UI：新增任務、詳情改名/狀態、關閉、重新載入回讀、彈窗編輯儲存、搜尋、paused/done 篩選包含排除、原生 dragTo 同區排序（項目集合不變）、下載 JSON、刪除測試任務、確認匯入還原任務及保留外觀全部通過。零 pageerror。證據 p3-ui.json。
- test_value.js 與 test_value_ui.js 修改後重跑通過，和 P0 相同。
- test_sched.js/test_whatif.js 修改前後均 ReferenceError: getOffHour is not defined，測試抽取依賴不完整，未通過；test_dom.js/test_dom2.js 修改前後均缺 jsdom，未能進入測試。未安裝依賴、未改測試、未隱藏錯誤。證據 legacy-tests.json。
- 無根 package.json，也無 TypeScript/build 設定，不虛構 lint/typecheck/build 指令；語法與 taste-skill lint 已執行。
- P3 Done（本次功能回歸通過；舊測試未通過明列報告）。P4 In Progress。下一步：只分析自訂 CSS/編輯器三方案、風險及工作量；不可新增任何客製化功能。

## 恢復核對與 P4 完成
- 心跳恢復時已重讀計畫/進度，核對 Git 和實際 v20 程式；P1–P3 沒有重做。P4 報告原本只在暫存，現已保存 docs/acceptance-report.md，包含三方案、八項分析、工作量及官方參考連結。
- 推薦未來先做 token 白名單編輯器；沒有實作任何自訂 CSS/編輯器。AGENTS.md 舊 session-only 描述已更新，避免後續對話回復錯誤行為。
- 新增 acceptance-evidence/recheck-theme.cjs 供恢復時快速重跑；不操作真實網址或資料。
- P4 Done；P5 In Progress。下一步：執行 recheck-theme.cjs、語法、diff --check；確認部署需要的六個 v20 資源能正常取得，最後保存報告與雜湊。

## P5 完成與最終恢復位置（2026-10-29）
- 實際執行 docs/acceptance-evidence/recheck-theme.cjs 通過：預設/唯一入口/三主題/保存刷新/業務資料不變/儲存錯誤回饋/零 runtime errors。
- node --check theme-preload.js、editorial.js 通過；test_value.js 再次通過（含 inline scripts 語法）；git diff --check 通過，只有 Git 的既有 LF/CRLF 提示。
- theme-preload.js/editorial.js/editorial.css/appearance-controls.css/navy-glass.css/theme-tokens.css 的 v20 預覽 HTTP 200，回傳內容逐一與 F 槽檔案一致。
- docs/acceptance-report.md 已定稿，包含功能摘要、測試表、Bug 分級、三種客製化方案、推薦與部署限制。P0–P5 均完成；仍有明列的既有未通過/未測項目，不代表全站零 Bug。
- 未新增客製化功能；未 commit/push/deploy；未更動真實任務資料。

### 下次操作
本次授權工作無剩餘步驟。先讀報告與證據、核對 final-hashes.json 及 Git；不要重做 P1。若使用者另行授權，優先處理窄版設定溢出、群組標題擠壓、舊測試依賴，再做人工作業驗證。

### 可重跑命令與環境
- Node：C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe
- 專案根目錄執行：node docs/acceptance-evidence/recheck-theme.cjs
- 腳本可透過 PLAYWRIGHT_MODULE、TEST_BROWSER、TEST_TAILWIND、TEST_CHART 指定工具及快取；預設用 bundled Playwright、已安裝 Edge、D:/Temp/ft-tailwind-audit.js、D:/Temp/ft-chart-audit.js。
- 若快取消失，先從既有環境取得相同版本依賴，不要把缺環境誤報為產品失敗。原始 CDN 為 Tailwind CDN 與 Chart.js 4.4.1。
- node test/test_value.js；test/test_value_ui.js 需 PLAYWRIGHT_MODULE 指向 bundled playwright，現有 log fixture 必須存在。
- 原檔 v19 快照仍在 D:/Temp/ft-acceptance-MEA5Z5；docs 證據與完整需求不依賴此暫存。不要直接用快照覆蓋使用者後續變更。
## 2026-10-29 提交整理（使用者另行授權）
- .gitignore 新增 /docs/acceptance-evidence/，驗收截圖、測試輸出與本機測試工具留在原位、不提交；沒有移動或刪除資料。
- acceptance-plan/progress/report、AGENTS.md、UI 修改紀錄及七個網站必要檔案仍可提交。
- 注意：evidence 現為本機忽略資料，另一台電腦 clone 後不會取得證據或 recheck-theme.cjs；需沿用本機或另行安全交接。三份驗收文件仍可跨對話使用。
- 僅提供合併 main 教學，未 commit、merge、push 或部署。

## 直式任務表格修正 — In Progress
- 使用者已合併至 main，目前工作區乾淨；與舊文件的 codex/ui-task-theme 不同，以實際分支為準，不自行切換。
- 原因：editorial.css .proj-table 最小寬度 1160px、固定欄寬，直式螢幕需左右拖曳。
- 下一步：只調整任務表格響應式樣式、版本號，再以隔離資料驗證全部欄位與操作入口。

### 直式任務表格修正 — Done
- 已修改 editorial.css：960–1279px 緊湊欄寬；959px 以下將每筆任務分行，所有欄位與操作保留。1280px 以上維持原桌面排版。
- index.html 僅將 6 個外部資源快取版本更新至 v20261029-21；反向替換版本後與基準內容完全一致，未修改 inline JavaScript、資料或功能邏輯。
- 已實測：隔離 Edge 瀏覽器與測試資料，三主題 × 1440/1080/960/768/390px，共 15 組皆無頁面/任務表格橫向溢出、無超出畫面的儲存格，無 pageerror。另測 1280/1024/959px 炭灰通過。目視審查炭灰 1080/390、紙白 390、深藍 1080 截圖。
- 已實測：390 與 1080px 編輯按鈕可開啟/關閉彈窗；任務列可開啟/關閉詳情；操作按鈕可取得鍵盤焦點。未操作真實資料。
- Git diff --check 通過（僅換行格式提示）；實際 8766 預覽確認載入 v21 與相同 CSS。測試證據：docs/acceptance-evidence/portrait-results.json（本機忽略）。
- 未驗證：實體觸控、所有極端長文字/大量標籤、不同瀏覽器與計時/刪除的完整功能回歸。本次純 CSS 與版本字串修改，未重跑無關計算測試。
- 下一步：使用者以 http://127.0.0.1:8766/?ui=20261029-21 在實際直式螢幕確認；如滿意可依原流程自行提交。未 commit、push 或部署。

## 任務分組辨識度 — In Progress
- 延續 main 未提交的直式排版修改，不覆寫。僅新增炭灰/紙白分組樣式並更新快取。
- 下一步：隔離瀏覽器驗證三主題、分組摺疊與窄版溢出。

### 任務分組辨識度 — Done
- editorial.css 新增限定 dark/light 的共用分組樣式：淡底、1px 細框、8px 圓角、標題內距與次要字、表頭淡底、28px 組間距；焦點短線，待命標題降階。無新增逐列卡框或陰影，深藍規則不變。
- index.html 僅快取 v21→v22；既有邏輯與資料未修改。
- 隔離 Edge：三主題 × 1440/1080/960/390px 皆無頁面或表格橫向溢出；待命展開/收合、編輯彈窗通過，無 pageerror。目視炭灰直式、紙白直式/手機通過。證據 docs/acceptance-evidence/task-group-results.json。
- 未測：實體觸控及其他瀏覽器；純 CSS 未重跑無關計算測試。
- 下一步：使用者確認 v20261029-22 預覽。保留先前未提交修改；未 commit/push/deploy。

## v23 標題移出框 — In Progress
- 已核對實際 F 專案及 v22 樣式，保留現有未提交修改。下一步移動邊框/底色至表格容器並移除重複標題。

### v23 標題移出框 — Done
- editorial.css：炭灰/紙白外框及原淡底改套用至 tbl-wrap，分組標題/數量/說明移至框外；表頭色值未變。index.html：移除三主題共用的重複標題，一鍵整理保留並靠右，快取 v23。
- 隔離 Edge 實測三主題 × 1080/390px：標題在框外、無頁面橫向溢出、舊標題不存在、整理入口可見；待命可展開。炭灰截圖目視通過，inline JS 與 v22 完全相同。
- 未驗證實體觸控，未操作真實資料、未 commit/push/deploy。下一步使用者確認 v23 預覽。

## v24 — In Progress
已核對 v23 實際檔案與既有修改，將替換舊窄版分行 CSS，驗證各斷點與操作入口。

### v24 — Done
- editorial.css 替換舊 959px 以下多行 grid 為橫向表格；1199px 以下隱藏起訖標籤，999px 以下再隱藏計費/待收，799px 以下再隱藏安全工時。599px 以下緊縮縮圖/欄寬/按鈕，保留名稱/截止提醒/工時/操作。三主題共用，分組外觀不變。
- index.html 僅快取 v23→v24，反向替換後與基準完全相同，無資料與邏輯修改。
- 隔離 Edge 三主題 × 1440/1280/1200/1199/1080/1000/999/800/799/600/599/390/320 共39組：無頁面/表格橫向溢出、顯示欄位順序符合規劃、無pageerror。手機編輯/詳情開啟關閉通過；目視炭灰800/390畫面。證據 task-columns-v24.json。
- 未驗證：實體觸控、其他瀏覽器、極端長資料。純CSS未重跑計算測試。未commit/push/deploy。下一步使用者確認v24。

## 圓形主題選擇 — In Progress
已核對 F 專案，工作區乾淨。現有 FTTheme 為唯一儲存來源；將沿用並替換選單控制，不改主題儲存機制。

## 浮動小窗主題 — In Progress
原因：PiP 僅注入 FX_CSS/FX_PIP_CSS，未繼承主頁 CSS 自訂變數，背景色失效。下一步：動態同步變數、測試主題切換/未來自訂變數/關閉清理。
- 前次色票實作及 recheck-theme.cjs 已通過；最後紀錄寫入遭自動審核額度限制未執行，需補完。

### 圓形主題選擇 — Done（補前次中斷紀錄）
- 已實作三主題原生radio圓形色票、名稱/勾號/焦點，沿用FTTheme儲存；index.html、editorial.js、appearance-controls.css、editorial.css及AGENTS.md已更新。既有測試改為色票點選並保留原斷言。
- 前次實測點選、方向鍵、重載、跨頁同步、儲存失敗回饋、其他儲存值不變、390px無溢出；recheck-theme.cjs本次重跑PASS。未實測實體觸控/螢幕閱讀器。
### 浮動小窗主題 — Done
- index.html：新增fxBindPipTheme，同步主頁計算後的所有CSS變數與color-scheme；初始開啟、主題事件、根元素style/class/theme屬性變動時更新；移除失效變數，pagehide清理監聽與observer。未依主題名稱分支。
- FX元件舊色碼型變數改接ui語意變數（背景/文字/邊框/強調/警告等）；PiP背景使用ui-background；未修改計時或業務資料邏輯。快取20261030-02。
- 隔離Edge原生Document PiP：實際requestWindow開啟，三主題背景/文字/color-scheme匹配，開窗後切換同步；未知新增token、自訂背景、移除token及關閉重開通過。證據docs/acceptance-evidence/pip-theme.json。
- 測試限制：隔離環境fxTick暫以no-op避免無任務時自動關窗，未測完整開始/暫停/停止與計時帳務；未驗證實體置頂視窗外觀及多瀏覽器。真實資料未動。Git diff --check通過。
- 下一步：使用者於本機預覽20261030-02實際開始計時確認。未commit/push/deploy。

## 深藍預設 — In Progress
已核對現況，保留既有未提交修改；調整初始化fallback、HTML預設、色票順序與文件。

### 深藍預設 — Done
- theme-preload.js 無設定/無效值/讀取失敗預設改original；index.html初始主題同步為original，深藍色票第一個並移動預設標記，快取20261030-03；AGENTS.md同步。已儲存的有效主題維持不覆蓋。
- recheck-theme.cjs通過：預設/三主題切換及儲存重載/資料不變/儲存失敗。第一次測試點選已選的深藍不觸發change，因此未產生儲存鍵；已調整測試先切至紙白再測深藍，保留原儲存斷言。Git差異格式檢查通過。
- 靜態確認色票順序original/dark/light與預設標記；本次未另做視覺截圖或實體觸控。下一步使用者確認v20261030-03；未commit/push/deploy。
