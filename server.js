const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ strict: false }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const mongoUri = process.env.MONGO_URI;

console.log('MONGO_URI length:', mongoUri?.length);
console.log('MONGO_URI preview:', mongoUri?.replace(/:([^:@]+)@/, ':***@'));

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/messages');

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', messageRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});