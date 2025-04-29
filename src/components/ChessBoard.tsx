
import React, { useState } from 'react';
import ChessSquare from './ChessSquare';
import { ChessBoard as ChessBoardType, ChessPiece, Position, PieceColor } from '../types/chess';
import { getPossibleMoves, movePiece, isKingInCheck, findKingPosition } from '../utils/chessUtils';

interface ChessBoardProps {
  board: ChessBoardType;
  currentTurn: PieceColor;
  onMove: (from: Position, to: Position) => void;
  flipped?: boolean;
  checkPosition?: Position | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  currentTurn,
  onMove,
  flipped = false,
  checkPosition = null,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);

  const handleSquareClick = (position: Position) => {
    const piece = board[position.y][position.x];
    
    // If clicking on a piece of the current player's color
    if (piece && piece.color === currentTurn && (!selectedPosition || 
        selectedPosition.x !== position.x || selectedPosition.y !== position.y)) {
      setSelectedPosition(position);
      setPossibleMoves(getPossibleMoves(board, position));
      return;
    }
    
    // If a piece is already selected and clicking on a valid move
    if (selectedPosition) {
      const isValidMove = possibleMoves.some(
        move => move.x === position.x && move.y === position.y
      );
      
      if (isValidMove) {
        onMove(selectedPosition, position);
        setSelectedPosition(null);
        setPossibleMoves([]);
        return;
      }
    }
    
    // Deselect if clicking elsewhere
    setSelectedPosition(null);
    setPossibleMoves([]);
  };

  // Generate the full board with all squares
  const renderBoard = () => {
    const squares = [];
    
    // Loop through rows and columns
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Adjust coordinates if the board is flipped
        const displayY = flipped ? 7 - y : y;
        const displayX = flipped ? 7 - x : x;
        
        const position: Position = { x: displayX, y: displayY };
        const piece = board[displayY][displayX];
        const isLight = (displayX + displayY) % 2 !== 0;
        
        const isSelected = selectedPosition
          ? selectedPosition.x === displayX && selectedPosition.y === displayY
          : false;
        
        const isPossibleMove = possibleMoves.some(
          move => move.x === displayX && move.y === displayY
        );
        
        const isCheck = checkPosition
          ? checkPosition.x === displayX && checkPosition.y === displayY
          : false;
        
        squares.push(
          <ChessSquare
            key={`${displayX}-${displayY}`}
            position={position}
            piece={piece}
            isLight={isLight}
            isSelected={isSelected}
            isPossibleMove={isPossibleMove}
            isCheck={isCheck}
            onSquareClick={handleSquareClick}
          />
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="chess-board border border-gray-400 rounded shadow-lg">
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;
