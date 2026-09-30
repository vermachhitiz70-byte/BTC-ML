/* BTC ML AI Checkout v1 — validates order form, stores order, shows success. */
(function () {
  if (window.__fbCheckoutInit) return;
  window.__fbCheckoutInit = true;
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var form = document.getElementById('fb-co-form');
    if (!form) return;
    var err = document.getElementById('fb-co-err');
    var ok = document.getElementById('fb-co-ok');
    function fail(msg, input) {
      err.textContent = msg;
      err.style.display = 'block';
      if (input) { input.classList.add('fb-co-bad'); input.focus(); }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.style.display = 'none';
      var bad = form.querySelectorAll('.fb-co-bad');
      for (var i = 0; i < bad.length; i++) bad[i].classList.remove('fb-co-bad');
      var name = document.getElementById('fb-co-name').value.trim();
      var email = document.getElementById('fb-co-email').value.trim();
      var phone = document.getElementById('fb-co-phone').value.trim();
      if (!name) return fail('Please enter your full name.', document.getElementById('fb-co-name'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.', document.getElementById('fb-co-email'));
      if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) return fail('Please enter a valid phone number.', document.getElementById('fb-co-phone'));
      var id = 'BTC-' + Date.now().toString(36).toUpperCase();
      try {
        var k = 'btcmlai_orders';
        var arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.push({ id: id, slug: form.getAttribute('data-slug'), name: form.getAttribute('data-name'), price: form.getAttribute('data-price'), customer: name, email: email, phone: phone, at: new Date().toISOString() });
        localStorage.setItem(k, JSON.stringify(arr));
      } catch (ex) { /* ignore */ }
      document.getElementById('fb-co-orderid').textContent = id;
      form.style.display = 'none';
      ok.classList.add('fb-show');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
