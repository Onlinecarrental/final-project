import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }
      const user = JSON.parse(userStr);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return null; // or a loader

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminProtectedRoute;