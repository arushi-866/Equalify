import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Sparkles, PieChart, Wallet, Target, TrendingUp, CreditCard, DollarSign, ShoppingBag, Home, BarChart, PiggyBank } from "lucide-react";

const FlashcardModal = ({ isOpen, closeModal, flashcardData, currentCard, handleNext }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && flashcardData) {
      // Reset selections when a new card is shown
      setSelectedOptions([]);
      setIsFlipped(false);
      
      // Calculate progress percentage
      setProgress((currentCard / (flashcardData.length - 1)) * 100);
    }
  }, [isOpen, currentCard, flashcardData]);

  if (!flashcardData || !flashcardData[currentCard]) return null;
  
  const { question, options, multiSelect, tip, icon } = flashcardData[currentCard];

  // Get the appropriate icon component
  const IconComponent = getIconComponent(icon);

  const toggleOption = (option) => {
    if (multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
      );
    } else {
      setSelectedOptions([option]); // Ensure only one selection is made
      setTimeout(() => {
        handleNext(option);
        setSelectedOptions([]); // Reset when moving to the next question
      }, 300);
    }
  };
  
  const handleMultiSubmit = () => {
    setTimeout(() => {
      handleNext(selectedOptions);
      setSelectedOptions([]); // Reset selection when moving to next question
    }, 300);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Helper function to get the right icon component
  function getIconComponent(iconName) {
    switch (iconName) {
      case 'PieChart': return PieChart;
      case 'Wallet': return Wallet;
      case 'Target': return Target;
      case 'TrendingUp': return TrendingUp;
      case 'CreditCard': return CreditCard;
      case 'DollarSign': return DollarSign;
      case 'ShoppingBag': return ShoppingBag;
      case 'Home': return Home;
      case 'BarChart': return BarChart;
      case 'PiggyBank': return PiggyBank;
      default: return Sparkles;
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        {/* Enhanced blurred background with gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-900/70 to-green-500/50 backdrop-blur-md" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md overflow-hidden"
          >
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped ? "back" : "front"}
                initial={{ rotateY: isFlipped ? -90 : 90 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: isFlipped ? 90 : -90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ perspective: 1000 }}
                className="relative bg-white rounded-xl shadow-2xl border-l-8 border-green-500"
              >
                {!isFlipped ? (
                  <div className="p-6">
                    {/* Card front */}
                    <div className="absolute -top-4 -right-4">
                      <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="bg-green-500 p-2 rounded-full shadow-lg"
                      >
                        <span className="text-white font-bold">{currentCard + 1}/{flashcardData.length}</span>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Dialog.Title className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                        {IconComponent && <IconComponent className="w-5 h-5 text-green-500" />}
                        <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                          Budget Analysis
                        </span>
                      </Dialog.Title>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-700 text-lg font-medium mb-6 p-3 bg-green-50 rounded-lg border-l-4 border-green-400"
                    >
                      {question}
                    </motion.p>

                    <div className="space-y-3 mt-6">
                      {options.map((option, index) => (
                        <motion.button
                          key={option}
                          onClick={() => toggleOption(option)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center justify-between w-full p-4 text-lg font-semibold rounded-lg transition-all 
                            ${selectedOptions.includes(option) 
                              ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-none" 
                              : "bg-white text-gray-700 border border-gray-200 hover:border-green-300"}`}
                        >
                          <span>{option}</span>
                          <AnimatePresence>
                            {selectedOptions.includes(option) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <CheckCircle className="w-6 h-6 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>

                    {multiSelect && (
                      <motion.button
                        onClick={handleMultiSubmit}
                        disabled={selectedOptions.length === 0}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`w-full mt-6 p-4 rounded-lg font-bold flex items-center justify-center gap-2
                          ${selectedOptions.length === 0 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-200"}`}
                      >
                        Submit <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    )}

                    {tip && (
                      <motion.button
                        onClick={flipCard}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1 hover:underline"
                      >
                        <span>See Tip</span>
                        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, repeatDelay: 1.5 }}>→</motion.span>
                      </motion.button>
                    )}

                    <button 
                      onClick={closeModal} 
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Card back - Tip */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col"
                    >
                      <Dialog.Title className="text-xl font-bold text-green-700 mb-2">
                        Budget Tip
                      </Dialog.Title>
                      
                      <div className="bg-green-50 p-4 rounded-lg flex-grow mb-4 border-l-4 border-green-400">
                        <p className="text-gray-700">{tip || "Keep track of your daily expenses to better understand your spending habits."}</p>
                      </div>
                      
                      <motion.button
                        onClick={flipCard}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full p-3 bg-green-600 text-white rounded-lg font-bold"
                      >
                        Back to Question
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex justify-between">
              <button 
                onClick={closeModal} 
                className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
              >
                Skip for now
              </button>
              <div className="text-white/80 text-sm">
                Question {currentCard + 1} of {flashcardData.length}
              </div>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Example flashcard data - comprehensive set of budget analysis questions
const budgetFlashcardData = [
  {
    question: "What is your primary financial goal right now?",
    options: [
      "Paying off debt",
      "Building emergency savings",
      "Saving for a major purchase",
      "Investing for retirement",
      "Improving monthly cash flow"
    ],
    multiSelect: false,
    icon: "Target",
    tip: "Clearly defining your top financial priority helps you allocate resources effectively and make progress toward what matters most to you."
  },
  {
    question: "How would you describe your current budgeting approach?",
    options: [
      "I don't track expenses at all",
      "I mentally keep track of spending",
      "I use a spreadsheet or app occasionally",
      "I have a detailed budget I review weekly",
      "I follow a strict zero-based budget system"
    ],
    multiSelect: false,
    icon: "PieChart",
    tip: "Regular budget tracking is the foundation of financial success. Consider upgrading your approach by using a dedicated app or setting aside 15 minutes weekly to review expenses."
  },
  {
    question: "What percentage of your monthly income goes toward housing costs?",
    options: [
      "Less than 20%",
      "20-30%",
      "30-40%",
      "40-50%",
      "More than 50%"
    ],
    multiSelect: false,
    icon: "Home",
    tip: "Financial experts typically recommend spending no more than 30% of your gross income on housing. If you're spending more, consider ways to reduce costs or increase income."
  },
  {
    question: "Which categories do you typically overspend in? (Select all that apply)",
    options: [
      "Dining out/Food delivery",
      "Entertainment/Subscriptions",
      "Shopping/Impulse purchases",
      "Transportation/Ride sharing",
      "Travel/Leisure activities"
    ],
    multiSelect: true,
    icon: "ShoppingBag",
    tip: "Identifying spending weak spots is the first step to controlling them. Consider using the envelope method or category-specific spending limits for problem areas."
  },
  {
    question: "How much of your income do you currently save or invest monthly?",
    options: [
      "0% - I'm not saving regularly",
      "1-5% of my income",
      "6-10% of my income",
      "11-20% of my income",
      "More than 20% of my income"
    ],
    multiSelect: false,
    icon: "PiggyBank",
    tip: "Financial experts often recommend saving at least 20% of your income. Start where you can and increase gradually by 1% every few months to reach your goal."
  },
  {
    question: "What's your current debt situation?",
    options: [
      "No debt",
      "Only mortgage/student loans",
      "Less than $10,000 in consumer debt",
      "$10,000-$50,000 in consumer debt",
      "More than $50,000 in consumer debt"
    ],
    multiSelect: false,
    icon: "CreditCard",
    tip: "Consider using either the snowball method (paying smallest debts first) or avalanche method (highest interest first) to systematically eliminate debt."
  },
  {
    question: "How many months of expenses do you have in emergency savings?",
    options: [
      "None",
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months"
    ],
    multiSelect: false,
    icon: "Wallet",
    tip: "Most financial experts recommend keeping 3-6 months of essential expenses in an easily accessible emergency fund before focusing on other financial goals."
  },
  {
    question: "Which expense reduction strategies are you interested in trying?",
    options: [
      "Meal planning and grocery optimization",
      "Reviewing and canceling subscriptions",
      "Negotiating bills (internet, phone, insurance)",
      "Energy efficiency improvements",
      "Transportation cost reduction"
    ],
    multiSelect: true,
    icon: "TrendingUp",
    tip: "Small changes across multiple categories often add up to more sustainable savings than drastic cuts in one area. Start with the easiest wins first."
  },
  {
    question: "How often do you review your recurring subscriptions and memberships?",
    options: [
      "Never",
      "Annually",
      "Every few months",
      "Monthly",
      "I have a system that alerts me to renewals"
    ],
    multiSelect: false,
    icon: "BarChart",
    tip: "Subscription costs often increase over time and many go unused. Set a quarterly calendar reminder to audit all recurring charges and cancel those not providing value."
  },
  {
    question: "Which financial habits would you like to develop? (Select all that apply)",
    options: [
      "Regular expense tracking",
      "Automated savings",
      "Meal planning to reduce food waste",
      "Researching before major purchases",
      "Weekly budget check-ins"
    ],
    multiSelect: true,
    icon: "Target",
    tip: "Focus on establishing one new financial habit at a time. It takes about 66 days for a new habit to become automatic, so give yourself time to adjust before adding another."
  },
  {
    question: "What's your current retirement savings strategy?",
    options: [
      "Not currently saving for retirement",
      "Contributing enough to get employer match",
      "Maxing out tax-advantaged accounts",
      "Contributing to both retirement and taxable accounts",
      "Following a specific FIRE (Financial Independence) plan"
    ],
    multiSelect: false,
    icon: "TrendingUp",
    tip: "At minimum, contribute enough to get your full employer match (free money!). Aim to eventually save 15% of your income for retirement, including employer contributions."
  },
  {
    question: "How do you currently track your net worth?",
    options: [
      "I don't track my net worth",
      "I have a rough mental estimate",
      "I calculate it manually occasionally",
      "I use a spreadsheet updated quarterly",
      "I use financial software that updates automatically"
    ],
    multiSelect: false,
    icon: "DollarSign",
    tip: "Tracking net worth provides a big-picture view of your financial progress beyond just budgeting. Consider reviewing quarterly to see the impact of your financial decisions."
  },
  {
    question: "Which financial protection measures do you have in place? (Select all that apply)",
    options: [
      "Health insurance",
      "Life insurance",
      "Disability insurance",
      "Property/renters insurance",
      "Will or estate plan"
    ],
    multiSelect: true,
    icon: "Wallet",
    tip: "Insurance protects your financial foundation. Review your coverage annually to ensure it matches your current life circumstances and financial obligations."
  },
  {
    question: "How do you plan for irregular or annual expenses?",
    options: [
      "I don't plan for them specifically",
      "I use credit when they come up",
      "I try to save a bit extra when I can",
      "I have separate sinking funds for categories",
      "I have a detailed annual budget with monthly allocations"
    ],
    multiSelect: false,
    icon: "PieChart",
    tip: "Sinking funds (small monthly contributions toward future expenses) help smooth out your budget and avoid debt for predictable irregular costs like car repairs or holiday gifts."
  },
  {
    question: "What's your approach to major purchases?",
    options: [
      "I buy when I need/want something",
      "I use financing or credit when available",
      "I save for a short time then buy",
      "I research thoroughly and save until I can afford it",
      "I follow a specific waiting period rule before purchasing"
    ],
    multiSelect: false,
    icon: "ShoppingBag",
    tip: "Consider implementing a 30-day rule for major purchases: wait 30 days between deciding to buy something and actually making the purchase to avoid impulse spending."
  }
];

export default FlashcardModal;
export { budgetFlashcardData };