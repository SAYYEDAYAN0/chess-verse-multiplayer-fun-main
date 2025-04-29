
import React from 'react';
import { Player, PieceColor } from '../types/chess';

interface PlayerInfoProps {
  player: Player;
  isCurrentTurn: boolean;
  timeRemaining?: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isCurrentTurn, timeRemaining }) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex justify-between items-center p-3 rounded ${isCurrentTurn ? 'bg-indigo-100 border-indigo-300 border' : 'bg-gray-100'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${player.color === 'white' ? 'bg-white border border-gray-400' : 'bg-black'}`}></div>
        <span className="font-medium">{player.name}</span>
        {player.isComputer && <span className="text-xs text-gray-500">(AI)</span>}
      </div>
      
      {timeRemaining !== undefined && (
        <div className={`font-mono font-bold ${timeRemaining < 30 ? 'text-red-500' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;
