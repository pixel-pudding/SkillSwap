const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://aditianand_db_user:<db_password>@cluster0.yrbh5ay.mongodb.net/?appName=Cluster0' , {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const messageRoutes = require('./routes/messages');

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', messageRoutes);

app.listen(5006, () => {
  console.log('Server running on port 5006');
});