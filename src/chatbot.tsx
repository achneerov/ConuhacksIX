// Add type declarations at the top of the file
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "./UserContext";
import { Volume2, Mic, VolumeX } from "lucide-react";

// Initialize Gemini
const genAI = new GoogleGenerativeAI("---");

// Initialize speech recognition with proper type handling
const createSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      return recognition;
    }
  }
  return null;
};

const recognition = createSpeechRecognition();

interface Message {
  text: string;
  isBot: boolean;
  isReading?: boolean;
}

const Chatbot: React.FC = () => {
  const { selectedUser } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;

  const speak = (text: string, messageIndex: number) => {
    if (!isTTSEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === messageIndex ? { ...msg, isReading: true } : msg
        )
      );
    };

    utterance.onend = () => {
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === messageIndex ? { ...msg, isReading: false } : msg
        )
      );
    };

    speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    if (!isTTSEnabled) {
      speechSynthesis.cancel();
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    setIsListening(true);
    try {
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  // Set up speech recognition handlers
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      stopListening();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, []);

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
      
      paragraphs.forEach((paragraph, index) => {
        setTimeout(() => {
          setMessages((prev) => {
            const newMessages = [...prev, { text: paragraph, isBot: true }];
            if (index === 0 && isTTSEnabled) {
              // Read first paragraph automatically if TTS is enabled
              setTimeout(() => speak(paragraph, newMessages.length - 1), 100);
            }
            return newMessages;
          });
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
    setMessages([{ text: "Hello! How can I help you today?", isBot: true }]);
    speechSynthesis.cancel();
  }, [selectedUser]);

  // Cleanup speech recognition and synthesis when component unmounts
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img
            src="./images/sunlifeIcon.png"
            alt=":("
            className="w-8 h-8 rounded-full bg-gray-300"
          />
          <h2 className="text-xl font-serif bold">SunBot</h2>
        </div>
        <button
          onClick={toggleTTS}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title={isTTSEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
        >
          {isTTSEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </button>
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
              {msg.isBot && isTTSEnabled && (
                <button
                  className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => speak(msg.text, idx)}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
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
        <div className="flex-grow flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 rounded border"
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-100 hover:bg-red-200' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            disabled={isLoading}
          >
            <Mic className={`h-5 w-5 ${isListening ? 'text-red-500' : ''}`} />
          </button>
        </div>
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