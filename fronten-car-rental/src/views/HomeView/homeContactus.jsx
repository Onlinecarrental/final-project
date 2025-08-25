import React, { useState } from "react";
import BaseCard from "../../components/card";
import HeadingTitle from "../../components/heading";
import Button from "../../components/button";
import contactImage from "../../assets/contactus.svg";
import axios from 'axios';

const HomeContactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  // Validation Function
  const validateForm = () => {
    let newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only alphabets are allowed in Name.";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Message Validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.length > 500) {
      newErrors.message = "Message cannot exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const API_BASE_URL = "https://backend-car-rental-production.up.railway.app/api";
        const res = await fetch(`${API_BASE_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role: 'customer' })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.errors ? data.errors.map(e => e.msg).join('\n') : data.error);
          return;
        }
        alert("Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } catch (err) {
        alert("Failed to submit: " + err.message);
      }
    }
  };


  return (
    <section className="bg-gray flex font-jakarta justify-between flex-col py-8 lg:py-16  w-full">
      <div className="mb-6">
        <HeadingTitle title="Contact us" paragraph="To make renting easy and hassle-free, we provide a variety of services and advantages. We have you covered with a variety of vehicles and flexible rental terms." width="220px" />
      </div>

      <div className="grid grid-cols-1 mx-w-[1120px] mx-auto mt-4 md:grid-cols-2 gap-8">
        {/* Contact Form inside BaseCard */}
        <BaseCard width="500px" height="620px" bgColor="bg-white " className="rounded-[25px]">
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* ✅ Heading Centered */}
            <h2 className="text-center text-[24px] font-bold text-black">Get In Touch With Us</h2>

            {/* ✅ Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2 text-[18px] font-medium text-black">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`shadow-sm bg-gray outline-none border ${errors.name ? "border-red-500" : "border-gray-300"
                  } text-black text-[18px] rounded-lg block w-full p-2.5 placeholder-black/50`}
                placeholder="Enter your Name"
              />
              {errors.name && <p className="text-red-500 text-[16px]">{errors.name}</p>}
            </div>

            {/* ✅ Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 text-[18px] font-medium text-black">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`shadow-sm bg-gray outline-none border ${errors.email ? "border-red-500" : "border-gray-300"
                  } text-black text-[18px] rounded-lg block w-full p-2.5 placeholder-black/50`}
                placeholder="Enter your Email"
              />
              {errors.email && <p className="text-red-500 text-[16px]">{errors.email}</p>}
            </div>

            {/* ✅ Message Field (Error Properly Below) */}
            <div>
              <label htmlFor="message" className="block mb-2 text-[18px] font-medium text-black">
                Message:
              </label>
              <textarea
                id="message"
                rows="4"
                maxLength="500" // ⬅️ Limits to 500 characters
                value={formData.message}
                onChange={handleChange}
                className={`block p-2.5 w-full text-[18px] outline-none text-black bg-gray rounded-lg border ${errors.message ? "border-red-500" : "border-gray-300"
                  } placeholder-black/50`}
                placeholder="Type your Query here..."
              ></textarea>
              {/* ✅ Error Below the Message Field */}
              {errors.message && <p className="text-red-500 text-[16px] ">{errors.message}</p>}
            </div>

            {/* Submit Button with Loading State */}
            <div className="flex flex-col items-center gap-4">
              <Button
                title={isSubmitting ? 'Sending...' : 'Submit'}
                onClick={handleSubmit}
                width="180px"
                height="50px"
                disabled={isSubmitting}
              />
              {submitStatus.message && (
                <div className={`text-center text-sm p-2 rounded-md ${
                  submitStatus.success ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        </BaseCard>

    
        <div>
        <img
    src={contactImage}
    alt="Contact Illustration"
    className="w-[550px] h-full object-cover  rounded-[25px] shadow-[4px_10px_30px_0px_rgba(0,0,0,0.3)]"
/>
</div>
      </div>
    </section>
  );
};

export default HomeContactus;
