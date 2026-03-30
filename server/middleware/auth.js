const axios = require('axios');

// Verify Memberstack JWT token and attach member to req
async function verifyMember(req, res, next) {
  const token = req.headers['x-memberstack-token'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const response = await axios.get('https://api.memberstack.com/v1/members/me', {
      headers: {
        'x-memberstack-token': token,
        'x-api-key': process.env.MEMBERSTACK_SECRET_KEY,
      },
    });

    req.member = response.data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { verifyMember };
