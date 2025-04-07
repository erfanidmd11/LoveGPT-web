// src/components/ARIAChat.jsx
import React, { useState } from 'react';
import Image from 'next/image';

export default function ARIAChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = { role: 'user', content: message };
    setChat([...chat, userMessage]);
    setMessage('');

    const res = await fetch('/api/aria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setChat(prev => [...prev, { role: 'aria', content: data.reply }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white border shadow-lg rounded-xl w-80 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/aria-avatar.png"
              alt="ARIA"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h2 className="text-sm font-semibold text-pink-500">ARIA</h2>
          </div>

          <div className="h-48 overflow-y-auto space-y-2 text-sm mb-2">
            {chat.map((msg, i) => (
              <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-pink-100 text-right' : 'bg-blue-100 text-left'}`}>
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask ARIA anything..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button onClick={handleSend} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">
              Send
            </button>
          </div>

          <button onClick={toggleChat} className="text-xs text-gray-400 mt-2 hover:underline">
            Close
          </button>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          💬 Talk to ARIA
        </button>
      )}
    </div>
  );
}
