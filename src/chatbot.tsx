import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure this matches your .env file
const apiKey = env.GEMINIAPIKEY;

if (!apiKey) {
  throw new Error('API key not found in environment variables');
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey);

interface Message {
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (userInput: string) => {
    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Start a chat
      const chat = model.startChat({
        history: [
          ...messages.map(msg => ({
            role: msg.isBot ? "model" : "user",
            parts: [{ text: msg.text }],
          })),
          { role: "user", parts: [{ text: userInput }] },
        ],
      });

      // Send message and get response
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Generate and add bot response
    setIsLoading(true);
    try {
      const response = await generateResponse(input);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col h-full max-h-[500px]">
      {/* Chatbot header with icon */}
      <div className="flex items-center gap-2 mb-4">
        <img 
          src={env.PUBLIC_URL + '/images/sunlifeIcon.png'} 
          alt="Sunlife Icon" 
          className="w-8 h-8 rounded-full bg-gray-300" 
        />
        <h2 className="text-xl font-bold">SunBot</h2>
      </div>

      {/* Chat messages */}
      <div className="h-64 space-y-4 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.isBot ? 'bg-[#ffcb4d] mr-8' : 'bg-blue-200 ml-8'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-[#ffcb4d] mr-8">
            Thinking...
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
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