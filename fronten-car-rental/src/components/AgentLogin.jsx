import { useState, useEffect } from 'react';
import logo from '../assets/LOGO.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AgentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'agent') {
          navigate('/agent');
        } else if (userData.role === 'customer') {
          navigate('/home');
        } else if (userData.role === 'admin') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  // Auto-fill email and password if redirected from signup
  useEffect(() => {
    if (location.state && location.state.email) setEmail(location.state.email);
    if (location.state && location.state.password) setPassword(location.state.password);
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      console.log('Attempting agent login with:', { email });
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);

      const userEmail = result.user.email.toLowerCase();
      const userId = result.user.uid;

      // Get user role from Firestore using userId
      const userDoc = await getDoc(doc(db, "agent", userId));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'admin') {
          // Allow admin to login through agent login
          const userData = {
            email: userEmail,
            role: 'admin',
            uid: userId
          };

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('admin', 'true');

          navigate('/admin', { replace: true });
        } else if (role !== 'agent') {
          setError('Please use appropriate login page');
          return;
        } else {
          // Enforce admin approval gate for agents
          const approved = userDoc.data().approved === true;
          if (!approved) {
            setError('Your agent account is pending admin approval. Please wait for approval.');
            return;
          }
          // Store user data and role type for agent
          const userData = {
            email: userEmail,
            role: 'agent',
            uid: userId
          };

          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('agent', 'true');

          navigate('/agent', { replace: true });
        }
      } else {
        // Check if user exists in regular users collection
        const regularUserDoc = await getDoc(doc(db, "users", userId));
        if (regularUserDoc.exists()) {
          const role = regularUserDoc.data().role;
          if (role === 'admin') {
            // Allow admin to login from users collection
            const userData = {
              email: userEmail,
              role: 'admin',
              uid: userId
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('admin', 'true');
            navigate('/admin', { replace: true });
          } else {
            setError('Please use customer login page');
          }
          return;
        }

        setError('Agent account not found');
      }
    } catch (error) {
      console.error('Agent login error:', error);

      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No agent account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection');
          break;
        default:
          setError(error.message || 'Login failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-jakarta items-center justify-center bg-gradient-to-br from-[#5937E0] via-[#a9a9a9] to-[#ffffff] p-4">
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg bg-white/80 border border-[#5937E0]/20">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Logo and Branding */}
          <div className="lg:w-1/2 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#a9a9a9] via-[#ffffff] to-[#5937E0] p-8 lg:p-12">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 border-4 border-[#5937E0] rounded-full opacity-20"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-[#000000] rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-[#ffffff] rounded-full opacity-20"></div>
              <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-[#5937E0] rounded-full opacity-10"></div>
            </div>
            <div className="relative z-10 text-center">
              <Link to="/" >
                <div className="bg-white/90 rounded-full p-5 mb-6 shadow-xl border-4 border-[#5937E0] flex items-center justify-center transition-transform duration-300 hover:scale-105">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-24 w-24 object-contain drop-shadow-lg"
                  />
                </div>
                <h1 className="text-4xl font-extrabold mb-2 tracking-wide text-[#000000] drop-shadow-sm">
                  Online Car Rental
                </h1>
                <p className="text-2xl font-semibold opacity-90 text-[#5937E0] tracking-wide mb-2">
                  AGENT PORTAL
                </p>
              </Link>
              <p className="mt-6 text-lg opacity-80 text-[#000000] font-medium">
                Welcome back! Please sign in to your agent account.
              </p>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white/80 backdrop-blur-xl">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-[#5937E0] mb-2 drop-shadow-sm">
                  Agent Login
                </h2>
                <p className="text-gray-700 text-lg font-medium">
                  Sign in to access your agent dashboard
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-Blue border border-red-200 text-white rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition duration-200 transform hover:scale-105 ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#5937E0]  to-[#000000] hover:from-[#5937E0] hover:to-[#000000] shadow-xl'
                    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center rounded-xl  py-3 px-4 bg-black justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In as Agent'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Dont have an agent account?{' '}
                  <Link
                    to="/agent-signup"
                    className="text-black hover:text-blue-700 font-semibold transition duration-200 hover:underline"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;