const express = require('express');
const axios = require('axios');
const router = express.Router();
const { verifyMember } = require('../middleware/auth');

const MS_API = 'https://admin.memberstack.com';
const headers = () => ({
  'x-api-key': process.env.MEMBERSTACK_SECRET_KEY,
});

// GET /api/member — return current member (requires token)
router.get('/member', verifyMember, (req, res) => {
  res.json(req.member);
});

// GET /api/members — list all members (server-side only)
router.get('/members', async (req, res) => {
  try {
    const response = await axios.get(`${MS_API}/members`, { headers: headers() });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/plans — list all plans
router.get('/plans', async (req, res) => {
  try {
    const response = await axios.get(`${MS_API}/plans`, { headers: headers() });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gated-content — return content only if member has the right plan
router.get('/gated-content', verifyMember, (req, res) => {
  const planId = process.env.MEMBERSTACK_PLAN_ID;
  const memberPlans = req.member?.planConnections?.map(p => p.planId) || [];

  if (!memberPlans.includes(planId)) {
    return res.status(403).json({ error: 'Access denied — upgrade required' });
  }

  res.json({ access: true, content: 'Your gated content here' });
});

module.exports = router;
