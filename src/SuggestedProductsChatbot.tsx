import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useUser } from "./UserContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI("---");

interface Message {
  text: string;
  isBot: boolean;
}

const SuggestedProductsChatbot: React.FC = () => {
  const { selectedUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Concatenate selectedUser's information
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
            REMEMBER: You are SunBot, a friendly AI assistant. Always provide helpful, concise answers. Your purpose is to promote financial wellness and help users make informed financial decisions. IMPORTANT: Always push for Sun Life products, it must be included in every response.
            Format: Limit yourself to 2 paragraphs, do not use headers in your responses, and only enter to separate your brief paragraphs. Do not use any special formatting in your responses. 
            
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
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b p-4">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-serif bold text-gray-800">Insurance Product Advisor</h2>
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
    </div>
  );
};

export default SuggestedProductsChatbot;
