import React, { useState } from "react";
import BaseCard from "../../components/card";
import Button from "../../components/button";
import workHour from "../../assets/workhour.svg";
import mail from "../../assets/mail.svg";
import Contact from "../../assets/contact.svg";
import workingman from "../../assets/workingman.svg";
export default function ContactInformation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ **Live Validation Function**
  const validateForm = () => {
    let newErrors = {};

    // ✅ **Name Validation (Only Letters)**
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Only alphabets are allowed in Name.";
    }

    // ✅ **Email Validation**
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // ✅ **Message Validation (Max 500 Characters)**
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.length > 500) {
      newErrors.message = "Message cannot exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ If no errors, return true
  };

  // ✅ **Handle Input Change (Live Validation)**
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    // ✅ Revalidate individual field
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  // ✅ **Handle Form Submit (with API)**
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
    <div className="bg-gray p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-12">Contact Information</h1>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl gap-12">
        {/* Left Side - Contact Cards in 2x2 Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 pr-10 gap-6">
            {/* Support Card */}
            <BaseCard padding="p-6" width="195px" height="192px" className="flex flex-col">
              <div className="flex flex-col items-start">
                <div className="bg-gray p-2 rounded-md mr-4">
                  <img
                    src={mail}
                    alt="Mail icon"
                    className="w-[30px] h-[30px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Get Support</h3>
                  <p className="mt-1">example@gmail.com</p>
                  <p>(+91) 125 888 666</p>
                </div>
              </div>
            </BaseCard>

            {/* Working Time Card */}
            <BaseCard padding="p-6" width="195px" height="192px" className="flex flex-col ">
              <div className="flex flex-col items-start">
                <div className="bg-gray p-2 rounded-md mr-4">
                  <img
                    src={Contact}
                    alt="Contact icon"
                    className="w-[50px] h-[40px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Working Time</h3>
                  <p className="mt-1">example@gmail.com</p>
                  <p>(+91) 125 888 666</p>
                </div>
              </div>
            </BaseCard>

            {/* Contact Card */}
            <BaseCard padding="p-6" width="195px" height="192px" className="flex flex-col ">
              <div className="flex flex-col items-start">
                <div className="bg-gray p-2 rounded-md mr-4">
                  <img
                    src={workingman}
                    alt="Working Man icon"
                    className="w-[50px] h-[40px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Contact</h3>
                  <p className="mt-1">example@gmail.com</p>
                  <p>(+91) 125 888 666</p>
                </div>
              </div>
            </BaseCard>

            {/* Working Hours Card */}
            <BaseCard padding="p-6" width="195px" height="192px" className="flex flex-col">
              <div className="flex flex-col items-start">
                <div className="bg-gray p-2 rounded-md mr-4">
                  <img
                    src={workHour}
                    alt="Work Hour icon"
                    className="w-[50px] h-[40px]"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Working Hours</h3>
                  <p className="mt-1">example@gmail.com</p>
                  <p>(+91) 125 888 666</p>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="flex-1">
          <BaseCard width="w-full" height="auto" className="rounded-[25px]">
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
                  className={`shadow-sm bg-gray outline-none border ${errors.name ? "border-red-500" : "border-gray-300"} 
                    text-black text-[18px] rounded-lg block w-full p-2.5 placeholder-black/50`}
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
                  className={`shadow-sm bg-gray outline-none border ${errors.email ? "border-red-500" : "border-gray-300"} 
                    text-black text-[18px] rounded-lg block w-full p-2.5 placeholder-black/50`}
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
                  className={`block p-2.5 w-full text-[18px] outline-none text-black bg-gray rounded-lg border 
                    ${errors.message ? "border-red-500" : "border-gray-300"} placeholder-black/50`}
                  placeholder="Type your Query here..."
                ></textarea>
                {/* ✅ Error Below the Message Field */}
                {errors.message && <p className="text-red-500 text-[16px]">{errors.message}</p>}
              </div>

              {/* ✅ Button Centered */}
              <div className="flex justify-center">
                <Button
                  title="Submit"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default button behavior
                    handleSubmit(e);
                  }}
                  width="180px"
                  height="50px"
                />
              </div>
            </form>
          </BaseCard>
        </div>
      </div>
    </div>
  );
}