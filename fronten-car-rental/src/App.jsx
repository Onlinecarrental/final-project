import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import './index.css';
import HomeView from './views/HomeView/homeView';
import BestCarsView from './views/BestCarsView/bestCarsView';
import AboutUsView from './views/AboutUsView/aboutUsView';
import ContactUsView from './views/ContactUsView/contactUsView';
import BlogsView from './views/BlogsView/blogView';
import DetailCar from './views/BestCarsView/cardetailview';
import BlogPost from './views/BlogsView/showblog';
import BookingView from './views/BookingFormView/bookingFormView';
import CustomerChat from './views/CustomerChatView/CustomerChat';
import AgentChat from './views/AgentsPanelView/agentMsgView/AgentChat';
import CarRentalLoginScreen from './views/HomeView/mainHompage';
 import CustomerReviewView from './views/CustomerReviewView/CustomerReviewView';
import Login from './components/login';
import Signup from './components/signup';
import MainLayout from './components/mainLayout';
import AgentPanelHomeView from './views/AgentsPanelView/agentHomeView/agentHomeview';
import AddCarView from './views/AgentsPanelView/addCarView/addCarView';
import BookingManagementView from './views/AgentsPanelView/bookingManagementView/bookingManagementView';
import MyCarListView from './views/AgentsPanelView/myCarListView/myCarListView';
import AgentSignup from './components/AgentSignup';
import AgentLogin from './components/AgentLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AgentContactUsView from './views/AgentsPanelView/agentContactUsView/agentContactUsView';
import AdminDashboard from './views/AdminDashboardView/adminpanel';
import BlogManagement from './views/AdminDashboardView/BlogManagement/BlogManagement';
import CustomerBookings from './views/CustomerAddCarView/customerBookings';


const App = () => {
    React.useEffect(() => {
        // Check if user is on login page and has stored data
        if (window.location.pathname === '/' && localStorage.getItem('user')) {
            localStorage.clear(); // Clear stored data when on login page
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* User routes */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><HomeView /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/best-cars"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><BestCarsView /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/about-us"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><AboutUsView /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/customerreviews"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><CustomerReviewView/></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/contactus"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><ContactUsView /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/blogs"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><BlogsView /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/home/best-cars/:id"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><DetailCar /></Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/home/bookingform"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><BookingView /></Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/home/blogs/:id"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><BlogPost /></Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/home/my-bookings"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><CustomerBookings /></Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Agent routes */}
                <Route
                    path="/agent"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><AgentPanelHomeView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/addcar"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><AddCarView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/addcar/:id"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><AddCarView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/booking-management"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><BookingManagementView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/carlist"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><MyCarListView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/contactus"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><AgentContactUsView /></MainLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer-chat"
                    element={
                        <ProtectedRoute type="customer">
                            <Layout><CustomerChat /></Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/agent/messages"
                    element={
                        <ProtectedRoute type="agent">
                            <MainLayout><AgentChat /></MainLayout>
                        </ProtectedRoute>
                    }
                />


                {/* Admin routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute type="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/blogs"
                    element={
                        <ProtectedRoute type="admin">
                            <BlogManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Public routes */}
                <Route path="/" element={<CarRentalLoginScreen />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/agent-signup" element={<AgentSignup />} />
                <Route path="/agent-login" element={<AgentLogin />} />
            </Routes>
        </Router>
    );
};

export default App;
