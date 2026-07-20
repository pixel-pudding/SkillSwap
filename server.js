const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5006;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillswap';

app.use(cors());
app.use(express.json({ strict: false }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/messages');

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', messageRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});