import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, type }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            
            // For admin role, check both collections
            if (type === 'admin') {
              // Check in users collection first
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists() && userDoc.data().role === "admin") {
                setUserRole('admin');
                setIsAuthenticated(true);
                setLoading(false);
                return;
              }
              
              // Check in agent collection
              const agentDoc = await getDoc(doc(db, "agent", user.uid));
              if (agentDoc.exists() && agentDoc.data().role === "admin") {
                setUserRole('admin');
                setIsAuthenticated(true);
                setLoading(false);
                return;
              }
              
              // If not admin in either collection
              setUserRole(userData.role);
              setIsAuthenticated(false);
            } else {
              // For customer and agent roles, use stored data
              setUserRole(userData.role);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [type]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role-based access control
  const roleRoutes = {
    customer: '/home',
    agent: '/agent',
    admin: '/admin'
  };

  // Check if user has required role
  if (userRole !== type) {
    // Redirect to appropriate page based on role
    const redirectPath = roleRoutes[userRole] || '/';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;