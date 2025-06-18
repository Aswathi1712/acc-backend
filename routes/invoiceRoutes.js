const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');

console.log('✅ Invoice routes loaded');

router.get('/by-customer/:customerId', async (req, res) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.params.customerId);
    console.log('customerId');
    const invoices = await Invoice.find({
      customer: customerId,
      balance: { $gt: 0 }
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching invoices',
      error: err.message
    });
  }
});

// GET next invoice number
router.get('/new-number', async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.replace(/\D/g, '')) || 0 : 0;
    const newNumber = `INV${(lastNumber + 1).toString().padStart(5, '0')}`;
    res.json({ invoiceNumber: newNumber });
  } catch (err) {
    console.error('❌ Failed to generate invoice number:', err.message);
    res.status(500).json({ message: 'Failed to generate invoice number' });
  }
});

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('customer');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create invoice
router.post('/', async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error('❌ Failed to create invoice:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT update invoice
router.put('/:id', async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
