import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = React.useState(null);

  const faqs = [
    {
      question: "How does expense splitting work?",
      answer: "Our expense splitting feature automatically calculates how much each person owes based on the total amount and number of participants. You can also customize the split based on percentages or specific amounts for each person."
    },
    {
      question: "Can I use multiple currencies?",
      answer: "Yes! Equalify supports multiple currencies and automatically converts amounts using current exchange rates. You can set your preferred currency in the settings."
    },
    {
      question: "How do I add friends to a group?",
      answer: "You can add friends to a group by clicking the 'Create Group' button, entering the group name, and then inviting friends via email or from your existing friends list."
    },
    {
      question: "What payment methods are supported?",
      answer: "Currently, Equalify tracks expenses and calculates balances but doesn't process payments directly. You can settle up using your preferred payment method outside the app."
    },
    {
      question: "How do I handle recurring expenses?",
      answer: "You can set up recurring expenses by creating an expense and marking it as recurring. Choose the frequency (monthly, weekly, etc.) and Equalify will automatically create new expenses."
    },
    {
      question: "Can I export my expense history?",
      answer: "Yes, you can export your expense history as a CSV or PDF file. Go to your group or personal expenses and click the export button in the top right corner."
    },
    {
      question: "What happens if someone doesn't pay their share?",
      answer: "Equalify tracks all pending payments and sends automatic reminders. You can also manually send reminders and set payment deadlines."
    },
    {
      question: "Is my financial information secure?",
      answer: "Yes, we use bank-level encryption to protect your data. We never store actual payment information, only the transaction details you enter."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Frequently Asked Questions
        </motion.h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openQuestion === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openQuestion === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 py-4 bg-gray-50"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}