const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// const { authenticateToken } = require('../middleware/auth');

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Create admin payment intent for paying agents
router.post('/create-admin-payment-intent', paymentController.createAdminPaymentIntent);

// Confirm payment
router.post('/confirm-payment', paymentController.confirmPayment);

// Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

// Agent approval with bank details
router.post('/booking/:bookingId/approve-with-bank-details', paymentController.agentApproveWithBankDetails);

// Admin payment to agent
router.post('/:paymentId/admin-pay-agent', paymentController.adminPayAgent);

// Admin payment to agent via Stripe
router.post('/:paymentId/admin-pay-agent-stripe', paymentController.adminPayAgentStripe);

// Delete a payment record
router.delete('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    await require('../models/Payment').findByIdAndDelete(paymentId);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all payments for admin
router.get('/admin/all', paymentController.getAllPayments);

module.exports = router; 