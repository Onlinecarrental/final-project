import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseCard from '../../../components/card';
import Button from '../../../components/button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe for admin payments
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RqC2THEE3qJceYUqEXZeK9wtxUMlcrD6WXqHby7DX2K6DO7E5w2YlpXGHVhZorCk84jqbMsAItJrSCSkaXko1KC00C0MIdUCD');

// Admin Payment Form Component
function AdminPaymentForm({ payment, onPaymentSuccess, onPaymentError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet.');
            setLoading(false);
            return;
        }

        try {
            // Create payment intent for admin to agent payment
            const paymentIntentResponse = await axios.post('http://localhost:5000/api/payments/create-admin-payment-intent', {
                paymentId: payment._id,
                amount: payment.amount,
                currency: 'usd',
                agentId: payment.agent
            });

            const { clientSecret, paymentIntentId } = paymentIntentResponse.data.data;

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Confirm admin payment to agent
                await axios.post(`http://localhost:5000/api/payments/${payment._id}/admin-pay-agent-stripe`, {
                    paymentIntentId,
                    paymentMethod: 'Stripe',
                    transactionId: paymentIntent.id,
                    notes: 'Admin payment to agent via Stripe'
                });

                onPaymentSuccess(payment._id);
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            onPaymentError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border rounded-lg p-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay Agent $${payment.amount}`}
            </button>
        </form>
    );
}

export default function PaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showStripePaymentModal, setShowStripePaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        paymentMethod: '',
        transactionId: '',
        notes: ''
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/payments/admin/all');
            setPayments(response.data.data || []);
        } catch (err) {
            setError('Failed to load payments.');
        } finally {
            setLoading(false);
        }
    };

    const openPaymentModal = (payment) => {
        setSelectedPayment(payment);
        setPaymentForm({
            paymentMethod: '',
            transactionId: '',
            notes: ''
        });
        setShowPaymentModal(true);
    };

    const openStripePaymentModal = (payment) => {
        setSelectedPayment(payment);
        setShowStripePaymentModal(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/payments/${selectedPayment._id}/admin-pay-agent`, paymentForm);
            setPayments(prev => prev.map(p => 
                p._id === selectedPayment._id 
                    ? { ...p, adminPaymentDetails: { ...paymentForm, paymentDate: new Date() }, status: 'completed' }
                    : p
            ));
            setShowPaymentModal(false);
            setSelectedPayment(null);
        } catch (err) {
            alert('Failed to record payment to agent.');
        }
    };

    const handleStripePaymentSuccess = (paymentId) => {
        setPayments(prev => prev.map(p => 
            p._id === paymentId 
                ? { ...p, adminPaymentDetails: { 
                    paymentMethod: 'Stripe', 
                    transactionId: 'stripe_payment',
                    paymentDate: new Date(),
                    notes: 'Paid via Stripe'
                }, status: 'completed' }
                : p
        ));
        setShowStripePaymentModal(false);
        setSelectedPayment(null);
    };

    const handleStripePaymentError = (error) => {
        console.error('Stripe payment error:', error);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-200 text-green-800';
            case 'pending': return 'bg-yellow-200 text-yellow-800';
            case 'failed': return 'bg-red-200 text-red-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    // Group payments by booking
    const paymentsByBooking = {};
    for (const payment of payments) {
      const bookingId = payment.booking?._id || payment.booking;
      if (!paymentsByBooking[bookingId]) {
        paymentsByBooking[bookingId] = [];
      }
      paymentsByBooking[bookingId].push(payment);
    }

    // For each booking, prefer the payment with agentBankDetails, else fallback to the first
    const uniquePayments = Object.values(paymentsByBooking).map(paymentList => {
      const withAgentDetails = paymentList.find(p => p.agentBankDetails && p.agentBankDetails.bankName);
      return withAgentDetails || paymentList[0];
    });

    if (loading) return <div className="text-center py-10">Loading payments...</div>;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Payment Management</h2>
            
            <BaseCard width="w-full" height="h-auto" padding="p-0" className="border">
                <div className="grid grid-cols-8 bg-gray p-4 rounded-t-lg font-bold text-center text-sm">
                    <div>Customer</div>
                    <div>Agent</div>
                    <div>Car Details</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Payment Date</div>
                    <div>Agent Bank Details</div>
                    <div>Action</div>
                </div>

                <div className="p-4 space-y-4">
                    {uniquePayments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No payments found.</div>
                    ) : (
                        uniquePayments.map((payment) => (
                            <div key={payment._id} className="grid grid-cols-8 bg-gray rounded-lg p-4 items-center text-sm">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                                    <span className="truncate">{payment.customer}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
                                    <span className="truncate">{payment.agent}</span>
                                </div>
                                <div className="text-xs">
                                    {payment.booking?.car ? (
                                        <div>
                                            <div><strong>Car:</strong> {payment.booking.car.name}</div>
                                            <div><strong>Model:</strong> {payment.booking.car.model}</div>
                                            <div><strong>Dates:</strong> {payment.booking.dateFrom ? new Date(payment.booking.dateFrom).toLocaleDateString() : ''} - {payment.booking.dateTo ? new Date(payment.booking.dateTo).toLocaleDateString() : ''}</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No car details</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    ${payment.amount}
                                </div>
                                <div className="text-center">
                                    {/* Removed 'Paid to Agent' text from Action column as requested */}
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>{payment.status}</span>
                                </div>
                                <div className="text-center text-xs">
                                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="text-xs">
                                    {payment.agentBankDetails && (
                                        payment.agentBankDetails.bankName || payment.agentBankDetails.accountNumber || payment.agentBankDetails.accountTitle || payment.agentBankDetails.branchCode
                                    ) ? (
                                        <div>
                                            {payment.agentBankDetails.bankName && <div><strong>Bank:</strong> {payment.agentBankDetails.bankName}</div>}
                                            {payment.agentBankDetails.accountNumber && <div><strong>Account:</strong> {payment.agentBankDetails.accountNumber}</div>}
                                            {payment.agentBankDetails.accountTitle && <div><strong>Title:</strong> {payment.agentBankDetails.accountTitle}</div>}
                                            {payment.agentBankDetails.branchCode && <div><strong>Branch Code:</strong> {payment.agentBankDetails.branchCode}</div>}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Not provided</span>
                                    )}
                                </div>
                                <div className="text-center space-y-1">
                                    {payment.agentBankDetails && !payment.adminPaymentDetails && (
                                        <>
                                            <Button
                                                title="Pay via Stripe"
                                                bgColor="bg-green-600"
                                                textColor="text-white"
                                                height="28px"
                                                width="100px"
                                                className="text-xs mb-1"
                                                onClick={() => openStripePaymentModal(payment)}
                                            />
                                            <Button
                                                title="Manual Payment"
                                                bgColor="bg-blue-600"
                                                textColor="text-white"
                                                height="28px"
                                                width="100px"
                                                className="text-xs mb-1"
                                                onClick={() => openPaymentModal(payment)}
                                            />
                                        </>
                                    )}
                                    {payment.adminPaymentDetails && (
                                        <span className="text-green-600 text-xs">Paid to Agent</span>
                                    )}
                                    <Button
                                        title="Delete"
                                        bgColor="bg-red-600"
                                        textColor="text-white"
                                        height="28px"
                                        width="100px"
                                        className="text-xs mt-1"
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to delete this booking and all related records?')) {
                                              await axios.delete(`http://localhost:5000/api/bookings/${payment.booking?._id || payment.booking}`);
                                              setPayments(prev => prev.filter(p => (p.booking?._id || p.booking) !== (payment.booking?._id || payment.booking)));
                                            }
                                          }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </BaseCard>

            {/* Payment to Agent Modal */}
            {showPaymentModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pay Agent</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                            <h4 className="font-semibold mb-2">Payment Details</h4>
                            <div className="text-sm space-y-1">
                                <div><strong>Amount:</strong> ${selectedPayment.amount}</div>
                                <div><strong>Agent:</strong> {selectedPayment.agent}</div>
                                {selectedPayment.agentBankDetails && (
                                    <>
                                        <div><strong>Bank:</strong> {selectedPayment.agentBankDetails.bankName}</div>
                                        <div><strong>Account:</strong> {selectedPayment.agentBankDetails.accountNumber}</div>
                                        <div><strong>Account Title:</strong> {selectedPayment.agentBankDetails.accountTitle}</div>
                                        <div><strong>Branch Code:</strong> {selectedPayment.agentBankDetails.branchCode}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={paymentForm.paymentMethod}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select payment method</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Check">Check</option>
                                    <option value="Online Transfer">Online Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                                <input
                                    type="text"
                                    value={paymentForm.transactionId}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter transaction ID or reference"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={paymentForm.notes}
                                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="3"
                                    placeholder="Any additional notes about the payment"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                >
                                    Record Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stripe Payment Modal */}
            {showStripePaymentModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Pay Agent via Stripe</h3>
                            <button
                                onClick={() => setShowStripePaymentModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                            <h4 className="font-semibold mb-2">Payment Details</h4>
                            <div className="text-sm space-y-1">
                                <div><strong>Amount:</strong> ${selectedPayment.amount}</div>
                                <div><strong>Agent:</strong> {selectedPayment.agent}</div>
                                {selectedPayment.agentBankDetails && (
                                    <>
                                        <div><strong>Bank:</strong> {selectedPayment.agentBankDetails.bankName}</div>
                                        <div><strong>Account:</strong> {selectedPayment.agentBankDetails.accountNumber}</div>
                                        <div><strong>Account Title:</strong> {selectedPayment.agentBankDetails.accountTitle}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Elements stripe={stripePromise}>
                            <AdminPaymentForm
                                payment={selectedPayment}
                                onPaymentSuccess={handleStripePaymentSuccess}
                                onPaymentError={handleStripePaymentError}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
} 