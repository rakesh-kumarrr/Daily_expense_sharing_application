require('dotenv').config(); // Load environment variables first
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
console.log('JWT Secret:', process.env.JWT_SECRET); // Ensure this is correctly printed

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
