/**
 * Webflow Embed — Memberstack Gated Content
 * Paste this in Webflow's "Before </body> tag" custom code section.
 *
 * Plan ID: pln_member-5l7v0yls
 *
 * Usage in Webflow Designer:
 *   Add  data-ms-content="pln_member-5l7v0yls"  to any element to gate it.
 *   Add  data-ms-hide="pln_member-5l7v0yls"     to show only to non-members.
 */

(function () {
  const PLAN_ID = 'pln_member-5l7v0yls';

  // Wait for Memberstack to be ready
  window.MemberStack = window.MemberStack || {};

  window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
    if (!member) {
      handleGuest();
      return;
    }

    const memberPlanIds = (member.planConnections || []).map(p => p.planId);
    const hasPlan = memberPlanIds.includes(PLAN_ID);

    if (hasPlan) {
      handleMemberWithAccess(member);
    } else {
      handleMemberWithoutAccess(member);
    }
  });

  function handleGuest() {
    // Hide all gated content
    document.querySelectorAll('[data-ms-content]').forEach(el => {
      el.style.display = 'none';
    });
    // Show guest-only elements
    document.querySelectorAll('[data-ms-hide]').forEach(el => {
      el.style.display = '';
    });
  }

  function handleMemberWithAccess(member) {
    // Show gated content for this plan
    document.querySelectorAll(`[data-ms-content="${PLAN_ID}"]`).forEach(el => {
      el.style.display = '';
    });
    // Hide upgrade CTAs
    document.querySelectorAll(`[data-ms-hide="${PLAN_ID}"]`).forEach(el => {
      el.style.display = 'none';
    });
  }

  function handleMemberWithoutAccess(member) {
    // Hide content they can't access
    document.querySelectorAll(`[data-ms-content="${PLAN_ID}"]`).forEach(el => {
      el.style.display = 'none';
    });
    // Show upgrade CTA
    document.querySelectorAll(`[data-ms-hide="${PLAN_ID}"]`).forEach(el => {
      el.style.display = '';
    });
  }
})();
