import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import countries from './countries'; // optional usage later

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    const password = formData.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) return;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid phone number is required (10 digits)';
    if (!isPasswordValid()) newErrors.password = 'Password does not meet all requirements';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit triggered!");

    if (!validateForm()) return;

    try {
      const { name, email, phone, password } = formData;

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token || '');
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  console.log("✅ SignUp component rendered");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <UserPlus size={48} className="mx-auto text-primary-600" />
          <h2 className="text-3xl font-bold">Create Your Account</h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <span className='text-green-600'>Enter a strong Password</span>
            <input
              name="password"
              type={showPassword.password ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              name="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isPasswordValid()}
              className={`w-full py-2 text-white rounded-lg ${isPasswordValid() ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-primary-600">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
