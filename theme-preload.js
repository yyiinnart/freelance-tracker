/* Local appearance preference. Loaded synchronously before styles to avoid a theme flash. */
(function () {
  'use strict';
  var key = 'ft_editorial_theme';
  var modes = ['original', 'dark', 'light'];
  function valid(value) { return modes.indexOf(value) !== -1; }
  function read() { try { var value = localStorage.getItem(key); return valid(value) ? value : 'original'; } catch (e) { return 'original'; } }
  function apply(value) {
    value = valid(value) ? value : 'original';
    var changed = document.documentElement.dataset.editorialTheme !== value;
    document.documentElement.dataset.editorialTheme = value;
    document.documentElement.style.colorScheme = value === 'light' ? 'light' : 'dark';
    if (changed) document.dispatchEvent(new CustomEvent('ft-theme-change', { detail: { theme: value } }));
    return value;
  }
  window.FTTheme = {
    get: function () { return document.documentElement.dataset.editorialTheme; },
    set: function (value) {
      if (!valid(value)) return false;
      var saved = true;
      try { localStorage.setItem(key, value); } catch (e) { saved = false; }
      apply(value);
      return saved;
    }
  };
  apply(read());
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) {
      apply(read());
      document.dispatchEvent(new CustomEvent('ft-theme-storage'));
    }
  });
})();
