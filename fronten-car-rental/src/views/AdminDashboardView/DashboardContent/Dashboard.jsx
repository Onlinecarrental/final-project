import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Users, FileText, MessageSquare, User, Clock, AlertCircle } from 'lucide-react';

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalReviews: 0,
    totalCustomers: 0,
    totalAgents: 0,
    totalComplaints: 0,
  });
  const [recentAgents, setRecentAgents] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // First fetch agents and users like in UserManagement
      const [agentsSnap, usersSnap, blogsResp, reviewsResp, complaintsResp] = await Promise.all([
        getDocs(collection(db, 'agent')),
        getDocs(collection(db, 'users')),
        axios.get('https://backend-car-rental-production.up.railway.app/api/blogs'),
        axios.get('https://backend-car-rental-production.up.railway.app/api/reviews/all'),
        axios.get('https://backend-car-rental-production.up.railway.app/api/contact'),
      ]);

      // Process agents and users
      const agentRows = agentsSnap.docs.map((d) => ({ id: d.id, ...d.data(), role: 'agent' }));
      const userRows = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Get recent agents and customers (latest 5)
      const recentAgents = [...agentRows]
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);

      const recentCustomers = [...userRows]
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);

      // Set the state
      setStats({
        totalBlogs: Array.isArray(blogsResp.data?.data) ? blogsResp.data.data.length : 0,
        totalReviews: Array.isArray(reviewsResp.data?.data) ? reviewsResp.data.data.length : 0,
        totalCustomers: userRows.length,
        totalAgents: agentRows.length,
        totalComplaints: Array.isArray(complaintsResp.data) ? complaintsResp.data.length : 0,
      });

      setRecentAgents(recentAgents);
      setRecentCustomers(recentCustomers);
    } catch (e) {
      console.error('Dashboard fetch error', e);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ icon, title, value, color = 'blue' }) => (
    <div className="bg-white p-6 font-jakarta rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{loading ? '...' : value}</h3>
        </div>
        <div className={`p-3 bg-gray text-black rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const RecentUsersTable = ({ users, type }) => (
    <div className="bg-white rounded-lg font-jakarta shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Recent {type === 'agent' ? 'Agents' : 'Customers'}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {type !== 'agent' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || user.fullName || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                  </td>
                  {type !== 'agent' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.phone || 'N/A'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No {type === 'agent' ? 'agents' : 'customers'} found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          title="Total Customers"
          value={stats.totalCustomers}
          color="Blue"
        />
        <StatCard
          icon={<User className="h-6 w-6" />}
          title="Total Agents"
          value={stats.totalAgents}
          color="Blue"
        />
        <StatCard
          icon={<FileText className="h-6 w-6" />}
          title="Total Blogs"
          value={stats.totalBlogs}
          color="Blue"
        />
        <StatCard
          icon={<MessageSquare className="h-6 w-6" />}
          title="Total Reviews"
          value={stats.totalReviews}
          color="gray"
        />

        <StatCard
          icon={<AlertCircle className="h-6 w-6" />}
          title="Total Complaints"
          value={stats.totalComplaints}
          color="Blue"
        />
      </div>

      {/* Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsersTable users={recentAgents} type="agent" />
        <RecentUsersTable users={recentCustomers} type="customer" />
      </div>
    </div>
  );
};

export default DashboardContent;
