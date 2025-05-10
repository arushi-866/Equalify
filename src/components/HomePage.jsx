import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';
import { 
  MdOutlineSavings, 
  MdAnalytics, 
  MdSupportAgent, 
  MdAutoFixHigh, 
  MdRepeat, 
  MdGroup,
  MdTrackChanges, 
  MdGavel,
  MdUpdate,
  MdArrowForward,
  MdPhoneIphone
} from "react-icons/md";
import Chatbot from "./Chatbot/Chatbot.jsx";
// import Testimonials from "./Testimonials.jsx";

export default function HomePage() {
  const controls = useAnimation();
  const [paused, setPaused] = useState(false);

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  

  const features = [
    {
      title: "Smart Budget Planning",
      description: "Set budgets for trips, household expenses, or events and track spending in real-time.",
      icon: <MdOutlineSavings className="text-emerald-500 text-4xl" />,
      color: "bg-emerald-50",
      image: "/images/feature-1.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Expense Analytics",
      description: "Visualize spending patterns with intuitive charts and personalized insights.",
      icon: <MdAnalytics className="text-violet-500 text-4xl" />,
      color: "bg-violet-50",
      image: "/images/feature-2.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "AI Assistant",
      description: "Get instant help with our AI chatbot that answers questions and offers spending tips.",
      icon: <MdSupportAgent className="text-blue-500 text-4xl" />,
      color: "bg-blue-50",
      image: "/images/feature-3.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Smart Categorization",
      description: "Our AI automatically categorizes your expenses for accurate tracking and reporting.",
      icon: <MdAutoFixHigh className="text-amber-500 text-4xl" />,
      color: "bg-amber-50",
      image: "/images/feature-4.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Recurring Expenses",
      description: "Set up and manage recurring bills like rent, utilities, or subscriptions.",
      icon: <MdRepeat className="text-rose-500 text-4xl" />,
      color: "bg-rose-50",
      image: "/images/feature-5.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Group Management",
      description: "Create multiple groups for roommates, trips, events, or projects with custom settings.",
      icon: <MdGroup className="text-teal-500 text-4xl" />,
      color: "bg-teal-50",
      image: "/images/feature-6.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Expense Tracking",
      description: "Record expenses on the go with our mobile app and keep everyone updated.",
      icon: <MdTrackChanges className="text-green-500 text-4xl" />,
      color: "bg-green-50",
      image: "/images/feature-7.png",
      imageFallback: "/api/placeholder/400/320"
    },
    {
      title: "Smart Settlements",
      description: "Optimize debt repayments with our algorithm that minimizes the number of transactions.",
      icon: <MdGavel className="text-purple-500 text-4xl" />,
      color: "bg-purple-50",
      image: "/images/feature-8.png",
      imageFallback: "/api/placeholder/400/320"
    }
  ];

  const benefits = [
    "Split bills instantly with a single tap",
    "Track group expenses with detailed history",
    "Settle debts with minimal transactions",
    "Export detailed financial reports",
    "Support for 100+ global currencies",
    "Secure payment integration options",
    "Cloud sync across all your devices",
    "Privacy-focused expense management"
  ];

  const stats = [
    { number: "5M+", label: "Active Users" },
    { number: "$2B+", label: "Split Every Month" },
    { number: "180+", label: "Countries" },
    { number: "4.8", label: "App Store Rating" }
  ];

  // Auto-rotate features
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveFeatureIndex(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [features.length, isHovered]);

  useEffect(() => {
    if (featuresInView) {
      controls.start("visible");
    }
  }, [controls, featuresInView]);

  return (
    
    <div className="w-full overflow-hidden bg-gray-50">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac')] bg-cover bg-center opacity-10 rounded-bl-[80px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, x: -30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-20"
            >
              <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-4 py-1 rounded-full mb-6">
                Splitting Made Simple
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Balance Your Bills, <br />
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  Balance Your Life
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                The smarter way to track shared expenses, settle debts, and manage group finances with friends, roommates, and family.
              </p>
              
              <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary hover:scale-105 transition transform">
                🚀 Get Started - It's Free
              </Link>
              <Link to="/how-it-works" className="btn-secondary hover:bg-primary-50">
                📖 How It Works
              </Link>
            </div>
              
              {/* <div className="mt-8 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="bg-emerald-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">✓</span>
                <span className="text-sm text-gray-600">No credit card required</span>
              </div> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative h-[600px] w-full">
                {/* Phone mockup */}
                <div className="absolute top-0 right-0 w-[300px] h-[600px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 border-8 border-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    alt="Equalify app dashboard"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>
                </div>
                
                {/* Second phone mockup */}
                <div className="absolute bottom-0 left-12 w-[280px] h-[560px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 border-8 border-gray-800">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
                    alt="Group expense tracking"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>
                </div>
                
                {/* Floating badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute top-20 left-0 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
                >
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Split Instantly</h3>
                    <p className="text-sm text-gray-500">Fair splits every time</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute bottom-40 right-10 bg-white rounded-xl shadow-lg p-4 flex items-center space-x-3"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Group Friendly</h3>
                    <p className="text-sm text-gray-500">Perfect for any occasion</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>
      </div>

     

      {/* Features Section */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 relative bg-gradient-to-b from-gray-50 to-white">
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full opacity-30 translate-x-1/4 translate-y-1/4"></div>
  
  <div className="text-center mb-16 relative">
    <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full mb-4">
      POWERFUL FEATURES
    </span>
    <h2 className="text-4xl font-bold text-gray-900 mb-4">
      Everything You Need to Split Expenses
      <div className="h-1 w-24 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
      Simple, reliable, and perfect for roommates, trips, groups, and more
    </p>
  </div>

 
  <div
    className="carousel-visible relative mx-auto overflow-hidden"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
  >
    <div className={`carousel ${paused ? "paused" : ""}`}>
      {features.map((feature, index) => {
        const angle = (360 / features.length) * index;
        return (
          <div
            key={index}
            className="carousel-item"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              transform: `rotateY(${angle}deg) translateZ(500px)`,
            }}
          >
            <div className="feature-card bg-white p-6 w-[250px] h-[250px] rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 border border-gray-100">
              <div className="icon-wrapper mb-4 text-emerald-500 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
              
            </div>
          </div>
        );
      })}
    </div>
  </div>

 
  {/* Keeping the original carousel styling */}
  <style jsx>{`
    .carousel-visible {
      width: 100%;
      max-width: 2500px; /* Increased width to fit 4 items */
      height: 400px; /* Increased height for better visibility */
      clip-path: inset(0 1% 0 1%);
      perspective: 1800px; /* Increased depth */
      margin: 0 auto;
      position: relative;
    }
    .carousel {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotateY(0deg);
      transform-style: preserve-3d;
      animation: rotateCarousel 30s linear infinite;
    }
    .carousel.paused {
      animation-play-state: paused;
    }
    .carousel-item {
      position: absolute;
      width: 250px; /* Increased width for better spacing */
      height: 300px; /* Adjusted height */
      left: 50%;
      top: 50%;
      transform-origin: center center;
      margin: -150px 0 0 -125px;
      backface-visibility: hidden;
    }
    @keyframes rotateCarousel {
      from {
        transform: translate(-50%, -50%) rotateY(0deg);
      }
      to {
        transform: translate(-50%, -50%) rotateY(360deg);
      }
    }
    
    /* Additional styling for enhanced elements */
    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(16, 185, 129, 0.1);
      width: 48px;
      height: 48px;
      border-radius: 12px;
    }
    
    .feature-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    
    .feature-card:hover .icon-wrapper {
      transform: scale(1.1);
      transition: transform 0.3s ease;
    }
  `}</style>
</div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 py-24 text-white">
        <div 
          ref={benefitsRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1 rounded-full mb-6">
                WHY CHOOSE EQUALIFY
              </span>
              <h2 className="text-4xl font-bold mb-8 text-white">
                The Smart Way to Manage Shared Expenses
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircleIcon className="h-6 w-6 text-emerald-200 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12">
               
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={benefitsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-white/10 rounded-3xl"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-white/10 rounded-3xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                    alt="Team collaboration"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <MdOutlineSavings className="text-emerald-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Trip to Paris</h3>
                          <p className="text-sm text-gray-600">4 members • Created Mar 5</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total spent</span>
                          <span className="font-bold text-gray-900">$1,245.80</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Your share</span>
                          <span className="font-bold text-gray-900">$311.45</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">You owe</span>
                          <span className="font-bold text-emerald-600">$52.30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Split Expenses with Ease?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                Join millions of people using Equalify to split bills, track IOUs, and keep friendships drama-free.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Create Free Account</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
               
              </div>
              
              <div className="mt-12 flex justify-center space-x-8">
                {/* <div className="inline-flex items-center space-x-2">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-emerald-400" />
                  <span className="text-gray-300">Available on iOS & Android</span>/
                </div> */}
                <div className="inline-flex items-center space-x-2">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-400" />
                  <span className="text-gray-300">Completely free to use</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>

      {/* Add styles for background grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0, 128, 128, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 128, 128, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}