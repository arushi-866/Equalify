import React from "react";
import { motion } from "framer-motion";

export const Button = ({ onClick, children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-[#2FA48F] hover:bg-[#1F7D6D] text-white font-medium py-2 px-4 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors"
    >
      {children}
    </motion.button>
  );
};
