/**
 * Webflow Embed — Memberstack Initialization
 * Paste this in Webflow's "Inside <head> tag" custom code section.
 *
 * Replace APP_ID with your Memberstack app ID.
 */

(function () {
  var script = document.createElement('script');
  script.src = 'https://api.memberstack.com/static/memberstack.js?custom';
  script.setAttribute('data-memberstack-app', 'app_cmklqoq5203n60su9hwxwbtiv');
  script.defer = true;
  document.head.appendChild(script);
})();
