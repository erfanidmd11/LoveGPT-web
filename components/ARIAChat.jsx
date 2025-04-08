// components/ARIAChat.jsx
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ARIAChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('ariaChat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ariaChat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = window.speechSynthesis.getVoices().find(voice => voice.name.includes('Female')) || null;
      utter.pitch = 1;
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/aria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const ariaReply = { role: 'aria', content: data.reply };
      setMessages((prev) => [...prev, ariaReply]);
      speak(data.reply);
    } catch (err) {
      const fallback = 'Something went wrong. Please try again later.';
      setMessages((prev) => [...prev, { role: 'aria', content: fallback }]);
      speak(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 mt-12">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Image src="/aria-avatar.png" alt="ARIA" width={32} height={32} className="rounded-full" />
        Chat with ARIA 💬
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-pink-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-4 py-2 text-sm whitespace-pre-line max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto bg-pink-100 text-right' : 'bg-purple-100 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-500">ARIA is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask ARIA anything..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
