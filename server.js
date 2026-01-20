require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log('DB synced');
  app.listen(process.env.PORT, () => {
    console.log(`Server on http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error('DB Error:', err));
