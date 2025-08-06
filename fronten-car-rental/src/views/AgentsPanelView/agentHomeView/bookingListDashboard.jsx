import React, { useEffect, useState } from "react";
import BaseCard from "../../../components/card";
import Button from "../../../components/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusColors = {
  approved: "bg-green-500",
  pending: "bg-yellow-400",
  rejected: "bg-red-500"
};

const BookingListDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        if (!user.uid) return;
        const res = await axios.get(`http://localhost:5000/api/bookings/agent/${user.uid}`);
        setBookings(res.data.data || []);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.uid]);

  const handleApprove = async (bookingId) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/approve`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'approved' } : b));
    } catch (err) {
      alert('Failed to approve booking.');
    }
  };

  const handleDeny = async (bookingId) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/reject`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'rejected' } : b));
    } catch (err) {
      alert('Failed to deny booking.');
    }
  };

  return (
    <BaseCard
      width="w-full"
      height="full"
      padding="p-6"
      className="mx-auto border"
    >
      <h1 className="text-center text-3xl font-bold mb-6">Booking list</h1>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between bg-gray rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate('/agent/booking-management')}
            >
              <div className="flex items-center gap-4">
                <span className={`w-4 h-4 rounded-full ${statusColors[booking.status] || 'bg-gray-400'}`}></span>
                <span className="font-medium text-lg">{booking.car?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize font-semibold">{booking.status}</span>
                {booking.status === 'pending' && (
                  <>
                    <Button title="Approve" bgColor="bg-green-600" textColor="text-white" width="80px" height="32px" className="text-xs" onClick={e => { e.stopPropagation(); handleApprove(booking._id); }} />
                    <Button title="Deny" bgColor="bg-red-600" textColor="text-white" width="80px" height="32px" className="text-xs" onClick={e => { e.stopPropagation(); handleDeny(booking._id); }} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseCard>
  );
};

export default BookingListDashboard;