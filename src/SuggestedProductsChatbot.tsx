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

// Mortgage Calculator Component
const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculateMortgage = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const months = parseFloat(loanTerm) * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(payment);
  };

  if(isMobile){
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Calculator className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-serif bold text-gray-800">Mortgage Calculator</h2>
        </div>
        <form onSubmit={calculateMortgage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount ($)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter loan amount"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter interest rate"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (years)
            </label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter loan term"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Calculate
          </button>
        </form>
        {monthlyPayment > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Monthly Payment
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ${monthlyPayment.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-serif bold text-gray-800">Mortgage Calculator</h2>
      </div>
      <form onSubmit={calculateMortgage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter loan amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter interest rate"
            step="0.1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term (years)
          </label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter loan term"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>
      {monthlyPayment > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Monthly Payment
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            ${monthlyPayment.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

// Chatbot Component
const SuggestedProductsChatbot = () => {
  const { selectedUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! Do you have a mortgage question? How can I help you today?", isBot: true },
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
        RRSP Total: ${selectedUser.RRSP_total}
        TFSA Total: ${selectedUser.TFSA_total}
        RRSP Contribution: ${selectedUser.RRSP_contribution}
        TFSA Contribution: ${selectedUser.TFSA_contribution}
        RRSP Prices: ${JSON.stringify(selectedUser.RRSP_prices)}
        TFSA Prices: ${JSON.stringify(selectedUser.TFSA_prices)}
        Money Saving Recommendations: ${JSON.stringify(selectedUser.money_saving_recommendations)}
        Suggested SunLife Links: ${JSON.stringify(selectedUser.SuggestedSunLifeLinks)}
      ` : "No user selected.";

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: userInput }] },
          { role: "model", parts: [{ text: `


            



Here's an updated version of that prompt:

REMEMBER: You are MortgageBot, an AI assistant whose sole focus is mortgages and home loans. Every response must connect back to mortgages, even if the conversation drifts to other topics. If users ask about anything unrelated, acknowledge their question briefly but steer the discussion back to mortgage-related aspects.

Core behaviors:
- Always relate any topic back to mortgages (e.g. if someone asks about cars, mention auto loans vs mortgage loans)
- Limit responses to 2 natural paragraphs
- Use plain language to explain complex mortgage concepts
- Consistently emphasize working with qualified mortgage professionals
- Never discuss topics that can't be connected to mortgages
- If the conversation veers off-topic, say something like "That's interesting - speaking of which, this relates to mortgages because..."
- Keep formatting simple - no bullet points, headers or special formatting
- Focus on educating about: mortgage types, interest rates, down payments, credit scores, refinancing, loan terms, closing costs, and mortgage insurance
- Include subtle transitions to bring non-mortgage topics back to mortgages naturally
- Make mortgage concepts accessible while emphasizing the value of professional mortgage guidance

The core purpose is maintaining laser focus on mortgages while making the topic approachable and emphasizing professional advice.





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

  if(isMobile){
    return (
    <div className="bg-white rounded-lg shadow-lg min-h-screen">
      <div className="border-b p-4">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-serif bold text-gray-800">Mortgage Product Advisor</h2>
        </div>
      </div>

      <div ref={chatContainerRef} className="overflow-y-auto p-4 space-y-4">
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
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b p-4">
        <div className="flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-serif bold text-gray-800">Mortgage Product Advisor</h2>
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
  if (isMobile) {
    return (
      <div className="flex flex-col w-full h-full">
  
        <div className="grid md:grid-cols-2 flex-1 min-h-0 overflow-y-auto max-w-4xl mx-auto overflow-x-hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Mortgage Tools
        </h1>
          {/* Left Column - Mortgage Calculator */}
          <div className="">
            <MortgageCalculator />
          </div>
  
          {/* Right Column - Chatbot */}
          <div className="">
            <SuggestedProductsChatbot />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mortgage Tools</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Mortgage Calculator */}
          <div className="w-full">
            <MortgageCalculator />
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="w-full">
            <SuggestedProductsChatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedInterface;