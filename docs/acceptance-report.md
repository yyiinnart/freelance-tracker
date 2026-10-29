# Freelance Tracker 主題系統驗收報告

日期：2026-10-29；實際專案 F:/Desktop/freelance-tracker；分支 codex/ui-task-theme。起點 v19，交付 v20。全程未 commit、push、部署或修改真實使用者資料。

## 1. 實作摘要

- 新使用者預設炭灰 dark；原有 original 深藍、light 紙白完整保留。
- 主題入口由頁首移到「設定 → 外觀」，沿用 cfg-nav/cfg-pane；選擇立即生效，自動保存並顯示目前主題。無重複入口。
- 新增同步載入的 theme-preload.js，於 stylesheet 前讀取主題，避免延後到 DOMContentLoaded 才變色；設定值缺少/無效時使用 dark，不覆蓋合法已存選擇。
- 單一設定鍵 ft_editorial_theme（字串 original/dark/light），沿用既有本機 ft_* localStorage 模式。FTTheme.get 讀目前根屬性，沒有第二份 mode 索引。跨視窗 storage 事件同步控制與圖表；儲存失敗仍預覽並明示「僅本次有效」。
- 主題屬本機瀏覽器偏好，和 ft_cfg_pane 同類；未加入雲端 CFG 或業務 JSON，匯入業務備份不覆蓋外觀。沒有變更任務、付款、工時資料欄位。
- 舊版只保存當次頁面選擇，沒有任何持久化主題鍵可遷移。更新前未儲存的暫時選擇無法在重新載入後推回；更新後手動選擇會保留。這是歷史資料不存在的限制，不能宣稱完成不存在資料的遷移。

修改檔案：index.html（head/設定外觀/移除頁首入口/子頁名單/版本）、editorial.js（控制與圖表事件）、appearance-controls.css（外觀設定控制）、新增 theme-preload.js。AGENTS.md 更新舊 session-only 說明。docs/acceptance-plan.md 保存完整需求；progress 為恢復依據；本報告及 acceptance-evidence 為證據。未開發客製化功能。

## 2. 測試結果

|測試項目|測試方式|結果|問題與處理|
|---|---|---|---|
|新使用者預設、單一入口|獨立 Edge/Chromium context，設定 DOM/根屬性|通過|預設 dark，只有外觀子頁有 selector|
|三主題即時套用、自動儲存、刷新|實際 select + reload + localStorage 比對|通過|三主題均保留，業務資料不變|
|關閉並重開瀏覽器|獨立 persistent profile，真正關閉程序再啟動|通過|original 保留；證據 p1-results.json|
|跨視窗設定同步|同 context 兩個分頁|通過|變更自動更新另一分頁|
|無效設定值|寫入 invalid 後重載測試頁|通過|fallback dark|
|儲存失敗|測試環境 setItem 拋例外|通過|仍可預覽，明示未儲存，不顯示假的成功訊息|
|FOUC|三主題 first-paint/FCP 記錄＋截圖|通過（受測環境）|首次繪製主題正確；未涵蓋所有裝置/網路速度|
|跨頁/設定子頁|3 主題 × 3 寬度 × 11 頁及 6 子頁，153 組|部分未通過|141 組無水平溢出；12 組是既有窄版設定問題，見 Bug 清單|
|詳情、下拉選單、焦點|實際開關、讀 computed style、截圖|通過|三主題正確，詳情無水平溢出，focus 2px|
|Selected/Hover/Disabled/Error|原生控制操作＋儲存錯誤注入|通過（抽樣）|未窮盡全部業務元件所有狀態及原生系統選單|
|主題切換版面穩定|控制 DOM identity 和 bounding box 比對|通過|同一 DOM、同一 200×38 控制大小，未重建任務資料|
|任務增修刪與狀態|隔離資料實際建立、詳情及彈窗儲存、刪除|通過|重載後編輯結果保存|
|搜尋、篩選、排序|關鍵字、paused/done 篩選、原生 dragTo|通過|包含/排除正確；排序後項目集合相同|
|JSON 匯出入|實際瀏覽器下載、刪除測試任務、選檔並確認匯入|通過|任務還原、外觀保留；不連真實雲端|
|test_value.js|修改前後執行|通過|語法、產值守恆、估算、舊日期等|
|test_value_ui.js|修改前後執行|通過|啟動、分析、付款、詳情及兩個工時編輯器|
|test_sched.js/test_whatif.js|基準/修改後抽取主 script 執行|未通過|兩版皆缺 getOffHour 測試依賴，未修/停用舊測試|
|test_dom.js/test_dom2.js|基準/修改後嘗試執行|未測試（環境阻擋）|兩版均缺 jsdom；未安裝新依賴|
|taste-skill lint|新改的三份主題 JS/CSS|通過（有警告）|0 FAIL、1 WARN：既有 Chart 深藍辨識色保留|
|Type Check / Build|專案檔案盤點|不適用|原生單頁，無 package.json/TypeScript/build 命令，不宣稱執行過|
|語法／Git diff --check／可重跑主題測試|P5 實際執行|通過|兩份 JS 與 inline 語法、主題 smoke、Git 差異格式通過；六個 v20 資源 HTTP 200 且內容與本機一致|
|實體觸控、Safari/Firefox、真實雲端往返、所有特殊案件/大量圖片|未執行|未測試|需人工或對應環境驗證|

證據均在 acceptance-evidence/：p1-results.json、p2-matrix.json、p2-interactions.json、p2-states.json、p3-ui.json、legacy-tests.json。153 組是載入/主題/溢出矩陣，不等於每頁全部功能都做過完整測試。可重跑 recheck-theme.cjs 的環境與命令見 progress。

## 3. Bug 與限制清單

|嚴重度|問題|狀態與證據|
|---|---|---|
|Critical|受測範圍未發現資料損毀或核心功能不可用|不是對未測流程的保證|
|High|受測範圍未發現本次新增的主要功能異常|真實雲端與跨瀏覽器仍未驗證|
|Medium|390px 設定 finance/maint 寬 394px，analysis 寬 437px|v19 基準也重現；獨立既有版面問題，未擅自修整|
|Medium（測試基礎設施）|舊排程測試依賴抽取缺 getOffHour；DOM 測試缺 jsdom|修改前後相同；無法取得完整舊測試綠燈|
|Low|窄版專案群組標題被操作按鈕擠壓|既有記錄，本次不擴大排版修改|
|限制|舊版當次選擇沒有儲存，無法跨更新還原|更新後持久化已生效；不猜測使用者偏好|
|限制|瀏覽器禁用或清除儲存、無痕結束時偏好不保證保留|寫入失敗有明確回饋；清除後使用炭灰預設|

沒有為通過驗收刪除測試或停用檢查。跨頁既有顏色大量使用 --paint-* 相容層：中性色已隨主題；類型/標籤/圖表資料色有意保留，不能全數當作錯誤色碼刪除。部分既有小字與透明弱化提示尚未做逐元素 WCAG 全量掃描，列為後續人工視覺驗證範圍。

## 4. 客製化外觀可行性（只分析，未實作）

### 現有基礎與必要準備

已有 data-editorial-theme、集中 --ed-* / --ui-* token、三個主題和圖表主題事件，可擴充色彩編輯器。但仍有 --paint-* 相容色、inline style、Tailwind 特定規則及 specificity/important，不能假設改四個變數即可覆蓋所有元件。先建立穩定的公開 token 清單及依賴映射，區分文字、結構線、控制線、危險色與圖表色，建立三主題回歸截圖。

|方案|開發難度／估計|維護成本|自由度|安全與穩定|現有架構相容性|
|---|---|---|---|---|---|
|A. 白名單 token 視覺編輯器|低至中，約 3–5 人日|低|背景/面板/文字/強調色等有限選項|最高；拒絕任意 CSS、只收合法色值|高；沿用 token 與 FTTheme 事件|
|B. 受限制 CSS 規則編輯器|中至高，約 8–12 人日|中至高|指定元件的色彩、邊框等|需 CSS parser、selector/屬性和值白名單；仍需測試|中；需穩定 class 掛點及明確作用域|
|C. 任意 CSS 進階模式＋隔離預覽|高，約 15–25 人日以上|高|最高|最低；套用到主文件後無法保證功能不被遮蔽/隱藏|低至中；現有覆寫層會增加支援負擔|

估計為一位熟悉現有程式的人、含最基本測試與文件，不是承諾工期；跨瀏覽器、分享市集、審核/帳號同步不含在內。

### 八項評估與推薦架構

1. **擴充基礎**：有，適合先做 A。由使用者選擇基底主題，再覆寫公開 semantic tokens；相容 --paint-* 色需逐步改成對應 token，避免一次重寫全站。
2. **自訂 CSS 架構**：需要專用設定格式（schemaVersion、baseTheme、tokens、可選 customCss）、獨立 style layer、parser/驗證器、預覽、儲存失敗/回復，以及穩定元件掛點。現有未分層的 !important 要先盤點。不能直接把任意字串插入 innerHTML。
3. **簡易編輯器優先**：A 只允許合法色值，不接受任意 CSS var/url/函式；按角色給對比檢查與預設回退，可先開放背景、面板、正文、次要文字、強調色和線條。危險狀態與鍵盤 focus 保護為可讀範圍。
4. **兩者共存**：技術上可。固定順序 base → token overrides → 受限 advanced；顯示進階規則可能覆蓋視覺設定，提供停用 advanced。不要把編輯器值與 CSS 文本互相無損反推。
5. **外觀不破壞功能**：A 可限制只有色彩角色，不暴露 display/position/z-index/pointer-events/overflow/尺寸等。B 的 selector 只允許專用外觀容器及元件掛點。任意 CSS 方案 C 無法保證操作不被遮蔽或隱藏，即使有 scope 也不是安全邊界；應有完全不載入自訂樣式的安全啟動入口。隔離 iframe 只用於無真實任務資料的預覽，不能把 iframe 的安全性誤當套用主文件後也成立。
6. **安全與維護**：禁止 @import、外部 url()/字型、未知 at-rule、內容生成與高成本動畫/濾鏡；CSS parser 正規化後做白名單，不以單一 regex 過濾。CSS 能觸發外部資源請求，需考量資料外洩與追蹤；CSP 是額外防線，不是可用性保證。現有 Tailwind CDN、inline scripts/styles 會限制嚴格 CSP 的導入，不能本次直接加一條政策就宣稱安全。[MDN style-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src)、[MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)。
7. **還原/匯入匯出**：獨立主題 JSON，不混入任務備份；schemaVersion、鍵值/大小/色值驗證、先預覽再儲存、保留最近可用版本。一鍵還原只刪主題自訂鍵並回到基底/炭灰，不清空 localStorage；安全啟動在自訂 CSS 載入前生效，避免按鈕本身被隱藏。
8. **GitHub Pages**：A/B/C 都能以靜態 JS/CSS＋localStorage/IndexedDB、本機 JSON 匯出入運作，不需要後端。跨裝置同步、分享市集與集中審核則是額外服務需求。GitHub Pages 支援靜態 HTML/CSS/JS，與本專案相容。[GitHub Pages 官方說明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

**推薦 A，留待後續版本**：目前先穩定三主題、修窄版與測試基礎設施，再安排 token 編輯器。現在不值得開放任意 CSS；它的安全與維護成本超過此單檔工具的收益。此回合完全沒有新增編輯器、自訂 CSS 輸入或主題匯出入功能。

## 5. 最終驗收結論

P0–P5 工作與報告均已完成，必要主題功能、隔離主要流程及最終語法/資源/主題 smoke 檢查已通過。全面驗收為有條件完成，並非所有既有測試與所有裝置皆通過。已知既有窄版與測試環境問題仍未解決，不能宣稱全站零 Bug。資料 schema 沒有更動，新增的只是本機外觀鍵；業務備份不攜帶主題，從不同網址/網域/瀏覽器開啟會有各自偏好。必須把 theme-preload.js 與 v20 HTML/CSS/JS 一起發布，避免舊新檔案混用。

靜態架構適合 GitHub Pages，尚不作無條件正式上線驗收；建議修復已列手機問題、補齊測試依賴，並人工完成真實觸控、Safari/Firefox、雲端往返、大量圖片與特殊案件，再決定正式發布。本次未部署。
