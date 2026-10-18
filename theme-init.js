/*
 * Put the stored theme on <html> before the first paint.
 *
 * React cannot set the class until it has rendered, and a class set after the
 * first paint means somebody who works in dark sees a white flash on every load.
 * So this runs as a classic, blocking script in <head>:
 *
 *   <script src="/theme-init.js" data-storage-key="myapp.preferences"></script>
 *
 * It is a file rather than an inline snippet because every runtime the kit
 * targets forbids inline script: an MV3 extension cannot allow it at all, and
 * Tauri and Electron apps should not. It reads localStorage[data-storage-key],
 * which may hold `"dark"`, `"light"`, `"system"` or JSON with a `theme` field.
 * Anything else, or no storage at all, means `system`.
 */
(function () {
  try {
    var key = document.currentScript && document.currentScript.dataset.storageKey;
    var raw = key ? localStorage.getItem(key) : null;
    var choice = 'system';
    if (raw === 'dark' || raw === 'light' || raw === 'system') choice = raw;
    else if (raw) choice = JSON.parse(raw).theme || 'system';
    var dark =
      choice === 'dark' ||
      (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (error) {
    // No storage, unreadable JSON, no matchMedia: the light set is the default.
  }
})();
