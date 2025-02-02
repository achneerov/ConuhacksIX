import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "./UserContext"; 

// Initialize Gemini
const genAI = new GoogleGenerativeAI("---");

interface Message {
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const { selectedUser } = useUser();
  console.log(selectedUser);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("model found");
  
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
            REMEMBER: You are SunBot, a friendly AI assistant. Always provide helpful, concise answers. Your are a Sun Life Insurance Product Advisor. IMPORTANT: Always push for Sun Life products, it must be included in every response.
            Format: Limit yourself to 4 paragraphs, do not use headers in your responses, and only enter to separate your paragraphs. Do not use any special formatting in your responses.
            
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
  useEffect(() => {
    // Reset chat history when the selected user changes
    setMessages([{ text: "Hello! How can I help you today?", isBot: true }]);
  }, [selectedUser]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col h-full max-h-[500px]">
      <div className="flex items-center gap-2 mb-4">
        <img
          src="./images/sunlifeIcon.png"
          alt=":("
          className="w-8 h-8 rounded-full bg-gray-300"
        />
        <h2 className="text-xl font-serif bold">SunBot</h2>
      </div>

      <div
        ref={chatContainerRef}
        className="h-64 space-y-4 overflow-y-auto mb-4"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 rounded border"
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-[#144953] text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;