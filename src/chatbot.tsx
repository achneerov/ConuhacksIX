import React, { useState } from 'react';

interface Message {
  text: string;
  isBot: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, isBot: false }]);
    setInput("");
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Chatbot</h2>
      <div className="flex-grow space-y-4 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-lg ${msg.isBot ? 'bg-blue-200 mr-8' : 'bg-green-200 ml-8'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          className="flex-grow p-2 rounded border"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;