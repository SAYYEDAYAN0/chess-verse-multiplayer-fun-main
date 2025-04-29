
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameControlsProps {
  onNewGame: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onUndoMove?: () => void;
  gameStatus: 'waiting' | 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onResign,
  onOfferDraw,
  onUndoMove,
  gameStatus
}) => {
  const gameOver = ['checkmate', 'stalemate', 'draw'].includes(gameStatus);
  
  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="default" 
        onClick={onNewGame}
      >
        New Game
      </Button>
      
      {gameStatus === 'active' || gameStatus === 'check' ? (
        <>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onResign}
            >
              Resign
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onOfferDraw}
            >
              Offer Draw
            </Button>
          </div>
          
          {onUndoMove && (
            <Button 
              variant="ghost" 
              onClick={onUndoMove}
            >
              Undo Move
            </Button>
          )}
        </>
      ) : gameOver ? (
        <div className="text-center p-2 font-medium">
          {gameStatus === 'checkmate' && 'Checkmate!'}
          {gameStatus === 'stalemate' && 'Stalemate'}
          {gameStatus === 'draw' && 'Draw'}
        </div>
      ) : (
        <div className="text-center p-2 text-gray-500">Waiting for players...</div>
      )}
    </div>
  );
};

export default GameControls;
