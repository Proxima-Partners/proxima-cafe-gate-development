/**
 * Webflow Embed — Memberstack Gated Content
 * Paste this in Webflow's "Footer Code" custom code section (inside <script> tags).
 *
 * Plan ID: pln_member-5l7v0yls
 *
 * How it works:
 *   - Gates [data-ms-gated="true"] elements immediately on page load
 *   - Adds data-ms-content="!PLAN_ID" to the gate panel
 *   - Memberstack natively hides that panel for members with the plan
 *   - A poll detects the hide and removes the content clip for members
 */

(function () {
  var PLAN_ID = 'pln_member-5l7v0yls';

  var STYLES = '\
    .item-member-only-cta,\
    .item-mask,\
    [data-ms-content="!member"] { display: none !important; }\
    .ms-gate-fade {\
      position: absolute; bottom: 0; left: 0; right: 0; height: 280px;\
      background: linear-gradient(to bottom, rgba(248,239,227,0) 0%, rgba(248,239,227,0.7) 35%, #f8efe3 70%);\
      pointer-events: none;\
    }\
    @keyframes ms-slide-up {\
      from { transform: translateY(100%); opacity: 0; }\
      to   { transform: translateY(0);    opacity: 1; }\
    }\
    .ms-gate-panel {\
      background: #f8efe3;\
      border-top: 1px solid rgba(0,0,0,0.1);\
      padding: 40px 24px 48px;\
      text-align: center;\
      font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;\
      animation: ms-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;\
    }\
    .ms-gate-panel h2 {\
      font-family: Georgia, "Times New Roman", serif;\
      font-size: 26px; font-weight: 700; color: #121212;\
      margin: 0 0 12px; line-height: 1.3;\
    }\
    .ms-gate-panel p {\
      font-size: 15px; color: #555; margin: 0 0 24px;\
      max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.5;\
    }\
    .ms-gate-input-wrap { max-width: 420px; margin: 0 auto 12px; text-align: left; }\
    .ms-gate-input-wrap label { display: block; font-size: 13px; color: #333; margin-bottom: 6px; font-weight: 500; }\
    .ms-gate-input {\
      width: 100%; padding: 12px 14px; font-size: 15px;\
      border: 1px solid #aaa; border-radius: 2px; outline: none;\
      box-sizing: border-box; color: #121212;\
    }\
    .ms-gate-input:focus { border-color: #121212; }\
    .ms-gate-btn {\
      display: block; width: 100%; max-width: 420px;\
      margin: 0 auto 16px; padding: 14px;\
      background: #121212; color: #fff; font-size: 15px; font-weight: 600;\
      border: none; border-radius: 2px; cursor: pointer; letter-spacing: 0.01em;\
    }\
    .ms-gate-btn:hover { background: #333; }\
    .ms-gate-or { font-size: 13px; color: #999; margin-bottom: 14px; }\
    .ms-gate-login {\
      font-size: 14px; color: #121212; text-decoration: underline;\
      cursor: pointer; background: none; border: none; padding: 0;\
    }\
    .ms-gate-login:hover { color: #555; }\
  ';

  function injectStyles() {
    if (document.getElementById('ms-gate-styles')) return;
    var style = document.createElement('style');
    style.id = 'ms-gate-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function openMemberstackModal(type, email) {
    // Try the JS API first (available in some Memberstack setups)
    if (window.$memberstackDom) {
      if (type === 'signup') {
        window.$memberstackDom.openModal('signup', { email: email || '' });
      } else {
        window.$memberstackDom.openModal('login');
      }
      return;
    }
    // Fallback: trigger via data-ms-modal attribute click (Memberstack delegation)
    var btn = document.createElement('button');
    btn.setAttribute('data-ms-modal', type);
    btn.style.cssText = 'position:absolute;opacity:0;pointer-events:none;';
    document.body.appendChild(btn);
    btn.click();
    setTimeout(function () { btn.remove(); }, 100);
  }

  function buildGate() {
    var panel = document.createElement('div');
    panel.className = 'ms-gate-panel';
    panel.innerHTML =
      '<h2>Create a free account, or log in.</h2>' +
      '<p>Become a member to access exclusive content, updates and more.</p>' +
      '<div class="ms-gate-input-wrap">' +
        '<label for="ms-gate-email">Email address</label>' +
        '<input id="ms-gate-email" class="ms-gate-input" type="email" />' +
      '</div>' +
      '<button class="ms-gate-btn" id="ms-gate-continue">Continue</button>' +
      '<div class="ms-gate-or">or</div>' +
      '<button class="ms-gate-login" id="ms-gate-login">Log in</button>';

    panel.querySelector('#ms-gate-continue').addEventListener('click', function () {
      var emailEl = document.getElementById('ms-gate-email');
      openMemberstackModal('signup', emailEl ? emailEl.value : '');
    });

    panel.querySelector('#ms-gate-login').addEventListener('click', function () {
      openMemberstackModal('login');
    });

    return panel;
  }

  function gateElement(el) {
    el.style.maxHeight = '160px';
    el.style.overflow = 'hidden';
    el.style.position = 'relative';

    var fade = document.createElement('div');
    fade.className = 'ms-gate-fade';
    el.appendChild(fade);

    var gate = buildGate();
    // Memberstack natively hides this panel for members with the plan
    gate.setAttribute('data-ms-content', '!' + PLAN_ID);
    el.parentNode.insertBefore(gate, el.nextSibling);

    // Poll: when Memberstack hides the gate panel, the user has access — remove the clip
    var polls = 0;
    var interval = setInterval(function () {
      polls++;
      var hidden = gate.style.display === 'none' || !document.body.contains(gate);
      if (hidden) {
        el.style.maxHeight = '';
        el.style.overflow = '';
        if (fade.parentNode) fade.remove();
        clearInterval(interval);
      }
      if (polls > 75) clearInterval(interval); // stop after ~15 seconds
    }, 200);
  }

  function init() {
    injectStyles();
    // Hide preview excerpt for members with the plan (Memberstack processes this before rendering)
    document.querySelectorAll('.item-subtitle').forEach(function (el) {
      el.setAttribute('data-ms-content', '!' + PLAN_ID);
    });
    document.querySelectorAll('[data-ms-gated="true"]').forEach(gateElement);
  }

  // ── Test panel (only active when ?test=true is in the URL) ──────────────
  function initTestPanel() {
    if (window.location.search.indexOf('test=true') === -1) return;

    var panel = document.createElement('div');
    panel.style.cssText = 'position:fixed;top:16px;right:16px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:16px;font-family:-apple-system,sans-serif;font-size:13px;z-index:99999;box-shadow:0 2px 12px rgba(0,0,0,0.12);min-width:180px;';
    panel.innerHTML =
      '<div style="font-size:11px;font-weight:600;letter-spacing:0.05em;color:#999;text-transform:uppercase;margin-bottom:10px;">Test mode</div>' +
      '<button id="tp-guest" style="display:block;width:100%;margin-bottom:6px;padding:8px 12px;border:1px solid #ddd;border-radius:4px;background:#121212;color:#fff;cursor:pointer;font-size:13px;text-align:left;">Guest (not logged in)</button>' +
      '<button id="tp-member" style="display:block;width:100%;margin-bottom:6px;padding:8px 12px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer;font-size:13px;text-align:left;">Member (with plan)</button>' +
      '<button id="tp-noaccess" style="display:block;width:100%;padding:8px 12px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer;font-size:13px;text-align:left;">Member (no plan)</button>';
    document.body.appendChild(panel);

    var buttons = { guest: panel.querySelector('#tp-guest'), member: panel.querySelector('#tp-member'), noaccess: panel.querySelector('#tp-noaccess') };

    function setActive(mode) {
      Object.keys(buttons).forEach(function (k) {
        buttons[k].style.background = k === mode ? '#121212' : '#fff';
        buttons[k].style.color = k === mode ? '#fff' : '#121212';
      });
    }

    function simulateMember() {
      // Remove gate panels, unclip content, hide subtitle
      document.querySelectorAll('.ms-gate-panel').forEach(function (el) { el.style.display = 'none'; });
      document.querySelectorAll('[data-ms-gated="true"]').forEach(function (el) { el.style.maxHeight = ''; el.style.overflow = ''; });
      document.querySelectorAll('.item-subtitle').forEach(function (el) { el.style.display = 'none'; });
    }

    function simulateGuest() {
      // Re-apply gate, restore subtitle
      document.querySelectorAll('.ms-gate-panel').forEach(function (el) { el.style.display = ''; });
      document.querySelectorAll('[data-ms-gated="true"]').forEach(function (el) { el.style.maxHeight = '160px'; el.style.overflow = 'hidden'; });
      document.querySelectorAll('.item-subtitle').forEach(function (el) { el.style.display = ''; });
    }

    buttons.guest.addEventListener('click', function () { simulateGuest(); setActive('guest'); });
    buttons.member.addEventListener('click', function () { simulateMember(); setActive('member'); });
    buttons.noaccess.addEventListener('click', function () { simulateGuest(); setActive('noaccess'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); initTestPanel(); });
  } else {
    init();
    initTestPanel();
  }
})();
