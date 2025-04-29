
import React from 'react';
import { ChessPiece as ChessPieceType } from '../types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
  isDragging?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isDragging }) => {
  const { type, color } = piece;
  
  // Helper function to get the proper Unicode character for chess pieces
  const getPieceCharacter = () => {
    if (color === 'white') {
      switch (type) {
        case 'pawn': return '♙';
        case 'knight': return '♘';
        case 'bishop': return '♗';
        case 'rook': return '♖';
        case 'queen': return '♕';
        case 'king': return '♔';
        default: return '';
      }
    } else {
      switch (type) {
        case 'pawn': return '♟';
        case 'knight': return '♞';
        case 'bishop': return '♝';
        case 'rook': return '♜';
        case 'queen': return '♛';
        case 'king': return '♚';
        default: return '';
      }
    }
  };

  return (
    <div 
      className={`chess-piece ${isDragging ? 'dragging' : ''} select-none`}
      style={{ 
        color: color === 'white' ? 'white' : 'black',
        textShadow: color === 'white' ? '0 0 1px #000' : '0 0 1px #fff',
        fontSize: '2.5rem',
        userSelect: 'none',
      }}
    >
      {getPieceCharacter()}
    </div>
  );
};

export default ChessPiece;
