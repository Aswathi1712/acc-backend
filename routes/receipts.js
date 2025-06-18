const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Invoice = require('../models/Invoice');

// GET invoices by customerId with outstanding balance




// Generate auto-increment receipt number
router.get('/new-number', async (req, res) => {
  try {
    const last = await Receipt.findOne().sort({ createdAt: -1 });
    const lastNumber = last ? parseInt(last.receiptNumber?.slice(3)) || 0 : 0;
    const newNumber = `REC${(lastNumber + 1).toString().padStart(5, '0')}`;
    res.json({ receiptNumber: newNumber });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate receipt number' });
  }
});

router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find()
  .populate('customer')
  .populate('invoiceId');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save receipt & update invoice balance
router.post('/', async (req, res) => {
  try {
    const receipt = await Receipt.create(req.body);

    // If invoice is linked, update balance, status and amountPaid
    if (req.body.invoiceId) {
      const invoice = await Invoice.findById(req.body.invoiceId);
      if (invoice) {
        const receiptAmount = parseFloat(receipt.amount);

        // Update amountPaid
        invoice.amountPaid += receiptAmount;

        // Update balance
        invoice.balance = Math.max(invoice.totalAmount - invoice.amountPaid, 0);

        // Update status
        if (invoice.balance <= 0) {
          invoice.status = 'paid';
        } else {
          invoice.status = 'partial';
        }

        await invoice.save();
      }
    }

    res.status(201).json(receipt);
  } catch (err) {
    console.error('Error creating receipt:', err);
    res.status(400).json({ message: err.message });
  }
});


// router.post('/', async (req, res) => {
//   try {
//     const newReceipt = await Receipt.create(req.body);
//     res.status(201).json(newReceipt);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.put('/:id', async (req, res) => {
  try {
    const existingReceipt = await Receipt.findById(req.params.id);
    if (!existingReceipt) return res.status(404).json({ message: 'Receipt not found' });

    const updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If invoice is linked
    if (req.body.invoiceId) {
      const invoice = await Invoice.findById(req.body.invoiceId);
      if (invoice) {
        const oldAmount = parseFloat(existingReceipt.amount);
        const newAmount = parseFloat(req.body.amount);

        // Recalculate amountPaid and balance
        invoice.amountPaid = invoice.amountPaid - oldAmount + newAmount;
        invoice.balance = Math.max(invoice.totalAmount - invoice.amountPaid, 0);

        // Update status
        invoice.status = invoice.balance <= 0 ? 'paid' : 'partial';

        await invoice.save();
      }
    }

    res.json(updatedReceipt);
  } catch (err) {
    console.error('Error updating receipt:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Receipt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
