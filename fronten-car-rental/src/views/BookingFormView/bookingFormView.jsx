import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import axios from 'axios';
import { auth } from '../../firebase/config';

export default function BookingForm() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const carDetails = locationHook.state?.carDetails;
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const locationInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    mobile: '+92',
    location: '',
    dateFrom: '',
    dateTo: '',
    price: carDetails?.dailyRate || '',
    carId: carDetails?.id || '',
    carName: carDetails?.name || '',
    carModel: carDetails?.model || ''
  });

  const [errors, setErrors] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";

  // Validate each step (move price, payment method, payment number to step 2)
  // Location API functions
  const normalize = (str) => (str || '')
    .toLowerCase()
    .replace(/\b(district|division|province|state|city|tehsil)\b/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const extractCityFromInput = (value) => {
    const raw = (value || '').toLowerCase();
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    const blacklist = ['district', 'division', 'province', 'state', 'country', 'pakistan', 'india', 'punjab', 'sindh', 'kpk', 'balochistan', 'azad kashmir', 'pb', 'pk'];
    for (const p of parts) {
      if (p.length >= 3 && blacklist.every(w => !p.includes(w))) return normalize(p);
    }
    const fallback = parts.find(p => p.length >= 3) || raw;
    return normalize(fallback);
  };
  const buildDisplayLabelFromLocationIQ = (item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || '';
    if (!city) return '';
    return `${city}, Pakistan`;
  };

  const extractCityNameFromLocationIQ = (item) => {
    const addr = item.address || {};
    return addr.city || addr.town || addr.village || addr.county || '';
  };

  const fetchLocations = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      // LocationIQ Autocomplete API (Pakistan only, cities only)
      const url = `https://api.locationiq.com/v1/autocomplete?key=pk.41bdd2ef6f73572085513083abde96b4&q=${encodeURIComponent(query)}&limit=7&countrycodes=pk&normalizecity=1&dedupe=1&addressdetails=1&tag=place:city`;

      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const data = await res.json();

      const items = (Array.isArray(data) ? data : [])
        .map(item => {
          const cityName = extractCityNameFromLocationIQ(item);
          const label = buildDisplayLabelFromLocationIQ(item);
          return {
            id: item.place_id || `${item.lat},${item.lon}`,
            label,
            cityName,
            raw: item,
          };
        })
        .filter(x => !!x.label && !!x.cityName);

      setSuggestions(items);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, location: value }));
    setShowSuggestions(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchLocations(value);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, location: suggestion.cityName }));
    setShowSuggestions(false);
  };

  // Phone number formatting
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('92')) {
      value = `+${value}`;
    } else if (value.startsWith('0')) {
      value = `+92${value.substring(1)}`;
    } else if (!value.startsWith('+')) {
      value = `+92${value}`;
    }

    // Limit to 13 characters (+92XXXXXXXXXX)
    if (value.length > 13) {
      value = value.substring(0, 13);
    }

    setFormData(prev => ({ ...prev, mobile: value }));
  };

  const validateStep = () => {
    const stepErrors = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) stepErrors.name = 'Name is required';
      if (!formData.email.trim()) stepErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Invalid email address';
      if (!formData.mobile.trim()) stepErrors.mobile = 'Mobile number is required';
      else if (!/^\+92\d{10}$/.test(formData.mobile)) stepErrors.mobile = 'Phone must be in format +92XXXXXXXXXX';
    }
    if (currentStep === 2) {
      if (!formData.location.trim()) stepErrors.location = 'Location is required';
      const from = parseDMY(formData.dateFrom);
      const to = parseDMY(formData.dateTo);
      if (!formData.dateFrom || isNaN(from.getTime())) stepErrors.dateFrom = 'Valid start date required (DD/MM/YYYY)';
      if (!formData.dateTo || isNaN(to.getTime())) stepErrors.dateTo = 'Valid end date required (DD/MM/YYYY)';
      if (!stepErrors.dateFrom && !stepErrors.dateTo && from > to) stepErrors.dateTo = 'End date must be after start date';
      // Add payment fields validation to step 2
      if (!formData.price.toString().trim()) stepErrors.price = 'Price is required';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Parse date in DD/MM/YYYY
  const parseDMY = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && /[^a-zA-Z\s]/.test(value)) return;
    if (name === 'mobile' && /[^0-9]/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Step navigation
  const nextStep = () => { if (validateStep()) setCurrentStep(currentStep + 1); };
  const prevStep = () => { setCurrentStep(currentStep - 1); };

  // Create chat and send initial message as the real customer
  const createChatWithAgent = async () => {
    try {
      const currentUser = auth.currentUser;
      const userFromStorage = JSON.parse(localStorage.getItem('user')) || {};
      const userId = currentUser?.uid || userFromStorage.uid;
      const agentId = carDetails?.agentId;
      if (!userId) {
        setSubmitError('You must be logged in to book and chat.');
        setLoading(false);
        return;
      }
      if (!agentId) throw new Error('No agent assigned to this car.');

      // Create chat
      const chatResponse = await axios.post(`${API_BASE_URL}/chats`, { userId, agentId });
      const chatData = chatResponse.data.data;
      // Check participants array
      if (!chatData.participants || chatData.participants.length !== 2 || !chatData.participants.includes(userId) || !chatData.participants.includes(agentId)) {
        throw new Error('Chat participants not set correctly. Please contact support.');
      }
      localStorage.setItem('activeChatId', chatData._id);
      localStorage.setItem('currentAgentId', agentId);

      // Send message as the real customer
      const messageData = {
        chatId: chatData._id,
        senderId: userId,
        senderRole: 'customer',
        text: `New booking: ${formData.carName} ${formData.carModel} from ${formData.dateFrom} to ${formData.dateTo} at ${formData.location}. Customer: ${formData.name} (${formData.email})`
      };
      await axios.post(`${API_BASE_URL}/chats/messages`, messageData);
      return { success: true, chatId: chatData._id };
    } catch (error) {
      console.error('Error in createChatWithAgent:', error);
      throw error;
    }
  };

  // Handle booking form submission
  const handleSubmit = async () => {
    if (validateStep()) {
      setSubmitError('');
      setLoading(true);
      try {
        // 1. Create booking in backend
        const bookingPayload = {
          car: carDetails?.id,
          customer: user.uid,
          agent: carDetails?.agentId,
          dateFrom: parseDMY(formData.dateFrom),
          dateTo: parseDMY(formData.dateTo),
          location: formData.location,
          price: Number(formData.price)
        };
        await axios.post(`${API_BASE_URL}/bookings`, bookingPayload);
        // 2. Proceed with chat system as before
        const chatResult = await createChatWithAgent();
        setBookingSuccess(true);
        navigate('/home/customer-chat', { state: { chatId: chatResult.chatId } });
      } catch (error) {
        setSubmitError('Booking successful, but there was an issue starting the chat. Please contact support.');
        setBookingSuccess(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form after booking
  const resetForm = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      mobile: '+92',
      location: '',
      dateFrom: '',
      dateTo: '',
      price: carDetails?.dailyRate || '',
      carId: carDetails?.id || '',
      carName: carDetails?.name || '',
      carModel: carDetails?.model || ''
    });
    setCurrentStep(1);
    setBookingSuccess(false);
  };

  // Date pickers
  const paymentMethods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash'];
  useEffect(() => {
    if (currentStep === 2) {
      const fromPicker = flatpickr('#dateFrom', {
        dateFormat: 'd/m/Y',
        allowInput: true,
        onChange: ([date]) => {
          const formatted = flatpickr.formatDate(date, 'd/m/Y');
          setFormData(prev => ({ ...prev, dateFrom: formatted }));
          setErrors(prev => ({ ...prev, dateFrom: '' }));
        }
      });
      const toPicker = flatpickr('#dateTo', {
        dateFormat: 'd/m/Y',
        allowInput: true,
        minDate: formData.dateFrom || null,
        onChange: ([date]) => {
          const formatted = flatpickr.formatDate(date, 'd/m/Y');
          setFormData(prev => ({ ...prev, dateTo: formatted }));
          setErrors(prev => ({ ...prev, dateTo: '' }));
        }
      });
      return () => {
        fromPicker.destroy();
        toPicker.destroy();
      };
    }
  }, [currentStep, formData.dateFrom]);

  return (
    <div className="w-full mx-auto font-jakarta bg-white">
      <div className="p-4">
        {bookingSuccess ? (
          <div className="text-center max-w-[700px] mx-auto p-14">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-3xl font-[600] mb-2">Booking Successful!</h2>
            <p className="text-[18px]">Your booking has been confirmed.</p>
            {submitError ? (
              <div className="text-yellow-600 mb-4 p-3 bg-yellow-100 rounded-md">
                {submitError}
              </div>
            ) : (
              <p className="mb-6 text-[18px]">Redirecting you to chat with agent...</p>
            )}
            <button
              onClick={resetForm}
              className="px-4 py-4 bg-Blue text-[18px] text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Make Another Booking'}
            </button>
          </div>
        ) : (
          <>
            <div className="text-center font-bold text-[35px] mb-8">BOOKING FORM</div>
            {carDetails && (
              <div className="max-w-[700px] mx-auto mb-8 p-4 bg-gray rounded-md">
                <h3 className="text-xl font-bold mb-2">Selected Car Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="font-semibold">Car Name:</p><p>{carDetails.name}</p></div>
                  <div><p className="font-semibold">Model:</p><p>{carDetails.model}</p></div>
                  <div><p className="font-semibold">Daily Rate:</p><p>{carDetails.dailyRate}pkr/day</p></div>
                  <div><p className="font-semibold">Weekly Rate:</p><p>{carDetails.weeklyRate}pkr/week</p></div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center ">
              {[1, 2].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={` w-20  h-20 rounded-md flex items-center text-[24px] font-[500] justify-center ${step <= currentStep ? 'bg-black text-white' : 'bg-gray text-white'}`}>{step}</div>
                  {step < 2 && <div className={`h-[10px] w-[8rem] ${step < currentStep ? 'bg-black' : 'bg-gray'}`}></div>}
                </div>
              ))}
            </div>
            <div className="p-4">
              {currentStep === 1 && (
                <div className="bg-gray mx-auto max-w-[700px] p-4 rounded-md">
                  <div className=" text-center  text-[28px] font-bold">Personal Detail</div>
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" className="w-full p-2 border border-gray-300 rounded-md" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" className="w-full p-2 border border-gray-300 rounded-md" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Mobile No:</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handlePhoneChange}
                      placeholder="+923001234567"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      maxLength={13}
                    />
                    {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button disabled className="px-4 py-2 bg-white text-black rounded-md opacity-50 cursor-not-allowed">Back</button>
                    <button onClick={nextStep} className="px-4 py-2 bg-Blue text-white rounded-md">Next</button>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="bg-gray mx-auto max-w-[700px] p-4 rounded-md">
                  <div className=" text-center  text-[28px] font-bold">Booking & Payment Details</div>
                  <div className="mb-4 relative">
                    <label className="block text-lg font-[500] mb-1">Location:</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleLocationChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Enter city name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        autoComplete="off"
                        ref={locationInputRef}
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                          {suggestions.map((s) => (
                            <div
                              key={s.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                              onMouseDown={() => handleSelectSuggestion(s)}
                            >
                              <div className="font-medium text-gray-900">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Date From:</label>
                    <input type="text" id="dateFrom" value={formData.dateFrom} onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })} placeholder="DD/MM/YYYY" className="w-full p-2 border border-gray-300 rounded-md" />
                    {errors.dateFrom && <p className="text-red-500 text-sm">{errors.dateFrom}</p>}</div>
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Date To:</label>
                    <input type="text" id="dateTo" value={formData.dateTo} onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })} placeholder="DD/MM/YYYY" className="w-full p-2 border border-gray-300 rounded-md" />
                    {errors.dateTo && <p className="text-red-500 text-sm">{errors.dateTo}</p>}</div>
                  {/* Price field only, read-only, set from car details */}
                  <div className="mb-4 ">
                    <label className="block text-lg font-[500] mb-1">Price:</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">RP </span>
                      <input type="number" name="price" value={formData.price} readOnly className="w-full p-2 pl-8 border border-gray-300 rounded-md bg-gray  cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button onClick={prevStep} className="px-4 py-2 bg-white text-black rounded-md">Previous</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-Blue text-white rounded-md">Submit </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}