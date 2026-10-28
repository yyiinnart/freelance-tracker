/* Session-only UI preference; deliberately does not access application storage. */
document.addEventListener('DOMContentLoaded', function () {
  var button = document.getElementById('editorial-theme-toggle');
  var sheet = document.getElementById('editorial-styles');
  var modes = ['original', 'dark', 'light'];
  var labels = ['原版深藍', '炭灰深色', '紙白淺色'];
  var mode = 0;
  function apply() {
    document.documentElement.dataset.editorialTheme = modes[mode];
    sheet.disabled = false;
    button.value = modes[mode];
    button.setAttribute('aria-label', '外觀模式');
    button.removeAttribute('aria-pressed');
  }
  apply();
  button.addEventListener('change', function () { mode = modes.indexOf(button.value); apply(); });
  // Capture the existing category hue for contrast-adjusted visual borders only.
  function tintLabels() {
    document.querySelectorAll('#v-proj .badge[style]').forEach(function (badge) {
      if (badge.style.color) badge.style.setProperty('--tag-hue', badge.style.color);
    });
    document.querySelectorAll('#v-proj .proj-table td:nth-child(3) span[style]').forEach(function (dot) {
      if (!dot.style.backgroundColor || !dot.classList.contains('rounded-full')) return;
      var tag = dot.parentElement;
      tag.classList.add('editorial-custom-tag');
      tag.style.setProperty('--tag-hue', dot.style.backgroundColor);
    });
  }
  tintLabels();
  new MutationObserver(tintLabels).observe(document.getElementById('v-proj'), {childList:true, subtree:true});
});
