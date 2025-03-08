'use client';

import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ description: string; emoji: string }>>([]);

  const generateEmoji = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate emoji');
      }

      const data = await response.json();
      setEmoji(data.emoji);
      setHistory(prev => [...prev, { description, emoji: data.emoji }].slice(-5));
    } catch (err) {
      setError('Failed to generate emoji. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateEmoji();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Emoji Generator ✨
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 min-h-[120px] flex items-center justify-center">
              {loading ? (
                <ArrowPathIcon className="w-16 h-16 animate-spin text-blue-500" />
              ) : (
                <span className="animate-bounce">{emoji}</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your emoji (e.g., 'a happy cat playing with yarn')"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold
                       hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              {loading ? 'Generating...' : 'Generate Emoji'}
            </button>
          </form>
        </div>

        {history.length > 0 && (
          <div className="bg-white/50 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Recent Generations</h2>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <span className="text-gray-600">{item.description}</span>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-gray-600 text-sm mt-8">
          Enter a description and let AI find the perfect emoji for you!
        </p>
      </div>
    </main>
  );
}
