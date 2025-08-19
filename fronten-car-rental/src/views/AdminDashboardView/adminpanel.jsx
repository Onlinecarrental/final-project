import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  User,
  BarChart2,
  Users,
  LogOut,
  ChevronDown,
  Activity,
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

function DashboardContent() {
  const stats = [
    { id: 1, title: 'Revenue', value: '$24,560', icon: <DollarSign size={20} />, change: '+12%', changeType: 'positive' },
    { id: 2, title: 'Users', value: '3,456', icon: <Users size={20} />, change: '+8%', changeType: 'positive' },
    { id: 3, title: 'Orders', value: '456', icon: <ShoppingCart size={20} />, change: '-3%', changeType: 'negative' },
    { id: 4, title: 'Traffic', value: '12,456', icon: <Activity size={20} />, change: '+18%', changeType: 'positive' },
  ];
  const recentUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'Dave Wilson', email: 'dave@example.com', role: 'User', status: 'Active' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.title === 'Revenue' ? 'bg-green-100 text-green-600' :
                stat.title === 'Users' ? 'bg-blue-100 text-black' :
                  stat.title === 'Orders' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`mt-2 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>
      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-5 border-b">
          <h3 className="text-lg font-medium">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black hover:text-blue-900">
                    <a href="#" onClick={(e) => e.preventDefault()}>Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Sales Chart Mock */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Sales Overview</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">Weekly</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Monthly</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Yearly</button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Sales chart visualization would render here</p>
        </div>
      </div>
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

function ProductsContent() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>
      <div className="bg-white rounded-lg shadow p-5">
        <p className="text-gray-600">This is the products management panel.</p>
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
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Blog
        </button>
      </div>

      {/* Add Category Management Section */}
      <CategoryManagement categories={categories} setCategories={setCategories} />

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

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
      case 'settings':
        return <SettingsContent />;
      case 'adminchat':
        return <AdminChat />;
      case 'payments':
        return <PaymentManagement />;
      case 'contactmanagement':
        return <ContactManagement />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-black">
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
            icon={<ShoppingCart size={20} />}
            text="Booking Management"
            isOpen={sidebarOpen}
            isActive={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
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
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center rounded-md bg-gray-100 px-3 py-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none ml-2 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
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