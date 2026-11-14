/* Presence only: never reads or changes tasks, timers, sync or business settings. */
(function () {
  'use strict';
  var scope = location.protocol === 'file:' ? location.pathname : location.origin + location.pathname;
  var key = 'ft_window_presence', started = Date.now();
  var id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : started + '-' + Math.random().toString(36).slice(2);
  var peers = new Map(), channel = null, active = true, warned = false;
  var previousFocus = null, sequence = 0;
  var banner = document.createElement('div');
  banner.id = 'ft-window-warning';
  banner.hidden = true;
  banner.setAttribute('role', 'status');
  banner.textContent = '目前有其他視窗開啟 Freelance Tracker，建議只在一個視窗操作。';
  document.body.prepend(banner);
  var dialog = document.createElement('dialog');
  dialog.id = 'ft-window-warning-dialog';
  dialog.setAttribute('aria-labelledby', 'ft-window-warning-title');
  dialog.setAttribute('aria-describedby', 'ft-window-warning-description');
  dialog.innerHTML = '<h2 id="ft-window-warning-title">Freelance Tracker 已在其他視窗開啟</h2><p id="ft-window-warning-description">同時在多個視窗操作可能造成資料或計時混淆，建議保留一個視窗使用。</p><p>此提醒不會停止計時，也不會關閉任何視窗。</p><button type="button" autofocus>我知道了</button>';
  document.body.appendChild(dialog);
  function closeWarning() {
    if (!dialog.open) return;
    dialog.close();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
  }
  dialog.querySelector('button').addEventListener('click', closeWarning);
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeWarning(); });
  function render() {
    var now = Date.now(), older = false;
    peers.forEach(function (peer, peerId) {
      // Allow background-tab throttling; crashed pages expire without saved registrations.
      if (now - peer.seen > 150000) { peers.delete(peerId); return; }
      if (peer.started < started || (peer.started === started && peerId < id)) older = true;
    });
    banner.hidden = peers.size === 0;
    if (!peers.size) { closeWarning(); return; }
    // Only the later window opens a dialog, once per page load. Do not cover another modal.
    if (older && !warned && document.visibilityState !== 'hidden' && !document.querySelector('dialog[open]') && !document.fullscreenElement) {
      previousFocus = document.activeElement;
      dialog.showModal();
      warned = true;
    }
  }
  function send(type) {
    var message = {v:1, scope:scope, id:id, started:started, type:type, sequence:++sequence};
    if (channel) { try { channel.postMessage(message); } catch (_) {} }
    // Also bridge file:// windows where BroadcastChannel may have separate origins.
    // Never read a persisted signal: old/crashed windows cannot become ghost peers.
    try { localStorage.setItem(key, JSON.stringify(message)); localStorage.removeItem(key); } catch (_) {}
  }
  function receive(message) {
    if (!active || !message || message.v !== 1 || message.scope !== scope || message.id === id ||
        typeof message.id !== 'string' || !Number.isFinite(message.started) ||
        !['hello','alive','bye'].includes(message.type)) return;
    if (message.type === 'bye') peers.delete(message.id);
    else {
      var known = peers.get(message.id);
      peers.set(message.id, {started:message.started, seen:Date.now()});
      if (message.type === 'hello' || !known) send('alive');
    }
    render();
  }
  try {
    channel = new BroadcastChannel('ft-window-presence-v1');
    channel.onmessage = function (event) { receive(event.data); };
  } catch (_) {}
  window.addEventListener('storage', function (event) {
    if (event.key !== key || !event.newValue) return;
    try { receive(JSON.parse(event.newValue)); } catch (_) {}
  });
  window.addEventListener('pagehide', function () { send('bye'); active = false; });
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) { active = true; peers.clear(); send('hello'); render(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (active && document.visibilityState !== 'hidden') { send('hello'); render(); }
  });
  setInterval(function () { if (active) { send('alive'); render(); } }, 15000);
  send('hello');
})();
