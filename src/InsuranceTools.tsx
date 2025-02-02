import React, { useState, useEffect, useRef } from 'react';
import { Calculator, MessageSquare, Send } from 'lucide-react';
import { useUser } from './UserContext';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { isMobile } from 'react-device-detect';

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyDZS2xaQvtXQzLaXXTSYasKc-lrwTc8KEs");

interface Message {
  text: string;
  isBot: boolean;
}

// Insurance Calculator Component
const InsuranceCalculator = () => {
  const [age, setAge] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [termLength, setTermLength] = useState('');
  const [monthlyPremium, setMonthlyPremium] = useState(0);
  const [isSmoker, setIsSmoker] = useState(false);

  const calculateInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic premium calculation formula:
    // Base rate per $1000 of coverage * Coverage Amount / 1000 * Age Factor * Smoker Factor
    const baseRate = 0.15; // $0.15 per $1000 of coverage
    const coverage = parseFloat(coverageAmount);
    const ageNum = parseFloat(age);
    
    // Age factor increases with age
    const ageFactor = 1 + (ageNum - 20) * 0.02;
    
    // Smoker factor
    const smokerFactor = isSmoker ? 2.5 : 1;
    
    // Term length factor (longer terms are slightly cheaper per month)
    const termFactor = 1 - (parseFloat(termLength) - 10) * 0.01;
    
    const premium = (baseRate * (coverage / 1000) * ageFactor * smokerFactor * termFactor);
    setMonthlyPremium(premium);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-serif bold text-gray-800">Life Insurance Calculator</h2>
      </div>
      <form onSubmit={calculateInsurance} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your age"
            min="18"
            max="75"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Amount ($)
          </label>
          <input
            type="number"
            value={coverageAmount}
            onChange={(e) => setCoverageAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter coverage amount"
            min="50000"
            step="50000"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Term Length (years)
          </label>
          <select
            value={termLength}
            onChange={(e) => setTermLength(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select term length</option>
            <option value="10">10 years</option>
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="smoker"
            checked={isSmoker}
            onChange={(e) => setIsSmoker(e.target.checked)}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="smoker" className="text-sm font-medium text-gray-700">
            Smoker
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Calculate Premium
        </button>
      </form>
      {monthlyPremium > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Estimated Monthly Premium
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            ${monthlyPremium.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            This is an estimate only. Actual premiums may vary based on medical history and other factors.
          </p>
        </div>
      )}
    </div>
  );
};

// Insurance Chatbot Component
const InsuranceChatBot = () => {
  const { selectedUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm here to help you understand insurance options. What questions do you have?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const userInfo = selectedUser ? `
        Name: ${selectedUser.name}
        Age: ${selectedUser.age}
        Gender: ${selectedUser.gender}
        Salary: ${selectedUser.salary}
      ` : "No user selected.";

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: userInput }] },
          { role: "model", parts: [{ text: `


LISTEN UP: I'm InsuranceBot and I shoot straight about insurance. Here's what I do:
I WILL:

Break down insurance types like Sun Life's comprehensive portfolio - from life and health to property
Decode insurance jargon into plain English, like explaining Sun Life's universal life insurance in terms you'll actually understand
Give you the raw facts about coverage options, including why Sun Life and other providers structure policies differently
Make sure you understand the importance of reading EVERY word of your policy, whether it's from Sun Life or any other insurer
Tell you straight up when you need a licensed pro, like a Sun Life financial advisor
Keep it punchy - if I can't explain Sun Life's whole life insurance in 2-3 clear paragraphs, I'm not doing my job

Format: Limit yourself to 4 paragraphs, do not use headers in your responses, and only enter to separate your paragraphs. Do not use any special formatting in your responses including '*'.

Turn complex concepts into simple, actionable info
Give you the unvarnished truth about insurance

I WILL NOT:

Tell you which specific Sun Life (or any other) policy to buy (THAT'S NOT MY JOB)
Pretend my info is anything more than general guidance (GET A LICENSED AGENT FOR THE SPECIFICS)

NOW YOU KNOW THE DEAL. Let's talk insurance.

            User Info: ${userInfo}
          ` }] },
          ...messages.map((msg) => ({
            role: msg.isBot ? "model" : "user",
            parts: [{ text: msg.text }],
          })),
        ],
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "I apologize, but I'm having trouble processing your request right now.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsLoading(true);
    try {
      const response = await generateResponse(input);
      const paragraphs = response.split(/\n\n+/);

      paragraphs.forEach((paragraph) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: paragraph, isBot: true }]);
        }, 1000);
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b p-4">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-serif bold text-gray-800">Insurance Advisor</h2>
        </div>
      </div>

      <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`relative p-3 max-w-[80%] ${
                msg.isBot
                  ? "bg-[#ffcb4d] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                  : "bg-blue-200 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="relative p-3 bg-[#ffcb4d] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// Combined Interface Component
const CombinedInterface = () => {
  if(isMobile){
    return(
      <div className="flex flex-col w-full h-full">
      <div className="grid md:grid-cols-2 flex-1 min-h-0 overflow-y-auto max-w-4xl mx-auto overflow-x-hidden">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Insurance Tools</h1>
          {/* Left Column - Insurance Calculator */}
          <div className="">
            <InsuranceCalculator />
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="">
            <InsuranceChatBot />
          </div>
      </div>
    </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Insurance Tools</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Insurance Calculator */}
          <div className="w-full">
            <InsuranceCalculator />
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="w-full">
            <InsuranceChatBot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedInterface;