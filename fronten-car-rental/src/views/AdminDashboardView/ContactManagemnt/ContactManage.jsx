import React, { useEffect, useState } from "react";
import BaseCard from "../../../components/card";
import Button from "../../../components/button";

const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";

export default function ContactManagement() {
  const [contacts, setContacts] = useState([]);
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/contact`)
      .then(res => res.json())
      .then(setContacts);
  }, []);

  const handleReply = async (id, email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyContent: replyContent[id] })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Reply sent!");
        setContacts(contacts.map(c => 
          c._id === id 
            ? { ...c, replied: true, replyContent: replyContent[id] } 
            : c
        ));
        setReplyContent(prev => ({ ...prev, [id]: "" })); // Clear textarea after reply
      }
    } catch (err) {
      alert("Failed: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
      } else {
        alert("Contact deleted!");
        setContacts(contacts.filter(c => c._id !== id));
      }
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Management</h1>
      <div className="grid gap-6">
        {contacts.map(contact => (
          <BaseCard key={contact._id} padding="p-6" width="100%" height="auto">
            <div>
              <p><b>Name:</b> {contact.name}</p>
              <p><b>Email:</b> {contact.email}</p>
              <p><b>Role:</b> {contact.role}</p>
              <p><b>Message:</b> {contact.message}</p>
              <p><b>Status:</b> {contact.replied ? "Replied" : "Pending"}</p>
              {contact.replied && <p><b>Reply:</b> {contact.replyContent}</p>}
              <Button
                title="Delete"
                onClick={() => handleDelete(contact._id)}
                width="100px"
                height="35px"
                style={{ backgroundColor: "#dc2626", color: "#fff", marginTop: "10px" }}
              />
              {!contact.replied && (
                <div className="mt-4">
                  <textarea
                    rows={3}
                    className="border rounded w-full p-2"
                    placeholder="Type reply here..."
                    value={replyContent[contact._id] || ""}
                    onChange={e => setReplyContent({ ...replyContent, [contact._id]: e.target.value })}
                  />
                  <Button
                    title={loading ? "Sending..." : "Send Reply"}
                    onClick={() => handleReply(contact._id, contact.email)}
                    width="150px"
                    height="40px"
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </BaseCard>
        ))}
      </div>
    </div>
  );
}