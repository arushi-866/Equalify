import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaLock,
  FaQuestionCircle,
  FaHeadset,
  FaFileAlt,
  FaShieldAlt
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 w-full py-6">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">Equalify</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Split expenses with friends and family with ease.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                <FaFacebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                <FaTwitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                <FaInstagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center">
                  <FaQuestionCircle className="mr-2" size={14} /> FAQs
                </Link>
              </li>
              <li>
                <Link to="/supportcentre" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center">
                  <FaHeadset className="mr-2 text-primary-500" size={14} />
                  Support Centre
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center">
                  <FaShieldAlt className="mr-2 text-primary-500" size={14} />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center">
                  <FaFileAlt className="mr-2 text-primary-500" size={14} /> About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 flex items-center">
                  <FaFileAlt className="mr-2 text-primary-500" size={14} /> Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-gray-300 dark:border-gray-600 pt-4 text-center text-sm text-gray-500">
          <p>© {currentYear} Equalify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
