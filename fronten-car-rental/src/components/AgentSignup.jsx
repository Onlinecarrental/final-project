import React, { useState } from 'react';
import logo from '../assets/LOGO.png';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

// Cloudinary Upload Function
const uploadToCloudinary = async (file, userId, fileType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'upload_preset');
  formData.append('public_id', `agents/${userId}/license/${fileType}`);

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dlinqw87p/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error('Cloudinary upload error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

const AgentSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [license, setLicense] = useState('');
  const [licensePic, setLicensePic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation helpers
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) =>
    /^\d{11}$/.test(phone);
  const validateCnic = (cnic) =>
    /^\d{5}-\d{7}-\d{1}$/.test(cnic);

  // CNIC input handler with auto-dash
  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // sirf digits
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    if (value.length > 13) value = value.slice(0, 13) + '-' + value.slice(13, 14);
    if (value.length > 15) value = value.slice(0, 15); // max length
    setCnic(value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (!value.startsWith('92')) {
      value = '92' + value; // Ensure it starts with '92'
    }
    if (value.length > 12) {
      value = value.slice(0, 12); // Limit to +92XXXXXXXXXX format
    }
    setPhone('+' + value);
  };

  const handleLicenseChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''); // Allow only uppercase letters, numbers, and dashes
    if (value.length > 2 && !value.includes('-')) {
      value = value.slice(0, 2) + '-' + value.slice(2); // Add dash after first 2 characters
    }
    if (value.length > 5 && value.split('-').length === 2) {
      value = value.slice(0, 5) + '-' + value.slice(5); // Add dash after year
    }
    if (!/^[A-Z]{2}-/.test(value)) {
      value = value.replace(/^[^A-Z]{0,2}/, ''); // Ensure first two characters are alphabets
    }
    if (value.length > 12) {
      value = value.slice(0, 12); // Limit to XX-23-123456 format
    }
    setLicense(value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (!validatePhone(phone)) {
      setError('Phone number must be exactly 11 digits.');
      setLoading(false);
      return;
    }
    if (!validateCnic(cnic)) {
      setError('CNIC must be in the format 12345-1234567-1');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (!cnicFront || !cnicBack) {
      setError('Please upload both CNIC front and back images.');
      setLoading(false);
      return;
    }
    if (!license) {
      setError('Please enter license card number.');
      setLoading(false);
      return;
    }
    if (!licensePic) {
      setError('Please upload license card image.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Step 2: Upload images to Cloudinary
      const frontUrl = await uploadToCloudinary(cnicFront, userId, 'cnic_front');
      const backUrl = await uploadToCloudinary(cnicBack, userId, 'cnic_back');
      const licenseUrl = await uploadToCloudinary(licensePic, userId, 'license_pic');

      // Step 3: Save agent data to Firestore (collection: agent)
      await setDoc(doc(db, 'agent', userId), {
        name,
        email,
        phone,
        cnic,
        cnicFrontUrl: frontUrl,
        cnicBackUrl: backUrl,
        license,
        licensePicUrl: licenseUrl,
        createdAt: new Date(),
        role: "agent"
      });

      alert('Signup successful! Redirecting to login...');
      navigate('/agent-login', { state: { email, password } });

    } catch (error) {
      setError('Signup Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-jakarta bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Logo and Branding */}
          <div className="lg:w-[40%] flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#a9a9a9] via-[#ffffff] to-[#5937E0] p-8 lg:p-12">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-24 h-24 border-4 border-[#5937E0] rounded-full opacity-20"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-[#000000] rounded-full opacity-20"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-[#ffffff] rounded-full opacity-20"></div>
              <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-[#5937E0] rounded-full opacity-10"></div>
            </div>
            <div className="relative z-10 text-center">
              <div className="bg-white/90 rounded-full p-5 mb-6 shadow-xl border-4 border-[#5937E0] flex items-center justify-center transition-transform duration-300 hover:scale-105">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </div>
              <h1 className="text-4xl font-extrabold mb-2 tracking-wide text-[#000000] drop-shadow-sm">
              Onlne Car Rental
              </h1>
              <p className="text-2xl font-semibold opacity-90 text-[#5937E0] tracking-wide mb-2">
                AGENT PORTAL
              </p>
              <p className="mt-6 text-lg opacity-80 text-[#000000] font-medium">
                Join our agent network! Create your agent account to start managing cars.
              </p>
            </div>
          </div>

          {/* Right: Signup Form */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-[#5937E0] mb-2 drop-shadow-sm">
                  Agent Registration
                </h2>
                <p className="text-gray-700 text-lg font-medium">
                  Fill in your details to become an agent
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        placeholder="+92XXXXXXXXXX"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        maxLength={13}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="12345-1234567-1"
                        value={cnic}
                        onChange={handleCnicChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        maxLength={15}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Card Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="LE-23-123456"
                        value={license}
                        onChange={handleLicenseChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                        disabled={loading}
                      />
                    </div>
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Card Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLicensePic(e.target.files[0])}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-Blue file:text-white file:hover:bg-Blue"
                       disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC Front Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCnicFront(e.target.files[0])}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-Blue file:text-white file:hover:bg-Blue"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC Back Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCnicBack(e.target.files[0])}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2  transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-Blue file:text-white file:hover:bg-Blue"
                        disabled={loading}
                      />
                    </div>
                  </div>

                
                </div>

                <button
                  type="submit"
                   className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition duration-200 transform hover:scale-105 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#5937E0]  to-[#000000] hover:from-[#5937E0] hover:to-[#000000] shadow-xl'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating agent account...
                    </div>
                  ) : (
                    'Create Agent Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an agent account?{' '}
                  <Link 
                    to="/agent-login" 
                  className="text-[#5937E0] hover:text-[#000000] font-semibold transition duration-200 hover:underline"
                   >
                    Sign in now
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

export default AgentSignup;