// Delete a booking and its related payment
exports.deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        // Remove the booking
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Optionally, remove related payment if you have a Payment model
        // await Payment.deleteMany({ booking: bookingId });
        // Set car status to available if booking was not rejected
        if (booking.status !== 'rejected') {
            await Car.findByIdAndUpdate(booking.car, { status: 'available' });
        }
        res.json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { car, customer, agent, dateFrom, dateTo, location, price, paymentMethod, paymentNumber } = req.body;
        // Set car status to pending
        await Car.findByIdAndUpdate(car, { status: 'pending' });
        const booking = await Booking.create({
            car,
            customer,
            agent,
            dateFrom,
            dateTo,
            location,
            price,
            paymentMethod,
            paymentNumber,
            status: 'pending',
            paymentStatus: 'unpaid'
        });
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings for an agent
exports.getAgentBookings = async (req, res) => {
    try {
        const { agentId } = req.params;
        const bookings = await Booking.find({ agent: agentId }).populate('car');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings for a customer
exports.getCustomerBookings = async (req, res) => {
    try {
        const { customerId } = req.params;
        const bookings = await Booking.find({ customer: customerId }).populate('car');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Approve a booking
exports.approveBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'approved' },
            { new: true }
        );
        // Set car status to rented
        await Car.findByIdAndUpdate(booking.car, { status: 'rented' });
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reject a booking
exports.rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'rejected' },
            { new: true }
        );
        // Set car status to available
        await Car.findByIdAndUpdate(booking.car, { status: 'available' });
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('car');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { paymentStatus } = req.body;
        
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { paymentStatus },
            { new: true }
        );
        
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 