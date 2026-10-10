/* BTCMLTAI Support Chatbot v2 — lead form + two-way live chat with presence. */
(function () {
  /* NOTE: with Next.js client-side navigation React may wipe the injected
     button/panel while this script is NOT re-executed. boot() is idempotent
     and a 1s watchdog re-creates the button whenever it goes missing. */

  var HEADSET =
    '<svg class="fb-ic-chat" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12.5" width="4" height="6.5" rx="1.6"/>' +
    '<rect x="17" y="12.5" width="4" height="6.5" rx="1.6"/>' +
    '<path d="M19 19a4 4 0 0 1-4 3h-2"/></svg>';
  var CLOSE =
    '<svg class="fb-ic-close" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* business hours helper */
  function nowInDubai() {
    try {
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
    } catch (e) {
      return new Date();
    }
  }
  function isBusinessHours() {
    const d = nowInDubai();
    const day = d.getDay(); // 0=Sun
    const hours = d.getHours() + d.getMinutes() / 60;
    return day >= 1 && day <= 5 && hours >= 10 && hours < 17;
  }
  function businessHoursText() {
    return isBusinessHours()
      ? '<span class="fb-online-dot"></span> Support is online — chat now'
      : 'Support is offline (Mon–Fri 10:00am – 5:00pm). We reply within 2–3 hours.';
  }

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null');
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function boot() {
    if (document.getElementById('fb-chat-btn')) return;
    if (window.__fbChatPoll) { clearInterval(window.__fbChatPoll); window.__fbChatPoll = null; }

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
        '<div class="fb-chat-headtext"><strong>BTCMLTAI Support</strong>' +
        '<span id="fb-chat-status">' + businessHoursText() + '</span></div>' +
      '</div>' +
      '<div class="fb-chat-body" id="fb-chat-body"></div>' +
      '<div class="fb-chat-form" id="fb-chat-form">' +
        '<div class="fb-chat-err" id="fb-chat-err"></div>' +
        '<input id="fb-chat-name" type="text" placeholder="Your name" autocomplete="name" maxlength="60">' +
        '<input id="fb-chat-email" type="email" placeholder="Email address" autocomplete="email" maxlength="80">' +
        '<input id="fb-chat-phone" type="tel" placeholder="Phone number" autocomplete="tel" maxlength="20">' +
        '<textarea id="fb-chat-firstmsg" placeholder="Type your message…" rows="2" maxlength="1000"></textarea>' +
        '<button class="fb-chat-submit" id="fb-chat-submit" type="button">Start Chat</button>' +
      '</div>' +
      '<div class="fb-chat-reply" id="fb-chat-reply" style="display:none">' +
        '<input id="fb-chat-text" type="text" placeholder="Type a message…" maxlength="1000" autocomplete="off">' +
        '<button id="fb-chat-send" type="button" aria-label="Send">➤</button>' +
      '</div>';

    var root = document.getElementById('fb-chat-root');
    if (root) { root.appendChild(btn); root.appendChild(panel); }
    else { document.body.appendChild(btn); document.body.appendChild(panel); }

    var body = panel.querySelector('#fb-chat-body');
    var form = panel.querySelector('#fb-chat-form');
    var reply = panel.querySelector('#fb-chat-reply');
    var err = panel.querySelector('#fb-chat-err');
    var statusEl = panel.querySelector('#fb-chat-status');
    var convoId = store('btcmlai_convo');
    var lastId = 0;
    var online = false;

    function scrollDown() { body.scrollTop = body.scrollHeight; }
    function say(text, who) {
      var m = el('div', 'fb-chat-msg fb-' + who);
      m.textContent = text;
      body.appendChild(m);
      scrollDown();
    }
    function setOnline(on) {
      online = on;
      statusEl.innerHTML = on
        ? '<span class="fb-online-dot"></span> Admin is online — chat now'
        : businessHoursText();
    }
    function fail(msg, input) {
      err.textContent = msg;
      err.style.display = 'block';
      if (input) { input.classList.add('fb-chat-bad'); input.focus(); }
    }
    function showReply() {
      form.style.display = 'none';
      reply.style.display = 'flex';
    }
    async function refresh() {
      if (!convoId) return;
      try {
        const r = await fetch('/api/chat?convo_id=' + convoId + '&after=' + lastId);
        const j = await r.json();
        setOnline(!!j.admin_online);
        for (const m of j.messages || []) {
          say(m.text, m.sender === 'admin' ? 'bot' : 'user');
          if (m.id > lastId) lastId = m.id;
        }
      } catch (e) { /* offline — retry next tick */ }
    }
    function startPoll() {
      if (window.__fbChatPoll) return;
      refresh();
      window.__fbChatPoll = setInterval(refresh, 3000);
    }
    async function sendText(text) {
      const name = panel.querySelector('#fb-chat-name').value.trim();
      const email = panel.querySelector('#fb-chat-email').value.trim();
      const phone = panel.querySelector('#fb-chat-phone').value.trim();
      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ convo_id: convoId || 0, name, email, phone, text }),
        });
        const j = await r.json();
        if (!r.ok) {
          if (j.need === 'name') { showForm(); return fail('Please enter your name.', panel.querySelector('#fb-chat-name')); }
          if (j.need === 'email') { showForm(); return fail('Please enter a valid email address.', panel.querySelector('#fb-chat-email')); }
          return fail(j.error || 'Could not send. Please try again.');
        }
        if (!convoId && j.convo_id) {
          convoId = j.convo_id;
          store('btcmlai_convo', convoId);
        }
        setOnline(!!j.admin_online);
        showReply();
        startPoll();
        refresh();
      } catch (e) {
        fail('Network error. Please try again.');
      }
    }
    function showForm() {
      reply.style.display = 'none';
      form.style.display = 'flex';
    }

    panel.querySelector('#fb-chat-submit').addEventListener('click', function () {
      err.style.display = 'none';
      const name = panel.querySelector('#fb-chat-name').value.trim();
      const email = panel.querySelector('#fb-chat-email').value.trim();
      const phone = panel.querySelector('#fb-chat-phone').value.trim();
      const msg = panel.querySelector('#fb-chat-firstmsg').value.trim();
      if (!name) return fail('Please enter your name.', panel.querySelector('#fb-chat-name'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.', panel.querySelector('#fb-chat-email'));
      if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) return fail('Please enter a valid phone number.', panel.querySelector('#fb-chat-phone'));
      if (!msg) { panel.querySelector('#fb-chat-firstmsg').focus(); return fail('Please type your message.'); }
      say('Hi, how can I help you today? (auto)', 'bot');
      sendText(msg);
      panel.querySelector('#fb-chat-firstmsg').value = '';
    });

    async function sendReply() {
      const inp = panel.querySelector('#fb-chat-text');
      const v = inp.value.trim();
      if (!v) return;
      inp.value = '';
      say(v, 'user');
      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ convo_id: convoId || 0, text: v }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Send failed');
        setOnline(!!j.admin_online);
        refresh();
      } catch (e) {
        say('Message could not be sent. Please try again.', 'bot');
      }
    }
    panel.querySelector('#fb-chat-send').addEventListener('click', sendReply);
    panel.querySelector('#fb-chat-text').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendReply();
    });

    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('fb-chat-show');
      btn.classList.toggle('fb-chat-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        if (convoId) { showReply(); startPoll(); }
        else if (body.children.length === 0) {
          say('Hi! Welcome to BTCMLTAI Support.', 'bot');
          say('Our team is available Mon–Fri 10:00am – 5:00pm (Dubai Time). We reply within 2–3 hours.', 'bot');
          say('Please share your name, email, phone number and query below.', 'bot');
        }
        scrollDown();
      }
    });

    /* auto-open after 2 seconds with welcome message */
    var autoOpenDone = store('btcmlai_chat_auto_opened');
    if (!autoOpenDone) {
      if (window.__fbChatAutoT) clearTimeout(window.__fbChatAutoT);
      window.__fbChatAutoT = setTimeout(function () {
        if (panel.classList.contains('fb-chat-show')) return;
        panel.classList.add('fb-chat-show');
        btn.classList.add('fb-chat-open');
        panel.setAttribute('aria-hidden', 'false');
        if (body.children.length === 0) {
          say('Hi! Welcome to BTCMLTAI Support.', 'bot');
          say('Our team is available Mon–Fri 10:00am – 5:00pm (Dubai Time). We reply within 2–3 hours.', 'bot');
          say('Please share your name, email, phone number and query below.', 'bot');
          var dismiss = el('button', 'fb-chat-dismiss', '× Don\'t show again');
          dismiss.type = 'button';
          dismiss.title = 'Dismiss welcome';
          dismiss.addEventListener('click', function () {
            store('btcmlai_chat_auto_opened', true);
            panel.classList.remove('fb-chat-show');
            btn.classList.remove('fb-chat-open');
            panel.setAttribute('aria-hidden', 'true');
          });
          body.appendChild(dismiss);
        }
        scrollDown();
        store('btcmlai_chat_auto_opened', true);
      }, 2000);
    }
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        panel.classList.remove('fb-chat-show');
        btn.classList.remove('fb-chat-open');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
    function openChat(orderMode) {
      if (!panel.classList.contains('fb-chat-show')) btn.click();
      if (orderMode && !convoId && body.children.length === 0) {
        say('Hi, how can I help you today?', 'bot');
      }
    }
    window.fbChatOpen = function (orderMode) { openChat(!!orderMode); };
  } /* end boot */

  window.__fbChatbotEnsure = boot;
  if (window.__fbChatbotInit) { ready(boot); return; }
  window.__fbChatbotInit = true;
  /* bound once — survives client-side navigation like the interval below */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-fb-chat]') : null;
    if (!t) return;
    e.preventDefault();
    if (window.fbChatOpen) window.fbChatOpen(true);
  });
  ready(boot);
  /* watchdog: re-inject the floating button if React removed it on navigation */
  setInterval(function () { if (!document.getElementById('fb-chat-btn')) boot(); }, 1000);
})();
