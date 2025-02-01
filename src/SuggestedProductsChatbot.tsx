import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const SuggestedProductsChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I can help you find the right insurance products. What are your main concerns?',
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { type: 'user', content: userInput },
    ];

    // Simulate bot response based on keywords
    const response = getBotResponse(userInput.toLowerCase());
    newMessages.push({ type: 'bot', content: response });

    setMessages(newMessages);
    setUserInput('');
  };

  const getBotResponse = (input: string) => {
    if (input.includes('family') || input.includes('children')) {
      return 'For family protection, I recommend looking at our Life Insurance and Critical Illness coverage. Would you like to learn more about these options?';
    } else if (input.includes('retirement') || input.includes('savings')) {
      return 'For retirement planning, we offer various investment products and pension plans. Our Guaranteed Investment Funds are particularly popular. Would you like more details?';
    } else if (input.includes('health') || input.includes('medical')) {
      return 'We have comprehensive health insurance plans that cover medical expenses, dental care, and prescription drugs. Shall I explain the coverage options?';
    } else {
      return 'Could you tell me more about your specific needs? For example, are you looking for family protection, retirement planning, or health coverage?';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b p-4">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              Insurance Product Advisor
            </h2>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
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