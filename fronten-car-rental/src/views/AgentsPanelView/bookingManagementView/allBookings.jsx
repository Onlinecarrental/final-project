  // Delete booking handler
  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`);
      setBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };
import React, { useState, useEffect } from "react";
import axios from "axios";
import BaseCard from "../../../components/card";
import Button from "../../../components/button";
import { getCustomerNameById } from '../../../modules/chat/chatUtils'; // adjust path if needed

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 6;
  const [customerNames, setCustomerNames] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    agentName: '',
    bankName: '',
    accountNumber: '',
    accountTitle: '',
    branchCode: ''
  });

  // Get agent from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        if (!user.uid) {
          setError("You must be logged in as an agent.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings/agent/${user.uid}`);
        setBookings(res.data.data || []);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.uid]);

  // Filter bookings by status
  const filteredData = bookings.filter(b => b.status === activeFilter);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Fetch customer names for bookings without a name
  useEffect(() => {
    const fetchNames = async () => {
      const currentPageBookings = filteredData.slice(startIndex, endIndex);
      const missing = currentPageBookings.map(b => b.customer).filter(Boolean).filter(uid => !customerNames[uid]);
      for (const uid of missing) {
        const name = await getCustomerNameById(uid);
        if (name) setCustomerNames(prev => ({ ...prev, [uid]: name }));
      }
    };
    if (filteredData.length > 0) fetchNames();
    // eslint-disable-next-line
  }, [filteredData, startIndex, endIndex]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const goToPage = (page) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleApprove = async (bookingId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/approve`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'approved' } : b));
    } catch (err) {
      alert('Failed to approve booking.');
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/reject`);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'rejected' } : b));
    } catch (err) {
      alert('Failed to reject booking.');
    }
  };

  const openApprovalModal = (booking) => {
    setSelectedBooking(booking);
    setApprovalForm({
      agentName: user.name || '',
      bankName: '',
      accountNumber: '',
      accountTitle: '',
      branchCode: ''
    });
    setShowApprovalModal(true);
  };
  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/booking/${selectedBooking._id}/approve-with-bank-details`, approvalForm);
      setBookings(prev => prev.map(b => b._id === selectedBooking._id ? { ...b, agentBankDetails: { ...approvalForm } } : b));
      setShowApprovalModal(false);
      setSelectedBooking(null);
      window.dispatchEvent(new Event('carListShouldRefresh'));
    } catch (err) {
      alert('Failed to submit bank details.');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center space-y-4">
      {/* Filter buttons OUTSIDE the card */}
      <div className="flex justify-center pb-6 gap-4">
        {["pending", "approved", "rejected"].map((status) => (
          <Button
            key={status}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
            bgColor={activeFilter === status ? "bg-black" : "bg-white"}
            textColor={activeFilter === status ? "text-white" : "text-black"}
            shadow={activeFilter === status ? "shadow-lg" : "shadow-none"}
            onClick={() => handleFilterChange(status)}
            width="120px"
            height="40px"
            className="rounded-full border"
          />
        ))}
      </div>

      {/* Table inside card */}
      <BaseCard width="w-full" height="h-auto" padding="p-0" className="border">
        <div className="grid grid-cols-5 bg-gray p-4 rounded-t-lg font-bold text-center">
          <div className="mr-8">Customer</div>
          <div className="mr-8">Vehicle</div>
          <div className="mr-8">Date</div>
          <div className="mr-8">Status</div>
          <div className="mr-8">Action</div>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No bookings found.</div>
          ) : (
            currentData.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-5 bg-gray rounded-lg p-4 items-center"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full ml-4 mr-2"></div>
                  {customerNames[item.customer] || 'Customer'}
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-md ml-4 mr-2"></div>
                  {item.car?.name || 'N/A'}
                </div>
                <div>
                  <span className="bg-white rounded-md ml-4 px-2 py-1 text-sm">
                    {item.dateFrom ? new Date(item.dateFrom).toLocaleDateString() : ''} - {item.dateTo ? new Date(item.dateTo).toLocaleDateString() : ''}
                  </span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : item.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{item.status}</span>
                </div>
                <div className="flex gap-2">
                  {item.status === 'pending' && (
                    <>
                      <Button
                        title="Approve"
                        bgColor="bg-green-600"
                        textColor="text-white"
                        height="36px"
                        width="80px"
                        className="text-sm"
                        onClick={() => handleApprove(item._id)}
                      />
                      <Button
                        title="Reject"
                        bgColor="bg-red-600"
                        textColor="text-white"
                        height="36px"
                        width="80px"
                        className="text-sm"
                        onClick={() => handleReject(item._id)}
                      />
                    </>
                  )}
                  {item.status === 'approved' && (
                    <>
                      {!item.agentBankDetails ? (
                        <Button
                          title="Add Bank Details"
                          bgColor="bg-blue-600"
                          textColor="text-white"
                          height="36px"
                          width="120px"
                          className="text-sm"
                          onClick={() => openApprovalModal(item)}
                        />
                      ) : (
                        <Button
                          title="Submitted"
                          bgColor="bg-green-500"
                          textColor="text-white"
                          height="36px"
                          width="120px"
                          className="text-sm cursor-default"
                          disabled
                        />
                      )}
                      <Button
                        title="Delete"
                        bgColor="bg-red-500"
                        textColor="text-white"
                        height="36px"
                        width="80px"
                        className="text-sm"
                        onClick={() => handleDelete(item._id)}
                      />
                    </>
                  )}
                  {item.status === 'rejected' && (
                    <Button
                      title="Delete"
                      bgColor="bg-red-500"
                      textColor="text-white"
                      height="36px"
                      width="80px"
                      className="text-sm"
                      onClick={() => handleDelete(item._id)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </BaseCard>

      {/* Pagination OUTSIDE the card */}
      <div className="flex justify-center pt-6 gap-2">
        <button
          onClick={goToPreviousPage}
          className="bg-indigo-600 text-white rounded-lg shadow-lg h-9 w-24 text-sm font-medium"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const isActive = currentPage === pageNumber;
          const isAvailable = pageNumber <= totalPages;

          return (
            <button
              key={index}
              onClick={() => isAvailable && goToPage(pageNumber)}
              className={`h-9 w-9 text-sm font-medium rounded-lg shadow-lg ${isActive
                ? "bg-indigo-600 text-white"
                : isAvailable
                  ? "bg-gray-300 text-black"
                  : "bg-gray-200 text-gray-400"
                }`}
              disabled={!isAvailable}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={goToNextPage}
          className="bg-indigo-600 text-white rounded-lg shadow-lg h-9 w-24 text-sm font-medium"
        >
          Next
        </button>
      </div>

      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Agent Bank Details</h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleApprovalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={approvalForm.agentName}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, agentName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={approvalForm.bankName}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={approvalForm.accountNumber}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
                <input
                  type="text"
                  value={approvalForm.accountTitle}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, accountTitle: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                <input
                  type="text"
                  value={approvalForm.branchCode}
                  onChange={(e) => setApprovalForm(prev => ({ ...prev, branchCode: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
