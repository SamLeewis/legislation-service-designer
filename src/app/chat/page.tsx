'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { processChatMessage, ChatMessage } from '@/services/chatAssistant';

const ChatPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !analysis) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const assistantMessage = processChatMessage(input, analysis);
    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const exampleQuestions = [
    'Welke dienstverlening volgt uit dit artikel?',
    'Welke vragen moeten we aan de burger stellen?',
    'Welke gegevens zijn juridisch noodzakelijk?',
    'Welke onderdelen kunnen digitaal afgehandeld worden?',
    'Waar is menselijke beoordeling nodig?',
    'Welke brief moeten we sturen?',
    'Welke onderdelen zijn geschikt voor DMN?',
  ];

  if (!analysis) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Geen actieve analyse.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <section className="py-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chat assistent</h2>
          <p className="text-gray-600">
            Stel vragen over de vertaling van regelgeving naar diensten.
          </p>
        </section>

        <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-gray-600 text-center">Geen berichten nog. Stel een vraag!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(q)}
                      className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded border border-gray-200 hover:border-primary transition"
                    >
                      <p className="text-sm text-gray-700 font-medium">{q}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Stel uw vraag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Verzend
              </button>
            </div>
          </form>
        </div>

        <div className="py-6">
          <p className="text-xs text-gray-500 text-center">
            Dit is een mock chat assistant. In productie kan dit worden verbonden met een LLM.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
