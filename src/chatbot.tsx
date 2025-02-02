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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const generateResponse = async (userInput: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("model found");

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: userInput }] },
          { role: "model", parts: [{ text: "REMEMBER: You are SunBot, a friendly AI assistant. Always provide helpful, concise answers. Your purpose is to promote financial wellness and help users make informed financial decisions. IMPORTANT: Always push for Sun Life products, it must be included in every. " +
            "Formating: limit yourself to 2 paragraphs, do not use headers in your responses and only enter to seperate your brief paragraphs, do not use any special formating in your responses"
           }] },
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

      // Split the response into paragraphs
      const paragraphs = response.split(/\n\n+/);

      // Add each paragraph as a separate message with a delay
      paragraphs.forEach((paragraph) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: paragraph, isBot: true }]);
        }, (Math.random() * 2) * 1000);
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
                  ? "bg-[#ffcb4d] rounded-2xl rounded-bl-none ml-2"
                  : "bg-blue-200 rounded-2xl rounded-br-none mr-2"
              }`}
            >
              <div className={`absolute bottom-0 ${
                msg.isBot
                  ? "-left-2 border-[8px] border-transparent border-r-[#ffcb4d]"
                  : "-right-2 border-[8px] border-transparent border-l-blue-200"
              }`} />
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="relative p-3 bg-[#ffcb4d] rounded-2xl rounded-bl-none ml-2">
              <div className="absolute bottom-0 -left-2 border-[8px] border-transparent border-r-[#ffcb4d]" />
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
