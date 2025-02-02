import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI("---");

interface Message {
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for chat container

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("model found");

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: userInput }] },
          { role: "model", parts: [{ text: "You are SunBot, a friendly AI assistant. Always provide helpful, concise answers." }] },
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
      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Smooth auto-scroll to the bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Enables slow, smooth scrolling
      });
    }
  }, [messages]);

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

      {/* Chat messages container */}
      <div
        ref={chatContainerRef}
        className="h-64 space-y-4 overflow-y-auto mb-4"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.isBot ? "bg-[#ffcb4d] mr-8" : "bg-blue-200 ml-8"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-[#ffcb4d] mr-8">Thinking...</div>
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
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
