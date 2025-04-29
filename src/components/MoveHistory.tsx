
import React from 'react';
import { ChessMove } from '../types/chess';
import { getAlgebraicNotation } from '../utils/chessUtils';

interface MoveHistoryProps {
  moves: ChessMove[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Format move in short algebraic notation
  const formatMove = (move: ChessMove) => {
    const from = getAlgebraicNotation(move.from);
    const to = getAlgebraicNotation(move.to);
    const piece = move.piece;
    
    let notation = '';
    
    // Add piece letter for non-pawns
    if (piece.type !== 'pawn') {
      notation += piece.type.charAt(0).toUpperCase();
    }
    
    // Add capture symbol
    if (move.capturedPiece) {
      if (piece.type === 'pawn') {
        notation += from.charAt(0);
      }
      notation += 'x';
    }
    
    notation += to;
    
    // Add promotion piece
    if (move.isPromotion && move.promotionPiece) {
      notation += '=' + move.promotionPiece.charAt(0).toUpperCase();
    }
    
    // Could add check/checkmate symbols here
    
    return notation;
  };

  // Group moves by pair (white and black)
  const groupedMoves: [ChessMove, ChessMove | null][] = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push([
      moves[i],
      i + 1 < moves.length ? moves[i + 1] : null
    ]);
  }
  
  return (
    <div className="rounded shadow bg-white overflow-hidden">
      <h3 className="bg-gray-100 p-2 font-medium border-b">Move History</h3>
      <div className="p-2 max-h-64 overflow-y-auto">
        {groupedMoves.length === 0 ? (
          <div className="text-center text-gray-500 p-2">No moves yet</div>
        ) : (
          <table className="w-full">
            <tbody>
              {groupedMoves.map((movePair, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-1 text-gray-500 text-sm w-8">{index + 1}.</td>
                  <td className="p-1 font-mono">{formatMove(movePair[0])}</td>
                  <td className="p-1 font-mono">
                    {movePair[1] ? formatMove(movePair[1]) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
