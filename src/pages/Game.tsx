
import React, { useState } from 'react';
import { GameProvider } from '../context/GameContext';
import GameView from '../components/GameView';
import LobbyView from '../components/LobbyView';

const Game: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-purple-700 mb-2">Chess Verse</h1>
            <p className="text-gray-600">Multiplayer Chess Experience</p>
          </header>
          
          {gameStarted ? (
            <GameView onExitGame={() => setGameStarted(false)} />
          ) : (
            <LobbyView onGameStart={() => setGameStarted(true)} />
          )}
        </div>
      </div>
    </GameProvider>
  );
};

export default Game;
