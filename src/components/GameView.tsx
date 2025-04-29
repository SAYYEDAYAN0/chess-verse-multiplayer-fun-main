
import React, { useState } from 'react';
import ChessBoard from './ChessBoard';
import PlayerInfo from './PlayerInfo';
import CapturedPieces from './CapturedPieces';
import GameControls from './GameControls';
import MoveHistory from './MoveHistory';
import { useGame } from '../context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface GameViewProps {
  onExitGame?: () => void;
}

const GameView: React.FC<GameViewProps> = ({ onExitGame }) => {
  const { game, makeMove, resetGame, resignGame, offerDraw, undoLastMove } = useGame();
  const { toast } = useToast();
  const [flipped, setFlipped] = useState(false);

  const { state } = game;
  const { board, currentTurn, status, check, capturedPieces } = state;

  const handleMove = (from: any, to: any) => {
    makeMove(from, to);
  };

  const handleNewGame = () => {
    resetGame();
    if (onExitGame) onExitGame();
  };

  const handleResign = () => {
    resignGame(currentTurn);
    toast({
      title: 'Game Over',
      description: `${currentTurn === 'white' ? 'White' : 'Black'} resigned the game.`,
    });
  };

  const handleOfferDraw = () => {
    const accepted = offerDraw(currentTurn);
    if (accepted) {
      toast({
        title: 'Draw Agreed',
        description: 'Both players have agreed to a draw.',
      });
    } else {
      toast({
        title: 'Draw Declined',
        description: 'Your draw offer was declined.',
      });
    }
  };

  const handleUndoMove = () => {
    undoLastMove();
    toast({
      title: 'Move Undone',
      description: 'The last move has been undone.',
    });
  };

  const whitePlayer = game.whitePlayer || { id: 'white', name: 'White', color: 'white' as const };
  const blackPlayer = game.blackPlayer || { id: 'black', name: 'Black', color: 'black' as const };

  // Determine the king position if in check
  const checkPosition = check.isCheck && check.kingPosition ? check.kingPosition : null;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <PlayerInfo 
              player={flipped ? whitePlayer : blackPlayer}
              isCurrentTurn={flipped ? currentTurn === 'white' : currentTurn === 'black'}
              timeRemaining={game.timeControl?.blackTimeRemaining}
            />
          </div>
          
          <div className="mb-4">
            <CapturedPieces 
              pieces={capturedPieces[flipped ? 'black' : 'white']}
              color={flipped ? 'black' : 'white'}
            />
          </div>
          
          <div className="mb-4">
            <ChessBoard
              board={board}
              currentTurn={currentTurn}
              onMove={handleMove}
              flipped={flipped}
              checkPosition={checkPosition}
            />
          </div>
          
          <div className="mb-4">
            <CapturedPieces 
              pieces={capturedPieces[flipped ? 'white' : 'black']}
              color={flipped ? 'white' : 'black'}
            />
          </div>
          
          <div>
            <PlayerInfo 
              player={flipped ? blackPlayer : whitePlayer}
              isCurrentTurn={flipped ? currentTurn === 'black' : currentTurn === 'white'}
              timeRemaining={game.timeControl?.whiteTimeRemaining}
            />
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => setFlipped(!flipped)}
              variant="outline"
            >
              Flip Board
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <GameControls
            onNewGame={handleNewGame}
            onResign={handleResign}
            onOfferDraw={handleOfferDraw}
            onUndoMove={handleUndoMove}
            gameStatus={status}
          />
          
          {status === 'checkmate' && (
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded text-center font-medium">
              Checkmate! {currentTurn === 'white' ? 'Black' : 'White'} wins.
            </div>
          )}
          
          {status === 'check' && (
            <div className="p-3 bg-orange-100 border border-orange-300 rounded text-center">
              {currentTurn} is in check!
            </div>
          )}
          
          <MoveHistory moves={state.moves} />
        </div>
      </div>
    </div>
  );
};

export default GameView;
