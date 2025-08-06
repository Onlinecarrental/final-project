const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Chat = require('../models/Chat');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { bookingId, amount, currency = 'usd' } = req.body;
        
        const booking = await Booking.findById(bookingId).populate('car');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Create payment record
        const payment = await Payment.create({
            booking: bookingId,
            customer: booking.customer,
            agent: booking.agent,
            amount: amount,
            currency: currency,
            paymentMethod: booking.paymentMethod || 'stripe',
            status: 'pending'
        });

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            metadata: {
                bookingId: bookingId,
                paymentId: payment._id.toString(),
                customerId: booking.customer,
                agentId: booking.agent
            }
        });

        // Update payment with Stripe payment intent ID
        await Payment.findByIdAndUpdate(payment._id, {
            stripePaymentIntentId: paymentIntent.id
        });

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                paymentId: payment._id
            }
        });
    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create admin payment intent for paying agents
exports.createAdminPaymentIntent = async (req, res) => {
    try {
        const { paymentId, amount, currency = 'usd', agentId } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Create Stripe payment intent for admin to agent payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            metadata: {
                paymentId: paymentId,
                agentId: agentId,
                type: 'admin_to_agent'
            }
        });

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }
        });
    } catch (error) {
        console.error('Admin payment intent creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, paymentId } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            // Update payment status
            await Payment.findByIdAndUpdate(paymentId, {
                status: 'completed',
                stripePaymentMethodId: paymentIntent.payment_method
            });

            // Update booking payment status
            await Booking.findByIdAndUpdate(payment.booking, {
                paymentStatus: 'paid'
            });

            // Send notification to agent via chat
            await sendPaymentNotificationToAgent(payment);

            res.json({ success: true, message: 'Payment confirmed successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).populate('booking');
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Agent approval with bank details
exports.agentApproveWithBankDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { agentName, bankName, accountNumber, accountTitle, branchCode } = req.body;
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update booking with agent approval details
        await Booking.findByIdAndUpdate(bookingId, {
            status: 'approved',
            agentApprovalDetails: {
                approvedAt: new Date(),
                agentName,
                bankName,
                accountNumber,
                accountTitle,
                branchCode
            }
        });

        // Update payment with agent bank details
        const payment = await Payment.findOne({ booking: bookingId });
        if (payment) {
            await Payment.findByIdAndUpdate(payment._id, {
                agentBankDetails: {
                    agentName,
                    bankName,
                    accountNumber,
                    accountTitle,
                    branchCode
                }
            });
        }

        res.json({ success: true, message: 'Booking approved with bank details' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin payment to agent via Stripe
exports.adminPayAgentStripe = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { paymentIntentId, paymentMethod, transactionId, notes } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            // Update payment with admin payment details
            await Payment.findByIdAndUpdate(paymentId, {
                adminPaymentDetails: {
                    paymentDate: new Date(),
                    paymentMethod: paymentMethod || 'Stripe',
                    transactionId: transactionId || paymentIntent.id,
                    notes: notes || 'Admin payment to agent via Stripe'
                }
            });

            res.json({ success: true, message: 'Payment to agent recorded successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Admin payment to agent error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin payment to agent
exports.adminPayAgent = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { paymentMethod, transactionId, notes } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Update payment with admin payment details
        await Payment.findByIdAndUpdate(paymentId, {
            adminPaymentDetails: {
                paymentDate: new Date(),
                paymentMethod,
                transactionId,
                notes
            }
        });

        res.json({ success: true, message: 'Payment to agent recorded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all payments for admin
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('booking')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function to send payment notification to agent
async function sendPaymentNotificationToAgent(payment) {
    try {
        // Find or create chat between customer and agent
        let chat = await Chat.findOne({
            participants: { $all: [payment.customer, payment.agent] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [payment.customer, payment.agent],
                lastMessage: {
                    text: `Payment received for booking #${payment.booking}`,
                    senderId: payment.customer,
                    senderRole: 'customer',
                    createdAt: new Date()
                }
            });
        }

        // Send payment notification message
        const messageData = {
            chatId: chat._id,
            senderId: payment.customer,
            senderRole: 'customer',
            text: `Payment of $${payment.amount} has been successfully processed for your car booking. The booking is now confirmed and ready for pickup.`
        };

        // You can use your existing message creation logic here
        // For now, we'll just update the chat's last message
        await Chat.findByIdAndUpdate(chat._id, {
            lastMessage: {
                text: messageData.text,
                senderId: messageData.senderId,
                senderRole: messageData.senderRole,
                createdAt: new Date()
            }
        });

    } catch (error) {
        console.error('Error sending payment notification:', error);
    }
} 