/* BTCMLTAI product tabs v1 — vanilla tab switching. */
(function () {
  if (window.__fbTabsInit) return;
  window.__fbTabsInit = true;
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-fb-tab]') : null;
      if (!b) return;
      var wrap = b.closest('.fb-sp-tabs');
      if (!wrap) return;
      e.preventDefault();
      var key = b.getAttribute('data-fb-tab');
      var btns = wrap.querySelectorAll('[data-fb-tab]');
      for (var i = 0; i < btns.length; i++) btns[i].classList.remove('on');
      b.classList.add('on');
      var panels = wrap.querySelectorAll('[data-fb-panel]');
      for (var j = 0; j < panels.length; j++) {
        panels[j].classList.toggle('on', panels[j].getAttribute('data-fb-panel') === key);
      }
    });
  });
})();
