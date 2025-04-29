
import React from 'react';
import { ChessPiece } from '../types/chess';
import ChessPieceComponent from './ChessPiece';

interface CapturedPiecesProps {
  pieces: ChessPiece[];
  color: 'white' | 'black';
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  // Group pieces by type for better display
  const groupedPieces: Record<string, ChessPiece[]> = {};
  
  pieces.forEach(piece => {
    if (!groupedPieces[piece.type]) {
      groupedPieces[piece.type] = [];
    }
    groupedPieces[piece.type].push(piece);
  });

  // Calculate material advantage in terms of "points"
  const calculateValue = (piece: ChessPiece) => {
    switch (piece.type) {
      case 'pawn': return 1;
      case 'knight': return 3;
      case 'bishop': return 3;
      case 'rook': return 5;
      case 'queen': return 9;
      default: return 0;
    }
  };

  const totalValue = pieces.reduce((total, piece) => total + calculateValue(piece), 0);

  return (
    <div className={`flex flex-wrap items-center gap-1 p-2 rounded ${color === 'white' ? 'bg-gray-100' : 'bg-gray-200'}`}>
      {Object.entries(groupedPieces).map(([type, piecesOfType]) => (
        <div key={type} className="flex items-center">
          {piecesOfType.map((piece, i) => (
            <div key={piece.id} className="transform scale-50" style={{ marginLeft: i > 0 ? '-1.5rem' : '0' }}>
              <ChessPieceComponent piece={piece} />
            </div>
          ))}
        </div>
      ))}
      {totalValue > 0 && (
        <div className="ml-2 text-sm font-semibold">{totalValue}</div>
      )}
    </div>
  );
};

export default CapturedPieces;
