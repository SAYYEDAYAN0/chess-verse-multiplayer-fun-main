
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 to-indigo-100">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">Chess Verse</h1>
          <nav>
            <ul className="flex gap-6">
              <li><Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link></li>
              <li><Link to="/game" className="text-gray-700 hover:text-purple-600">Play</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                Experience the Ultimate <span className="text-purple-600">Chess Experience</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Play chess against friends or challenge the computer. Improve your skills and have fun with Chess Verse.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="text-lg">
                  <Link to="/game">Play Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 relative">
                <div className="chess-board shadow-xl">
                  {Array(64).fill(null).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 !== 0;
                    return (
                      <div key={i} className={`chess-square ${isLight ? 'bg-chess-light-square' : 'bg-chess-dark-square'}`}></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-700">Play vs Computer</h3>
              <p className="text-gray-700">
                Challenge our AI opponent at different difficulty levels to improve your skills
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-700">Multiplayer Games</h3>
              <p className="text-gray-700">
                Play with friends online in real-time multiplayer chess matches
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-purple-700">Game Analysis</h3>
              <p className="text-gray-700">
                Review your games with move history and learn from your mistakes
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p>© 2025 Chess Verse. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-300">Terms</a>
              <a href="#" className="hover:text-purple-300">Privacy</a>
              <a href="#" className="hover:text-purple-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
