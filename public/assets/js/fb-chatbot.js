/* BTC ML AI Support Chatbot v1 — floating help icon + lead capture popup. */
(function () {
  if (window.__fbChatbotInit) return;
  window.__fbChatbotInit = true;

  var HEADSET =
    '<svg class="fb-ic-chat" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12.5" width="4" height="6.5" rx="1.6"/>' +
    '<rect x="17" y="12.5" width="4" height="6.5" rx="1.6"/>' +
    '<path d="M19 19a4 4 0 0 1-4 3h-2"/></svg>';
  var CLOSE =
    '<svg class="fb-ic-close" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M6 6l12 12M18 6L6 18"/></svg>';

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function scrollDown(body) { body.scrollTop = body.scrollHeight; }
  function saveLead(lead) {
    try {
      var k = 'btcmlai_leads';
      var arr = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push(lead);
      localStorage.setItem(k, JSON.stringify(arr));
    } catch (e) { /* storage unavailable — ignore */ }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (document.getElementById('fb-chat-btn')) return;

    var btn = el('button', null, HEADSET + CLOSE + '<span class="fb-chat-dot"></span>');
    btn.id = 'fb-chat-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Chat with support');

    var panel = el('div');
    panel.id = 'fb-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Support chat');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div class="fb-chat-head">' +
        '<span class="fb-chat-avatar">B</span>' +
        '<div class="fb-chat-headtext"><strong>BTC ML AI Support</strong>' +
        '<span>Typically replies within 24 hours</span></div>' +
      '</div>' +
      '<div class="fb-chat-body" id="fb-chat-body"></div>' +
      '<div class="fb-chat-form" id="fb-chat-form">' +
        '<div class="fb-chat-err" id="fb-chat-err"></div>' +
        '<input id="fb-chat-name" type="text" placeholder="Your name" autocomplete="name" maxlength="60">' +
        '<input id="fb-chat-email" type="email" placeholder="Email address" autocomplete="email" maxlength="80">' +
        '<input id="fb-chat-phone" type="tel" placeholder="Phone number" autocomplete="tel" maxlength="20">' +
        '<button class="fb-chat-submit" id="fb-chat-submit" type="button">Submit</button>' +
      '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var body = panel.querySelector('#fb-chat-body');
    var form = panel.querySelector('#fb-chat-form');
    var err = panel.querySelector('#fb-chat-err');
    var submitted = false;

    function botSay(text) {
      var m = el('div', 'fb-chat-msg fb-bot', text);
      body.appendChild(m);
      scrollDown(body);
    }
    function userSay(text) {
      var m = el('div', 'fb-chat-msg fb-user');
      m.textContent = text;
      body.appendChild(m);
      scrollDown(body);
    }
    function greet() {
      body.innerHTML = '';
      botSay('Hi, how can I help you today?');
      botSay('Please share your name, email address and phone number so our support team can reach you.');
    }
    function fail(msg, input) {
      err.textContent = msg;
      err.style.display = 'block';
      if (input) {
        input.classList.add('fb-chat-bad');
        input.focus();
      }
    }
    function clearBad() {
      err.style.display = 'none';
      var bad = form.querySelectorAll('.fb-chat-bad');
      for (var i = 0; i < bad.length; i++) bad[i].classList.remove('fb-chat-bad');
    }
    function submit() {
      clearBad();
      var name = panel.querySelector('#fb-chat-name').value.trim();
      var email = panel.querySelector('#fb-chat-email').value.trim();
      var phone = panel.querySelector('#fb-chat-phone').value.trim();
      if (!name) return fail('Please enter your name.', panel.querySelector('#fb-chat-name'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.', panel.querySelector('#fb-chat-email'));
      if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) return fail('Please enter a valid phone number.', panel.querySelector('#fb-chat-phone'));
      submitted = true;
      userSay(name + '  •  ' + email + '  •  ' + phone);
      saveLead({ name: name, email: email, phone: phone, at: new Date().toISOString() });
      form.style.display = 'none';
      var tp = el('div', 'fb-chat-msg fb-bot fb-typing', '<i></i><i></i><i></i>');
      body.appendChild(tp);
      scrollDown(body);
      setTimeout(function () {
        if (tp.parentNode) tp.parentNode.removeChild(tp);
        botSay('Thank you, ' + name + '. Our team will contact you within 24 hours. You are a priority customer to us.');
        var again = el('button', 'fb-chat-again', 'Send another response');
        again.type = 'button';
        again.onclick = function () {
          submitted = false;
          panel.querySelector('#fb-chat-name').value = '';
          panel.querySelector('#fb-chat-email').value = '';
          panel.querySelector('#fb-chat-phone').value = '';
          form.style.display = 'flex';
          if (again.parentNode) again.parentNode.removeChild(again);
          greet();
          scrollDown(body);
        };
        body.appendChild(again);
        scrollDown(body);
      }, 900);
    }

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('fb-chat-show');
      btn.classList.toggle('fb-chat-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open && !submitted && body.children.length === 0) greet();
      if (open) scrollDown(body);
    });
    function openChat(orderMode) {
      if (!panel.classList.contains('fb-chat-show')) btn.click();
      if (orderMode && !submitted) {
        if (body.children.length === 0) greet();
        botSay('Great choice! Share your details below to place your order. Our team will confirm it within 24 hours.');
      }
    }
    window.fbChatOpen = function () { openChat(false); };
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-fb-chat]') : null;
      if (!t) return;
      e.preventDefault();
      openChat(true);
    });
    panel.querySelector('#fb-chat-submit').addEventListener('click', submit);
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') submit();
      if (e.key === 'Escape') {
        panel.classList.remove('fb-chat-show');
        btn.classList.remove('fb-chat-open');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  });
})();
