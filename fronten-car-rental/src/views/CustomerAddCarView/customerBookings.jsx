import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with Vite environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RqC2THEE3qJceYUqEXZeK9wtxUMlcrD6WXqHby7DX2K6DO7E5w2YlpXGHVhZorCk84jqbMsAItJrSCSkaXko1KC00C0MIdUCD');

// Payment Form Component
function PaymentForm({ booking, onPaymentSuccess, onPaymentError }) {
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
            // Create payment intent
            const paymentIntentResponse = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
                bookingId: booking._id,
                amount: booking.price,
                currency: 'usd'
            });

            const { clientSecret, paymentIntentId, paymentId } = paymentIntentResponse.data.data;

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
                // Confirm payment with backend
                await axios.post(`${import.meta.env.VITE_API_URL}/payments/confirm-payment`, {
                    paymentIntentId,
                    paymentId
                });

                onPaymentSuccess(booking._id);
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
                {loading ? 'Processing...' : `Pay ${booking.price}rp`}
            </button>
        </form>
    );
}


export default function CustomerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();
    // Get logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError('');
                if (!user.uid) {
                    setError('You must be logged in to view your bookings.');
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${API_BASE_URL}/bookings/customer/${user.uid}`);
                setBookings(res.data.data || []);
            } catch (err) {
                setError('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user.uid]);

    // After payment, show success, create/find chat, send message, and redirect to chat (same as bookingFormView)
    const handlePaymentSuccess = async (bookingId) => {
        setBookings(prev => prev.map(booking => 
            booking._id === bookingId 
                ? { ...booking, paymentStatus: 'paid' }
                : booking
        ));
        setShowPaymentModal(false);
        setSelectedBooking(null);
        setPaymentSuccess(true);

        let chatId = null;
        try {
            const booking = bookings.find(b => b._id === bookingId);
            if (booking && booking.agent) {
                const currentUser = auth.currentUser;
                const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
                const userId = currentUser?.uid || userFromStorage.uid;
                const agentId = booking.agent;
                // Create chat if not exists
                const chatRes = await axios.post(`${API_BASE_URL}/chats`, { userId, agentId });
                chatId = chatRes.data.data._id;
                // Send payment confirmation message as customer
                const paymentMsg = `Payment of $${booking.price} has been successfully processed for your car booking. The booking is now confirmed and ready for pickup.`;
                await axios.post(`${API_BASE_URL}/chats/messages`, {
                    chatId,
                    senderId: userId,
                    senderRole: 'customer',
                    text: paymentMsg
                });
            }
        } catch (err) {
            // If chat creation fails, still proceed to chat page
            console.error('Failed to send payment chat message:', err);
        }

        // Show success message, then redirect to chat (same as bookingFormView)
        setTimeout(() => {
            setPaymentSuccess(false);
            if (chatId) {
                navigate('home/customer-chat', { state: { chatId } });
            } else {
                navigate('home/customer-chat');
            }
        }, 2000);
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
    };


    // Delete booking handler
    const handleDeleteBooking = async (bookingId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this booking? This action cannot be undone.');
        if (!confirmDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
            setBookings(prev => prev.filter(b => b._id !== bookingId));
        } catch (err) {
            alert('Failed to delete booking. Please try again.');
        }
    };

    // Add this function to open the payment modal
    const openPaymentModal = (booking) => {
        setSelectedBooking(booking);
        setShowPaymentModal(true);
    };


    if (loading) return <div className="text-center py-10">Loading bookings...</div>;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (paymentSuccess) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-lg mb-4">Your payment has been processed. Redirecting you to chat with the agent...</p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>
            {bookings.length === 0 ? (
                <div className="text-center text-gray-500">No bookings found.</div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="font-semibold text-lg">{booking.car?.name} ({booking.car?.model})</div>
                                    <div className="text-sm text-gray-600">From: {new Date(booking.dateFrom).toLocaleDateString()} To: {new Date(booking.dateTo).toLocaleDateString()}</div>
                                    <div className="text-sm text-gray-600">Location: {booking.location}</div>
                                    <div className="text-sm text-gray-600">Price:{booking.price}rp</div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className={`px-3 py-2 px-4 rounded text-sm font-medium ${booking.status === 'pending' ? 'bg-black text-white' : booking.status === 'approved' ? 'bg-gray text-black' : 'bg-red-200 text-red-800'}`}>{booking.status}</span>
                                    <span className={`px-3 py-2 px-4 rounded text-xs ${booking.paymentStatus === 'paid' ? 'bg-gray text-black' : 'bg-gray text-black'}`}>{booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
                                    {booking.paymentStatus === 'unpaid' && booking.status === 'pending' && (
                                        <button
                                            onClick={() => openPaymentModal(booking)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteBooking(booking._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 mt-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Payment for {selectedBooking.car?.name}</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Amount: {selectedBooking.price}rp</p>
                            <p className="text-sm text-gray-600">Car: {selectedBooking.car?.name} ({selectedBooking.car?.model})</p>
                        </div>
                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                booking={selectedBooking}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={handlePaymentError}
                            />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    );
} 