import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  User,
  BarChart2,
  Users,
  LogOut,
  ChevronDown,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  FileText,
  Plus, // Add this import for the plus icon
  Folder,
  Home,
  Info
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import BlogManagement from './BlogManagement/BlogManagement';
import CategoryManagement from './CategoryManagement/CategoryManagement'; // Add this import for category management
import ReviewManagement from './ReviewManagement/ReviewManagement'; // Add this import for review management
import HomepageManagement from './HomepageManagement/HomepageManagement';
import AboutUsManagement from './AboutUsManagement/AboutUsManagement';
import AdminChat from './AdminChat';
import BookingManagement from './bookingManagement/BookingManagement';
import PaymentManagement from './paymentManagemnt/PaymentManagement';
import ContactManagement from "./ContactManagemnt/ContactManage";
import UserManagement from './UserManagement/UserManagement';
import DashboardContent from './DashboardContent/Dashboard';

function SidebarItem({ icon, text, isOpen, isActive, onClick, badge }) {
  return (
    <a
      href="#"
      onClick={e => { e.preventDefault(); onClick && onClick(); }}
      className={`flex items-center py-3 px-4 ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
    >
      <div className="flex items-center justify-center">{icon}</div>
      {isOpen && (
        <div className="ml-3 flex-1 flex items-center justify-between">
          <span>{text}</span>
          {badge && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{badge}</span>
          )}
        </div>
      )}
    </a>
  );
}

// Update the SidebarDropdownItem component
function SidebarDropdownItem({ icon, text, isOpen, isActive, items, activeTab, setActiveTab }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMainClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(itemId);
  };

  return (
    <div>
      <a
        href="#"
        onClick={handleMainClick}
        className={`flex items-center py-3 px-4 ${items.some(item => item.id === activeTab) ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
      >
        <div className="flex items-center justify-center">{icon}</div>
        {isOpen && (
          <div className="ml-3 flex-1 flex items-center justify-between">
            <span>{text}</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>
        )}
      </a>
      {isOpen && isDropdownOpen && (
        <div className="bg-gray-900">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleItemClick(e, item.id)}
              className={`w-full text-left flex items-center py-2 px-4 pl-12 ${activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



function UsersContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-lg shadow p-5">
        <p className="text-gray-600">This is the users management panel.</p>
      </div>
    </div>
  );
}






// Add BlogContent component after other content components
function BlogContent() {
  const [showEditor, setShowEditor] = useState(false);
  const [categories, setCategories] = useState([]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-bold">Blog Management</h1>

      </div>


      {/* Rest of the existing code... */}
      <BlogManagement />
    </div>
  );
}

// Add new CategoryContent component
function CategoryContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>
      <CategoryManagement />
    </div>
  );
}

// Modify the HomepageContent component
function HomepageContent({ initialSection }) {
  return (
    <div className="p-6">
      <HomepageManagement />
    </div>
  );
}

// Update the AboutUsContent component
function AboutUsContent({ initialSection }) {
  const [currentSection, setCurrentSection] = useState(initialSection);

  useEffect(() => {
    setCurrentSection(initialSection);
  }, [initialSection]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">About Us Management</h1>
      <AboutUsManagement initialSection={currentSection} />
    </div>
  );
}

// Update the main AdminDashboard component's return statement
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const user = JSON.parse(stored);
      // Name preference: displayName || name || email username || 'Admin'
      const derivedName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Admin');
      setAdminName(derivedName);
      setAdminEmail(user.email || '');
    } catch (e) {
      // Ignore parse errors; keep defaults
    }
  }, []);

  const renderContent = () => {
    // Homepage sections
    if (activeTab === 'homepage-hero') {
      return <HomepageManagement section="hero" />;
    }
    if (activeTab === 'homepage-services') {
      return <HomepageManagement section="services" />;
    }
    if (activeTab === 'homepage-howitworks') {
      return <HomepageManagement section="howItWorks" />;
    }
    if (activeTab === 'homepage-whychoose') {
      return <HomepageManagement section="whyChoose" />;
    }
    if (activeTab === 'homepage-faqs') {
      return <HomepageManagement section="faqs" />;
    }

    // About Us sections
    if (activeTab === 'aboutus-hero') {
      return <AboutUsManagement section="hero" />;
    }
    if (activeTab === 'aboutus-services') {
      return <AboutUsManagement section="services" />;
    }
    if (activeTab === 'aboutus-trust') {
      return <AboutUsManagement section="trust" />;
    }
    if (activeTab === 'aboutus-whychoose') {
      return <AboutUsManagement section="whyChoose" />;
    }
    if (activeTab === 'aboutus-cars') {
      return <AboutUsManagement section="carCollection" />;
    }
    if (activeTab === 'aboutus-faqs') {
      return <AboutUsManagement section="faqs" />;
    }

    // Other sections
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'bookings':
        return <BookingManagement />;

      case 'blogs':
        return <BlogContent />;
      case 'categories':
        return <CategoryContent />;
      case 'reviews':
        return <ReviewManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsContent />;
      case 'adminchat':
        return <AdminChat />;
      case 'payments':
        return <PaymentManagement />;
      case 'contactmanagement':
        return <ContactManagement />;

    }
  };

  return (
    <div className="flex h-auto bg-black">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : null}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-700">
            <Menu size={24} />
          </button>
        </div>
        <nav className="mt-5 flex flex-col h-[calc(100vh-80px)]">
          <SidebarItem
            icon={<BarChart2 size={20} />}
            text="Dashboard"
            isOpen={sidebarOpen}
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />

          <SidebarItem
            icon={<Users size={20} />}
            text="User Management"
            isOpen={sidebarOpen}
            isActive={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <SidebarDropdownItem
            icon={<Home size={20} />}
            text="Homepage"
            isOpen={sidebarOpen}
            isActive={activeTab.startsWith('homepage-')}
            items={[
              { id: 'homepage-hero', text: 'Hero Section' },
              { id: 'homepage-services', text: 'Services' },
              { id: 'homepage-howitworks', text: 'How It Works' },
              { id: 'homepage-whychoose', text: 'Why Choose Us' },
              { id: 'homepage-faqs', text: 'FAQs' }
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <SidebarDropdownItem
            icon={<Info size={20} />}
            text="About Us"
            isOpen={sidebarOpen}
            isActive={['aboutus-hero', 'aboutus-services', 'aboutus-trust', 'aboutus-whychoose', 'aboutus-cars', 'aboutus-faqs'].includes(activeTab)}
            items={[
              { id: 'aboutus-hero', text: 'Hero Section' },
              { id: 'aboutus-services', text: 'Services' },
              { id: 'aboutus-trust', text: 'Trust Section' },
              { id: 'aboutus-whychoose', text: 'Why Choose Us' },
              { id: 'aboutus-cars', text: 'Car Collection' },
              { id: 'aboutus-faqs', text: 'FAQs' }
            ]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            text="Blogs"
            isOpen={sidebarOpen}
            isActive={activeTab === 'blogs'}
            onClick={() => setActiveTab('blogs')}
          />

          <SidebarItem
            icon={<Folder size={20} />}
            text="Categories"
            isOpen={sidebarOpen}
            isActive={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
          />
          <SidebarItem
            icon={<MessageSquare size={20} />}
            text="Reviews"
            isOpen={sidebarOpen}
            isActive={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          />
          <SidebarItem
            icon={<DollarSign size={20} />}
            text="Payments"
            isOpen={sidebarOpen}
            isActive={activeTab === 'payments'}
            onClick={() => setActiveTab('payments')}
          />

          <SidebarItem
            icon={<MessageSquare size={20} />}
            text="Admin Chat"
            isOpen={sidebarOpen}
            isActive={activeTab === 'adminchat'}
            onClick={() => setActiveTab('adminchat')}
          />
          <SidebarItem
            icon={<MessageSquare size={20} />}
            text="Contact Management"
            isOpen={sidebarOpen}
            isActive={activeTab === 'contactmanagement'}
            onClick={() => setActiveTab('contactmanagement')}
          />
          <div className="mt-auto pt-5">
            <SidebarItem
              icon={<LogOut size={20} />}
              text="Logout"
              isOpen={sidebarOpen}
              isActive={false}
              onClick={handleLogout}
            />
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center   p-4">

            <div className="flex items-center space-x-2 ">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{adminName || 'Admin'}</div>
                <div className="text-xs text-gray-500">{adminEmail || 'admin@example.com'}</div>
              </div>

            </div>
          </div>
        </header>
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}