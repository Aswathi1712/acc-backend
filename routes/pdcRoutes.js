// routes/pdcRoutes.js
const express = require('express');
const router = express.Router();
const PDC = require('../models/PDC');

// @route   POST /api/pdc
// @desc    Create new PDC entry
router.post('/', async (req, res) => {
  try {
    const newPDC = new PDC(req.body);
    const saved = await newPDC.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving PDC', error: err.message });
  }
});

// @route   GET /api/pdc
// @desc    Get all PDCs
router.get('/', async (req, res) => {
  try {
    const pdcs = await PDC.find().populate('party');
    res.json(pdcs);
  } catch (err) {
    console.error('Error fetching PDCs:', err);
    res.status(500).json({ message: 'Error fetching PDCs', error: err.message });
  }
});


// @route   PUT /api/pdc/:id/realise
// @desc    Mark PDC as realised
router.put('/:id/realise', async (req, res) => {
  try {
    const updated = await PDC.findByIdAndUpdate(
      req.params.id,
      { status: 'Realised', realisationDate: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error realising PDC', error: err.message });
  }
});

// @route   PUT /api/pdc/:id/bounce
// @desc    Mark PDC as bounced
router.put('/:id/bounce', async (req, res) => {
  try {
    const updated = await PDC.findByIdAndUpdate(
      req.params.id,
      { status: 'Bounced', bounceReason: req.body.reason },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error bouncing PDC', error: err.message });
  }
});

module.exports = router;
