
// Chess piece types
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
  id: string;
}

// Position on the board (0-7 for both x and y)
export interface Position {
  x: number;
  y: number;
}

// Chess move
export interface ChessMove {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isPromotion?: boolean;
  promotionPiece?: PieceType;
  isCastle?: boolean;
  isEnPassant?: boolean;
}

// Board representation (8x8 grid)
export type ChessBoard = (ChessPiece | null)[][];

// Game state
export interface GameState {
  board: ChessBoard;
  currentTurn: PieceColor;
  moves: ChessMove[];
  status: GameStatus;
  check: {
    isCheck: boolean;
    color?: PieceColor;
    kingPosition?: Position;
  };
  selectedPiece: {
    piece: ChessPiece | null;
    position: Position | null;
  };
  possibleMoves: Position[];
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
}

export type GameStatus = 'waiting' | 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';

// Player information
export interface Player {
  id: string;
  name: string;
  color: PieceColor;
  isComputer?: boolean;
}

// Game information
export interface Game {
  id: string;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  state: GameState;
  timeControl?: {
    initialTime: number;
    increment: number;
    whiteTimeRemaining: number;
    blackTimeRemaining: number;
  };
  watchers?: string[];
}

// Room information for multiplayer
export interface GameRoom {
  id: string;
  name: string;
  game: Game;
  createdAt: number;
}
