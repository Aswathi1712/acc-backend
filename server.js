const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Route imports
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/sales-returns', require('./routes/salesReturnRoutes'));
app.use('/api/purchase-invoices', require('./routes/purchaseInvoiceRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/pdcs', require('./routes/pdcRoutes'));

// ✅ Add Journal Vouchers API route
app.use('/api/journal-vouchers', require('./routes/journalVouchers'));

// Optional: Journal entries for reconciliation or GL (can be removed if unused)
app.use('/api/journals', require('./routes/journalRoutes'));

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Port setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
