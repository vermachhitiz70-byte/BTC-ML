/* BTC ML AI Checkout v2 — details -> BEP20 crypto payment -> API order. */
(function () {
  if (window.__fbCheckoutInit) return;
  window.__fbCheckoutInit = true;
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function fail(box, msg, input) {
    box.textContent = msg;
    box.style.display = 'block';
    if (input) { input.classList.add('fb-co-bad'); input.focus(); }
  }
  ready(function () {
    var form = document.getElementById('fb-co-form');
    if (!form) return;
    var err = document.getElementById('fb-co-err');
    var ok = document.getElementById('fb-co-ok');
    var pay = document.getElementById('fb-co-pay');
    var D = { name: '', email: '', phone: '' };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.style.display = 'none';
      var bad = form.querySelectorAll('.fb-co-bad');
      for (var i = 0; i < bad.length; i++) bad[i].classList.remove('fb-co-bad');
      D.name = document.getElementById('fb-co-name').value.trim();
      D.email = document.getElementById('fb-co-email').value.trim();
      D.phone = document.getElementById('fb-co-phone').value.trim();
      if (!D.name) return fail(err, 'Please enter your full name.', document.getElementById('fb-co-name'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(D.email)) return fail(err, 'Please enter a valid email address.', document.getElementById('fb-co-email'));
      if (!/^[+\d][\d\s\-()]{5,19}$/.test(D.phone)) return fail(err, 'Please enter a valid phone number.', document.getElementById('fb-co-phone'));
      form.style.display = 'none';
      pay.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    fetch('/api/settings').then(function (r) { return r.json(); }).then(function (j) {
      var s = (j && j.settings) || {};
      document.getElementById('fb-co-coin').textContent = s.pay_coin || 'USDT (BEP20)';
      document.getElementById('fb-co-addr').textContent = s.pay_address || '';
      document.getElementById('fb-co-qr').src = s.pay_qr || '/assets/images/bep20-qr-placeholder.svg';
    }).catch(function () {});

    document.getElementById('fb-co-copy').addEventListener('click', function () {
      var a = document.getElementById('fb-co-addr').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(a).catch(function () {});
      this.textContent = 'Copied';
    });

    document.getElementById('fb-co-shot').addEventListener('change', function () {
      var f = this.files && this.files[0];
      var e2 = document.getElementById('fb-co-err2');
      e2.style.display = 'none';
      var prev = document.getElementById('fb-co-preview');
      if (!f) return;
      if (!f.type.startsWith('image/')) { e2.textContent = 'Please upload an image file.'; e2.style.display = 'block'; return; }
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 1000 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        prev.src = c.toDataURL('image/jpeg', 0.72);
        prev.style.display = 'block';
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(f);
    });

    document.getElementById('fb-co-confirm').addEventListener('click', function () {
      var e2 = document.getElementById('fb-co-err2');
      e2.style.display = 'none';
      var tx = document.getElementById('fb-co-tx').value.trim();
      var prev = document.getElementById('fb-co-preview');
      if (tx.length < 10) { e2.textContent = 'Please enter your transaction hash ID.'; e2.style.display = 'block'; return; }
      if (!prev.src) { e2.textContent = 'Please upload your payment screenshot.'; e2.style.display = 'block'; return; }
      this.disabled = true;
      this.textContent = 'Placing order…';
      var btn = this;
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ slug: form.getAttribute('data-slug'), qty: 1 }],
          name: D.name, email: D.email, phone: D.phone,
          coin: document.getElementById('fb-co-coin').textContent,
          tx_hash: tx, screenshot: prev.src,
        }),
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (x) {
        if (!x.ok) throw new Error(x.j.error || 'Order failed.');
        try {
          var k = 'btcmlai_orders';
          var arr = JSON.parse(localStorage.getItem(k) || '[]');
          arr.push({ id: x.j.order_code, slug: form.getAttribute('data-slug'), at: new Date().toISOString() });
          localStorage.setItem(k, JSON.stringify(arr));
        } catch (ex) { /* ignore */ }
        document.getElementById('fb-co-orderid').textContent = x.j.order_code;
        pay.style.display = 'none';
        ok.classList.add('fb-show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }).catch(function (ex) {
        e2.textContent = ex.message;
        e2.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Confirm Order';
      });
    });
  });
})();
