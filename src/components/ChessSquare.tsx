
import React from 'react';
import { Position } from '../types/chess';
import ChessPiece from './ChessPiece';
import { ChessPiece as ChessPieceType } from '../types/chess';

interface ChessSquareProps {
  position: Position;
  piece: ChessPieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isCheck: boolean;
  onSquareClick: (position: Position) => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isPossibleMove,
  isCheck,
  onSquareClick,
}) => {
  const getSquareColor = () => {
    if (isSelected) return 'bg-chess-selected';
    if (isCheck) return 'bg-chess-check';
    if (isPossibleMove) return isLight ? 'bg-chess-light-square bg-chess-possible-move' : 'bg-chess-dark-square bg-chess-possible-move';
    return isLight ? 'bg-chess-light-square' : 'bg-chess-dark-square';
  };

  // Get algebraic notation (e.g., "a1", "h8")
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const file = files[position.x];
  const rank = ranks[position.y];
  
  // Only show notation for border squares
  const showFileNotation = position.y === 7;
  const showRankNotation = position.x === 0;

  const handleClick = () => {
    onSquareClick(position);
  };

  return (
    <div 
      className={`chess-square ${getSquareColor()} hover:opacity-90`}
      onClick={handleClick}
    >
      {piece && <ChessPiece piece={piece} />}
      
      {isPossibleMove && !piece && (
        <div className="absolute w-3 h-3 rounded-full bg-chess-possible-move opacity-70"></div>
      )}
      
      {showRankNotation && (
        <div className={`chess-notation-rank ${isLight ? 'text-chess-dark-square' : 'text-chess-light-square'}`}>
          {rank}
        </div>
      )}
      
      {showFileNotation && (
        <div className={`chess-notation-file ${isLight ? 'text-chess-dark-square' : 'text-chess-light-square'}`}>
          {file}
        </div>
      )}
    </div>
  );
};

export default ChessSquare;
