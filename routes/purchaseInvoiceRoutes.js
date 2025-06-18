const express = require('express');
const router = express.Router();
const PurchaseInvoice = require('../models/PurchaseInvoice');

// GET /api/purchase-invoices/new-number
router.get('/new-number', async (req, res) => {
  try {
    const lastInvoice = await PurchaseInvoice.findOne().sort({ createdAt: -1 });
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.replace(/\D/g, '')) || 0 : 0;
    const newNumber = `PINV${(lastNumber + 1).toString().padStart(5, '0')}`;
    res.json({ invoiceNumber: newNumber });
  } catch (err) {
    console.error('❌ Failed to generate purchase invoice number:', err.message);
    res.status(500).json({ message: 'Failed to generate purchase invoice number' });
  }
});


router.get('/', async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find().populate('supplier');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newInvoice = await PurchaseInvoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await PurchaseInvoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PurchaseInvoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
