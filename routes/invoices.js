const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// GET all
router.get('/', async (req, res) => {
  const invoices = await Invoice.find().populate('customer');
  res.json(invoices);
});

// POST
router.post('/', async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.status(201).json(invoice);
});

// PUT
router.put('/:id', async (req, res) => {
  const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
