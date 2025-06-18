const express = require('express');
const router = express.Router();
const JournalVoucher = require('../models/JournalVoucher');

router.get('/', async (req, res) => {
  try {
    const vouchers = await JournalVoucher.find();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newVoucher = await JournalVoucher.create(req.body);
    res.status(201).json(newVoucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await JournalVoucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await JournalVoucher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
