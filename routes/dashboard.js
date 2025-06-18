const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const PurchaseInvoice = require('../models/PurchaseInvoice');
const Payment = require('../models/Payment');
const Receipt = require('../models/Receipt');
const SalesReturn = require('../models/SalesReturn');

router.get('/summary', async (req, res) => {
  try {
    const [
      totalSales,
      totalReceipts,
      totalPurchases,
      totalPayments,
      totalReturns,
      pendingInvoicesCount,
      lowStockCount
    ] = await Promise.all([
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Receipt.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      PurchaseInvoice.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      SalesReturn.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Invoice.countDocuments({ status: { $ne: "paid" } }),
      // Mock: Assume products model exists with stock info
      // Product.countDocuments({ stock: { $lt: 10 } })
      Promise.resolve(5) // Replace with actual product count logic
    ]);

    const data = {
      totalSales: totalSales[0]?.total || 0,
      totalReceipts: totalReceipts[0]?.total || 0,
      totalPurchases: totalPurchases[0]?.total || 0,
      totalPayments: totalPayments[0]?.total || 0,
      totalReturns: totalReturns[0]?.total || 0,
      pendingInvoicesCount,
      lowStockCount,
      profit: (totalReceipts[0]?.total || 0) - (totalPayments[0]?.total || 0),
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
