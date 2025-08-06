const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a new booking
router.post('/', bookingController.createBooking);

// Get all bookings for an agent
router.get('/agent/:agentId', bookingController.getAgentBookings);

// Get all bookings for a customer
router.get('/customer/:customerId', bookingController.getCustomerBookings);

// Approve a booking
router.patch('/:bookingId/approve', bookingController.approveBooking);

// Reject a booking
router.patch('/:bookingId/reject', bookingController.rejectBooking);

// Update payment status
router.patch('/:bookingId/payment-status', bookingController.updatePaymentStatus);

// Delete a booking and its related payment
router.delete('/:bookingId', bookingController.deleteBooking);

// Get all bookings (admin)
router.get('/', bookingController.getAllBookings);

module.exports = router; 