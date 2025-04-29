
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Game, 
  GameState, 
  ChessBoard, 
  ChessMove, 
  PieceColor, 
  Position,
  Player 
} from '../types/chess';
import { 
  createNewBoard, 
  movePiece, 
  isKingInCheck, 
  findKingPosition,
  isGameOver,
  cloneBoard
} from '../utils/chessUtils';
import { v4 as uuidv4 } from 'uuid';

interface GameContextType {
  game: Game;
  createNewGame: (whitePlayer: Player, blackPlayer: Player) => void;
  makeMove: (from: Position, to: Position) => void;
  resetGame: () => void;
  resignGame: (color: PieceColor) => void;
  offerDraw: (color: PieceColor) => boolean;
  undoLastMove: () => void;
}

const initialGameState: GameState = {
  board: createNewBoard(),
  currentTurn: 'white',
  moves: [],
  status: 'waiting',
  check: { isCheck: false },
  selectedPiece: { piece: null, position: null },
  possibleMoves: [],
  capturedPieces: { white: [], black: [] }
};

const createEmptyGame = (): Game => ({
  id: uuidv4(),
  whitePlayer: null,
  blackPlayer: null,
  state: initialGameState
});

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [game, setGame] = useState<Game>(createEmptyGame());

  const updateGameState = (newState: Partial<GameState>) => {
    setGame(current => ({
      ...current,
      state: {
        ...current.state,
        ...newState
      }
    }));
  };

  // Create a new game with the given players
  const createNewGame = (whitePlayer: Player, blackPlayer: Player) => {
    setGame({
      id: uuidv4(),
      whitePlayer,
      blackPlayer,
      state: {
        ...initialGameState,
        status: 'active'
      }
    });
  };

  // Make a move on the board
  const makeMove = (from: Position, to: Position) => {
    const { board, currentTurn, moves, capturedPieces } = game.state;
    
    // Get the piece at the "from" position
    const piece = board[from.y][from.x];
    if (!piece || piece.color !== currentTurn) return;
    
    // Check if the destination has a piece (capture)
    const capturedPiece = board[to.y][to.x];
    
    // Create a new board with the piece moved
    const newBoard = movePiece(board, from, to);
    
    // Record the move
    const move: ChessMove = {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined
    };
    
    // Update captured pieces
    const newCapturedPieces = { ...capturedPieces };
    if (capturedPiece) {
      const captureColor = currentTurn === 'white' ? 'white' : 'black';
      newCapturedPieces[captureColor] = [...newCapturedPieces[captureColor], capturedPiece];
    }
    
    // Check if the opponent is now in check
    const nextTurn = currentTurn === 'white' ? 'black' : 'white';
    const isCheck = isKingInCheck(newBoard, nextTurn);
    const kingPosition = isCheck ? findKingPosition(newBoard, nextTurn) : null;
    
    // Check if the game is over (checkmate or stalemate)
    const gameOverStatus = isGameOver(newBoard, nextTurn);
    
    let status = game.state.status;
    if (gameOverStatus.isOver) {
      status = gameOverStatus.reason === 'checkmate' ? 'checkmate' : 'stalemate';
    } else if (isCheck) {
      status = 'check';
    } else {
      status = 'active';
    }
    
    // Update the game state
    updateGameState({
      board: newBoard,
      currentTurn: nextTurn,
      moves: [...moves, move],
      status,
      check: {
        isCheck,
        color: isCheck ? nextTurn : undefined,
        kingPosition: kingPosition || undefined
      },
      capturedPieces: newCapturedPieces
    });
  };

  // Reset the game to initial state
  const resetGame = () => {
    updateGameState(initialGameState);
  };

  // Resign the game
  const resignGame = (color: PieceColor) => {
    updateGameState({
      status: 'checkmate',
    });
  };

  // Offer a draw
  const offerDraw = (color: PieceColor): boolean => {
    // In a real app, you'd wait for the other player to accept
    // For now, we'll just automatically accept/decline
    const acceptDraw = Math.random() > 0.5;
    
    if (acceptDraw) {
      updateGameState({
        status: 'draw',
      });
    }
    
    return acceptDraw;
  };
  
  // Undo the last move (if any)
  const undoLastMove = () => {
    const { moves } = game.state;
    if (moves.length === 0) return;
    
    // Remove the last move
    const newMoves = [...moves];
    newMoves.pop();
    
    // Rebuild the board from scratch by replaying all moves
    const newBoard = createNewBoard();
    
    // Replay all moves except the last one
    for (const move of newMoves) {
      movePiece(newBoard, move.from, move.to, false);
    }
    
    // Update captured pieces
    const newCapturedPieces = {
      white: [],
      black: []
    };
    
    for (const move of newMoves) {
      if (move.capturedPiece) {
        const captureColor = move.piece.color;
        newCapturedPieces[captureColor].push(move.capturedPiece);
      }
    }
    
    // Determine the current turn
    const currentTurn = newMoves.length % 2 === 0 ? 'white' : 'black';
    
    // Check if the current player is in check
    const isCheck = isKingInCheck(newBoard, currentTurn);
    const kingPosition = isCheck ? findKingPosition(newBoard, currentTurn) : null;
    
    updateGameState({
      board: newBoard,
      currentTurn,
      moves: newMoves,
      status: isCheck ? 'check' : 'active',
      check: {
        isCheck,
        color: isCheck ? currentTurn : undefined,
        kingPosition: kingPosition || undefined
      },
      capturedPieces: newCapturedPieces
    });
  };

  const value = {
    game,
    createNewGame,
    makeMove,
    resetGame,
    resignGame,
    offerDraw,
    undoLastMove
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
