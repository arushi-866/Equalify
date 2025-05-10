import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function SupportCenter() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#EEF7F5] to-[#7CC5B8] rounded-xl shadow-lg p-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#29A18C] to-[#2DA38E] bg-clip-text text-transparent"
          >
            We're Here to Help! ✨
          </motion.h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Your satisfaction is our priority! Our support team typically responds within 2 hours.
            Check our FAQ or reach out directly below.
          </p>
        </motion.div>
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 p-4 rounded-md mb-6 flex items-center gap-2"
            >
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <p className="text-green-700">Message sent successfully!</p>
            </motion.div>
          )}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 p-4 rounded-md mb-6 flex items-center gap-2"
            >
              <XCircleIcon className="h-6 w-6 text-red-600" />
              <p className="text-red-700">Failed to send message. Please try again.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <PhoneIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Direct Contact</h3>
                  <p className="text-gray-600">+91-62834-15663</p>
                  <p className="text-gray-600">support@equalify.com</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                  <p className="text-gray-600">Mon-Fri: 9AM - 5PM IST</p>
                  <p className="text-gray-600">Sat: 10AM - 2PM IST</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <EnvelopeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Other Channels</h3>
                  {/* <p className="text-gray-600">Twitter: @equalify_support</p> */}
                  <p className="text-gray-600">Live Chat (in-app)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.form
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="space-y-4">
              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-small text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-small text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-small text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-small text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-small text-gray-700">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#29A18C] to-[#29A18C] text-white py-3 px-6 rounded-md font-small hover:shadow-lg transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Send Message'
                )}
              </motion.button>

              <Link 
                to="/faq" 
                className="inline-flex items-center text-[#289E89] hover:text-[#0A5B83] text-sm font-medium mt-4"
              >
                Check our FAQs first
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}