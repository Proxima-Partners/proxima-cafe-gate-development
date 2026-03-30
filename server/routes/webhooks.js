const express = require('express');
const router = express.Router();

// POST /webhooks/memberstack
router.post('/memberstack', (req, res) => {
  const event = req.body;

  console.log('Memberstack webhook received:', event.type);

  switch (event.type) {
    case 'member.created':
      handleMemberCreated(event.data);
      break;
    case 'member.updated':
      handleMemberUpdated(event.data);
      break;
    case 'member.deleted':
      handleMemberDeleted(event.data);
      break;
    case 'plan.added':
      handlePlanAdded(event.data);
      break;
    case 'plan.removed':
      handlePlanRemoved(event.data);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});

function handleMemberCreated(data) {
  console.log('New member:', data.member?.email);
  // TODO: sync to your DB, send welcome email, etc.
}

function handleMemberUpdated(data) {
  console.log('Member updated:', data.member?.email);
}

function handleMemberDeleted(data) {
  console.log('Member deleted:', data.member?.id);
}

function handlePlanAdded(data) {
  console.log('Plan added for member:', data.member?.email, '— plan:', data.plan?.id);
}

function handlePlanRemoved(data) {
  console.log('Plan removed for member:', data.member?.email, '— plan:', data.plan?.id);
}

module.exports = router;
