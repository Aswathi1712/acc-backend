const express = require('express');
const router = express.Router();
const SalesReturn = require('../models/SalesReturn'); // Create this model


// Auto-increment return number
router.get('/new-number', async (req, res) => {
  try {
    const lastReturn = await SalesReturn.findOne().sort({ createdAt: -1 });
    const lastNumber = lastReturn ? parseInt(lastReturn.returnNumber?.slice(3)) || 0 : 0;
    const newNumber = `RET${(lastNumber + 1).toString().padStart(5, '0')}`;
    res.json({ returnNumber: newNumber });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate return number' });
  }
});
// GET all sales returns
router.get('/', async (req, res) => {
  try {
    const returns = await SalesReturn.find().populate('customer');
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new return
router.post('/', async (req, res) => {
  try {
    const newReturn = await SalesReturn.create(req.body);
    res.status(201).json(newReturn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update return
router.put('/:id', async (req, res) => {
  try {
    const updated = await SalesReturn.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE return
router.delete('/:id', async (req, res) => {
  try {
    await SalesReturn.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
