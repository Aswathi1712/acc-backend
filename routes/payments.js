const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const PurchaseInvoice = require('../models/PurchaseInvoice');

// Helper: Apply payments to invoices
async function applyPayments(appliedInvoices) {
  for (let { invoice, amount } of appliedInvoices) {
    const inv = await PurchaseInvoice.findById(invoice);
    if (!inv) continue;

    // Push new appliedPayment
    inv.appliedPayments.push({ payment: null, amount }); // We'll link payment after creating it
    await inv.save();
  }
}

// Helper: Rollback all payments from an invoice
async function rollbackPayments(paymentId) {
  const invoices = await PurchaseInvoice.find({ 'appliedPayments.payment': paymentId });
  for (let inv of invoices) {
    inv.appliedPayments = inv.appliedPayments.filter(p => p.payment.toString() !== paymentId);
    await inv.save();
  }
}

// CREATE Payment
router.post('/', async (req, res) => {
  try {
    const { paymentNumber, type, party, partyModel, date, amount, method, appliedInvoices,notes  } = req.body;

    const payment = await Payment.create({
      paymentNumber,
      type,
      party,
      partyModel,
      date,
      amount,
      method,
      appliedInvoices,
      notes 
    });

    // Now attach payment._id to each applied invoice
    for (let { invoice, amount } of appliedInvoices) {
      const inv = await PurchaseInvoice.findById(invoice);
      if (!inv) continue;

      inv.appliedPayments.push({ payment: payment._id, amount });
      await inv.save();
    }

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all payments
router.get('/', async (req, res) => {
  const payments = await Payment.find()
    .populate('party')
    .populate('appliedInvoices.invoice');
  res.json(payments);
});

// UPDATE payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Rollback previous payment applications
    await rollbackPayments(payment._id);

    const { paymentNumber, type, party, partyModel, date, amount, method, appliedInvoices,notes  } = req.body;

    // Update payment fields
    payment.paymentNumber = paymentNumber;
    payment.type = type;
    payment.party = party;
    payment.partyModel = partyModel;
    payment.date = date;
    payment.amount = amount;
    payment.method = method;
    payment.appliedInvoices = appliedInvoices; 
    payment.notes = notes;

    await payment.save();

    // Re-apply
    for (let { invoice, amount } of appliedInvoices) {
      const inv = await PurchaseInvoice.findById(invoice);
      if (!inv) continue;

      inv.appliedPayments.push({ payment: payment._id, amount });
      await inv.save();
    }

    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Not found' });

    await rollbackPayments(payment._id);
    await payment.deleteOne();

    res.json({ message: 'Payment deleted and invoice applications rolled back' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
