/* BTCMLTAI Cart v1 — add-to-cart buttons, toast, header badge. */
(function () {
  if (window.__fbCartInit) return;
  window.__fbCartInit = true;

  function getCart() {
    try { return JSON.parse(localStorage.getItem('btcmlai_cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(c) {
    try { localStorage.setItem('btcmlai_cart', JSON.stringify(c)); } catch (e) {}
  }
  function count() {
    return getCart().reduce(function (s, i) { return s + (i.qty || 1); }, 0);
  }
  function badge() {
    var n = count();
    var link = document.querySelector('a[href="/cart"]');
    if (!link) return;
    var b = link.querySelector('.fb-cart-count');
    if (!b && n > 0) {
      b = document.createElement('span');
      b.className = 'fb-cart-count';
      link.appendChild(b);
    }
    if (b) {
      b.textContent = n > 9 ? '9+' : String(n);
      b.style.display = n > 0 ? 'inline-flex' : 'none';
    }
  }
  function toast() {
    var old = document.getElementById('fb-cart-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var d = document.createElement('div');
    d.id = 'fb-cart-toast';
    d.innerHTML = 'Added to cart. <a href="/cart">View Cart</a>';
    document.body.appendChild(d);
    setTimeout(function () { d.classList.add('show'); }, 30);
    setTimeout(function () {
      d.classList.remove('show');
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 300);
    }, 2600);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    badge();
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('[data-add-cart]') : null;
      if (!a) return;
      e.preventDefault();
      var slug = a.getAttribute('data-add-cart');
      if (!slug) return;
      var cart = getCart();
      var found = false;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].slug === slug) { cart[i].qty = Math.min(10, (cart[i].qty || 1) + 1); found = true; break; }
      }
      if (!found) cart.push({ slug: slug, qty: 1 });
      saveCart(cart);
      badge();
      toast();
    });
    // quantity stepper on detail pages
    document.addEventListener('click', function (e) {
      var q = e.target && e.target.closest ? e.target.closest('[data-qty]') : null;
      if (!q) return;
      var inp = document.getElementById('fb-sp-qty');
      if (!inp) return;
      var v = parseInt(inp.value, 10) || 1;
      v = Math.max(1, Math.min(10, v + parseInt(q.getAttribute('data-qty'), 10)));
      inp.value = v;
    });
    // Buy Now: login-gated -> cart -> checkout
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('[data-buy-now]') : null;
      if (!b) return;
      e.preventDefault();
      var slug = b.getAttribute('data-buy-now');
      var qtyEl = document.getElementById('fb-sp-qty');
      var qty = qtyEl ? Math.max(1, Math.min(10, parseInt(qtyEl.value, 10) || 1)) : 1;
      fetch('/api/auth/me').then(function (r) { return r.json(); }).then(function (j) {
        var cart = getCart();
        var found = false;
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].slug === slug) { cart[i].qty = qty; found = true; break; }
        }
        if (!found) cart.push({ slug: slug, qty: qty });
        saveCart(cart);
        badge();
        if (j && j.user) window.location.href = '/cart';
        else window.location.href = '/login?next=/cart';
      }).catch(function () {
        window.location.href = '/login?next=/cart';
      });
    });
  });
})();
