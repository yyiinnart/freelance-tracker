/* Local display preference only; the existing timer owns all phase transitions. */
(function () {
  'use strict';
  var key = 'ft_break_display', mode = 'notice';
  try { mode = localStorage.getItem(key) === 'overlay' ? 'overlay' : 'notice'; } catch (_) {}
  var host = document.getElementById('fx-pomo-opts');
  if (!host) return;
  var row = document.createElement('div');
  row.className = 'cfg-row cfg-row-wide';
  row.innerHTML = '<div class="cfg-row-label"><label class="cfg-row-name" for="fx-break-display">休息顯示方式</label><p class="cfg-row-desc">僅此瀏覽器。遮罩只覆蓋本頁，不會蓋住其他應用程式。</p></div><div class="cfg-row-ctl"><select id="fx-break-display" class="inp" data-nosave><option value="notice">一般提醒</option><option value="overlay">頁面遮罩</option></select><button type="button" class="btn btn-sm" id="fx-break-preview">預覽</button></div>';
  host.appendChild(row);
  var select = row.querySelector('select');
  select.value = mode;
  var dialog = document.createElement('dialog');
  dialog.id = 'fx-break-overlay';
  dialog.setAttribute('aria-labelledby', 'fx-break-heading');
  dialog.setAttribute('aria-describedby', 'fx-break-hint');
  dialog.innerHTML = '<div class="fx-break-content"><p id="fx-break-kind"></p><h2 id="fx-break-heading">休息一下</h2><p id="fx-break-clock" role="timer" aria-label="休息剩餘時間"></p><p id="fx-break-hint">讓視線離開螢幕，看看遠處，放鬆肩頸。</p><p id="fx-break-note"></p><div class="fx-break-actions"><button type="button" id="fx-break-full">進入全螢幕</button><button type="button" id="fx-break-end">結束休息</button><button type="button" id="fx-break-dismiss" autofocus>收起遮罩</button></div><p id="fx-break-status" role="status"></p></div>';
  document.body.appendChild(dialog);
  var q = function (id) { return dialog.querySelector('#fx-break-' + id); };
  var previewUntil = 0, dismissed = null, current = null, previousFocus = null;
  var oldOverflow = '', fullscreenPending = false, ownsFullscreen = false;
  var fullscreenTarget = document.documentElement;
  function close() {
    if (!dialog.open) return;
    if (ownsFullscreen && document.fullscreenElement === fullscreenTarget) document.exitFullscreen().catch(function () {});
    ownsFullscreen = false;
    dialog.close();
    document.body.style.overflow = oldOverflow;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
  }
  function dismiss() {
    if (!previewUntil) dismissed = current;
    previewUntil = 0;
    close();
  }
  function tick() {
    var left, longBreak = false, preview = previewUntil > 0;
    if (preview) {
      left = previewUntil - Date.now();
      if (left <= 0) { previewUntil = 0; close(); return; }
    } else {
      var c = getFocusCfg(), s = fxState();
      var pid = fxActivePid();
      if (mode !== 'overlay' || !c.on || !c.pomo || pid == null || !s || s.phase !== 'break' || s.pausedLeft != null) {
        close(); return;
      }
      current = String(pid) + ':' + s.phaseStart;
      if (dismissed === current) { close(); return; }
      left = fxPomoLen(c, s) - (Date.now() - s.phaseStart);
      if (left <= 0) { close(); return; }
      longBreak = s.long;
    }
    q('kind').textContent = preview ? '休息畫面預覽' : (longBreak ? '長休息' : '短休息');
    var seconds = Math.max(0, Math.ceil(left / 1000));
    q('clock').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
    q('note').textContent = preview ? '預覽 15 秒，不影響任務或番茄鐘。' : '任務仍在計時，休息會計入工時。收起遮罩後可暫停任務。';
    q('end').hidden = preview;
    q('dismiss').textContent = preview ? '關閉預覽' : '收起遮罩';
    q('full').hidden = !document.fullscreenEnabled;
    if (!dialog.open) {
      previousFocus = document.activeElement;
      oldOverflow = document.body.style.overflow;
      q('status').textContent = 'Esc 可收起遮罩；全螢幕時先退出全螢幕。';
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
  }
  select.addEventListener('change', function () {
    try { localStorage.setItem(key, select.value); }
    catch (_) { select.value = mode; showToast('無法儲存休息顯示設定，請檢查瀏覽器儲存空間', 'amber'); return; }
    mode = select.value; dismissed = null; tick();
  });
  row.querySelector('button').addEventListener('click', function () { previewUntil = Date.now() + 15000; tick(); });
  q('dismiss').addEventListener('click', dismiss);
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); dismiss(); });
  q('end').addEventListener('click', function () {
    var s = fxState(), c = getFocusCfg();
    if (!previewUntil && c.on && c.pomo && s && s.phase === 'break' && s.pausedLeft == null && fxActivePid() != null && current === String(fxActivePid()) + ':' + s.phaseStart) fxPomoSkip();
    dismiss();
  });
  q('full').addEventListener('click', async function () {
    if (fullscreenPending) return;
    fullscreenPending = true;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else {
        // HTMLDialogElement cannot request fullscreen. Fullscreen the page instead.
        await fullscreenTarget.requestFullscreen();
        ownsFullscreen = document.fullscreenElement === fullscreenTarget;
        if (!dialog.open) {
          if (ownsFullscreen) await document.exitFullscreen();
          ownsFullscreen = false;
        } else {
          // Reinsert the modal above the newly fullscreen element in the top layer.
          dialog.close();
          dialog.showModal();
          q('full').focus({preventScroll:true});
        }
      }
    } catch (_) { q('status').textContent = '瀏覽器未允許全螢幕，仍可使用頁面遮罩。'; }
    finally { fullscreenPending = false; }
  });
  document.addEventListener('fullscreenchange', function () {
    if (document.fullscreenElement !== fullscreenTarget) ownsFullscreen = false;
    q('full').textContent = document.fullscreenElement ? '退出全螢幕' : '進入全螢幕';
  });
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) { mode = event.newValue === 'overlay' ? 'overlay' : 'notice'; select.value = mode; dismissed = null; tick(); }
  });
  document.addEventListener('visibilitychange', tick);
  setInterval(tick, 1000);
  tick();
})();
