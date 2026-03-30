require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webhooks = require('./routes/webhooks');
const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/webhooks', webhooks);
app.use('/api', api);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
