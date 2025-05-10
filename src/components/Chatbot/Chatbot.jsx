import equiBotLogo from "@/assets/equiBotLogo.webp";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm EquiBot. How can I help you with Equalify today?", sender: "bot" }
    ]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Focus input when chat is opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // API base URL with fallback
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Local response handler for common questions
    const getLocalResponse = (userMessage) => {
        const messageLower = userMessage.toLowerCase();
        
        // Navigation-related queries
        if (messageLower.includes("create a group") || messageLower.includes("add group") || messageLower.includes("new group")) {
            return {
                text: "To create a new group in Equalify, follow these steps:\n\n1. Go to the Dashboard\n2. Click on the '+ New Group' button\n3. Enter a name for your group\n4. Add members by email or username\n5. Click 'Create Group'\n\nWould you like me to take you to the group creation page?",
                actionType: "navigation",
                actionPath: "dashboard"
            };
        }
        
        if (messageLower.includes("split expenses") || messageLower.includes("add expense")) {
            return {
                text: "To split an expense in Equalify:\n\n1. Open the group where you want to add the expense\n2. Click '+ Add Expense'\n3. Enter the expense details (amount, description, date)\n4. Select who paid and who should share the cost\n5. Click 'Save Expense'\n\nWould you like me to take you to your groups to add an expense?",
                actionType: "navigation",
                actionPath: "/dashboard"
            };
        }
        
        if (messageLower.includes("settle up") || messageLower.includes("pay back")) {
            return {
                text: "To settle up in Equalify:\n\n1. Go to your group page\n2. Click 'Settle Up'\n3. Select the person you're paying or who's paying you\n4. Enter the amount being settled\n5. Choose payment method (optional)\n6. Click 'Mark as Settled'\n\nWould you like me to show you your current balances?",
                actionType: "navigation",
                actionPath: "/balances"
            };
        }
        
        // General info queries
        if (messageLower.includes("what is equalify") || messageLower.includes("about equalify")) {
            return {
                text: "Equalify is an expense-sharing application that helps you track and split expenses with friends, roommates, or anyone else. It allows you to create groups, add expenses, split costs in various ways, and keep track of who owes whom. It simplifies the process of managing shared finances!",
                actionType: "info"
            };
        }
        
        // Feature explanations
        if (messageLower.includes("features") || messageLower.includes("what can equalify do")) {
            return {
                text: "Equalify offers several helpful features:\n\n• Create multiple expense groups\n• Split expenses equally or with custom amounts\n• Track who paid what and who owes whom\n• Settle up debts within the app\n• Generate expense reports\n• Set recurring expenses\n• Take photos of receipts\n• Multi-currency support\n\nWhich feature would you like to know more about?",
                actionType: "info"
            };
        }
        
        // Return null if no local match found
        return null;
    };

    const handleActionClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            const userMessage = input.trim();
            setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
            setInput("");
            setIsLoading(true);
            setIsError(false);
    
            // Check for local response
            const localResponse = getLocalResponse(userMessage);
            if (localResponse) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { 
                        text: localResponse.text, 
                        sender: "bot",
                        actionType: localResponse.actionType,
                        actionPath: localResponse.actionPath
                    }]);
                    setIsLoading(false);
                }, 800);
            } else {
                // Call server API which will handle the Gemini API request
                try {
                    const response = await axios.post(`${API_URL}/api/chat`, {
                        message: userMessage
                    });
    
                    setMessages(prev => [...prev, { 
                        text: response.data.reply, 
                        sender: "bot" 
                    }]);
                } catch (error) {
                    console.error("API error:", error);
                    setIsError(true);
                    setMessages(prev => [...prev, { 
                        text: "Sorry, I'm having trouble connecting to the AI. Please try again later.", 
                        sender: "bot",
                        isError: true
                    }]);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };
    

    const handleClearChat = () => {
        setMessages([
            { text: "Hi! I'm EquiBot. How can I help you with Equalify today?", sender: "bot" }
        ]);
    };

    // Suggested questions to get started
    const suggestions = [
        "What is Equalify?",
        "How do I split expenses?",
        "How do I create a group?",
        "How do I settle up?"
    ];

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        // Optional: Auto-send the suggestion
        // setMessages(prev => [...prev, { text: suggestion, sender: "user" }]);
        // handleSend({ preventDefault: () => {} });
    };

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {!isOpen ? (
                <div className="flex flex-col items-end">
                    <div className="bg-white p-2 rounded-lg shadow-md mb-2 animate-bounce">
                        <p className="text-sm font-medium">Need help with Equalify?</p>
                    </div>
                    <img
                        src={equiBotLogo}
                        alt="EquiBot Logo"
                        className="w-16 h-16 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all"
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            ) : (
                <Card className="w-80 h-96 shadow-lg flex flex-col relative">
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                            <div className="flex items-center">
                                <img src={equiBotLogo} alt="EquiBot Logo" className="w-6 h-6 rounded-full mr-2" />
                                <h2 className="text-lg font-semibold">EquiBot</h2>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="flex-1 bg-gray-50 p-3 rounded mb-3 overflow-y-auto max-h-64">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
                                    <div 
                                        className={`
                                            p-2 rounded-lg max-w-xs break-words
                                            ${msg.sender === "user" 
                                                ? "bg-blue-500 text-white" 
                                                : msg.isError 
                                                    ? "bg-red-100 text-red-800 border border-red-200" 
                                                    : "bg-gray-200 text-gray-800"
                                            }
                                        `}
                                    >
                                        {msg.text}
                                        {msg.actionType === "navigation" && (
                                            <div className="mt-2">
                                                <Button 
                                                    size="sm"
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs w-full"
                                                    onClick={() => handleActionClick(msg.actionPath)}
                                                >
                                                    Go there now
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-2">
                                    <div className="bg-gray-200 text-gray-800 p-2 rounded-lg">
                                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {messages.length === 1 && (
                            <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-1">Try asking:</p>
                                <div className="flex flex-wrap gap-1">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <form className="flex items-center" onSubmit={handleSend}>
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 mr-2"
                                disabled={isLoading}
                            />
                            <Button 
                                type="submit" 
                                disabled={isLoading || !input.trim()}
                                className={!input.trim() ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Send"
                                )}
                            </Button>
                        </form>
                        
                        <div className="flex justify-center mt-2">
                            <button 
                                className="text-xs text-gray-500 hover:text-gray-700" 
                                onClick={handleClearChat}
                            >
                                Clear Chat
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Chatbot;