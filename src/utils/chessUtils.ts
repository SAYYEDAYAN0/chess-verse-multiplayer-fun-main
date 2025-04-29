
import { ChessBoard, ChessPiece, PieceColor, PieceType, Position } from "../types/chess";
import { v4 as uuidv4 } from "uuid";

// Create a new chess board with pieces in their starting positions
export const createNewBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = createPiece("pawn", "black");
    board[6][i] = createPiece("pawn", "white");
  }

  // Place rooks
  board[0][0] = createPiece("rook", "black");
  board[0][7] = createPiece("rook", "black");
  board[7][0] = createPiece("rook", "white");
  board[7][7] = createPiece("rook", "white");

  // Place knights
  board[0][1] = createPiece("knight", "black");
  board[0][6] = createPiece("knight", "black");
  board[7][1] = createPiece("knight", "white");
  board[7][6] = createPiece("knight", "white");

  // Place bishops
  board[0][2] = createPiece("bishop", "black");
  board[0][5] = createPiece("bishop", "black");
  board[7][2] = createPiece("bishop", "white");
  board[7][5] = createPiece("bishop", "white");

  // Place queens
  board[0][3] = createPiece("queen", "black");
  board[7][3] = createPiece("queen", "white");

  // Place kings
  board[0][4] = createPiece("king", "black");
  board[7][4] = createPiece("king", "white");

  return board;
};

// Create a chess piece with the given type and color
export const createPiece = (type: PieceType, color: PieceColor): ChessPiece => {
  return {
    type,
    color,
    hasMoved: false,
    id: uuidv4(),
  };
};

// Get all possible moves for a piece at the given position
export const getPossibleMoves = (
  board: ChessBoard,
  position: Position,
  includeCastling = true,
  checkForCheck = true
): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  let moves: Position[] = [];

  switch (piece.type) {
    case "pawn":
      moves = getPawnMoves(board, position);
      break;
    case "knight":
      moves = getKnightMoves(board, position);
      break;
    case "bishop":
      moves = getBishopMoves(board, position);
      break;
    case "rook":
      moves = getRookMoves(board, position);
      break;
    case "queen":
      moves = getQueenMoves(board, position);
      break;
    case "king":
      moves = getKingMoves(board, position, includeCastling);
      break;
  }

  // Filter out moves that would put the king in check
  if (checkForCheck) {
    moves = moves.filter((move) => {
      const newBoard = movePiece(board, position, move, true);
      return !isKingInCheck(newBoard, piece.color);
    });
  }

  return moves;
};

// Check if a position is within the board boundaries
const isValidPosition = (position: Position): boolean => {
  return position.x >= 0 && position.x < 8 && position.y >= 0 && position.y < 8;
};

// Check if a position contains a piece of the opposite color
const isOpponentPiece = (
  board: ChessBoard,
  position: Position,
  color: PieceColor
): boolean => {
  const piece = board[position.y][position.x];
  return piece !== null && piece.color !== color;
};

// Check if a position is empty
const isEmpty = (board: ChessBoard, position: Position): boolean => {
  return board[position.y][position.x] === null;
};

// Get possible moves for a pawn
const getPawnMoves = (board: ChessBoard, position: Position): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece || piece.type !== "pawn") return [];

  const direction = piece.color === "white" ? -1 : 1;
  const moves: Position[] = [];

  // Forward move
  const forwardPos = { x: position.x, y: position.y + direction };
  if (isValidPosition(forwardPos) && isEmpty(board, forwardPos)) {
    moves.push(forwardPos);

    // Double forward move from starting position
    if (
      (piece.color === "white" && position.y === 6) ||
      (piece.color === "black" && position.y === 1)
    ) {
      const doubleForwardPos = {
        x: position.x,
        y: position.y + 2 * direction,
      };
      if (isEmpty(board, doubleForwardPos)) {
        moves.push(doubleForwardPos);
      }
    }
  }

  // Capture moves
  const capturePositions = [
    { x: position.x - 1, y: position.y + direction },
    { x: position.x + 1, y: position.y + direction },
  ];

  for (const capturePos of capturePositions) {
    if (
      isValidPosition(capturePos) &&
      isOpponentPiece(board, capturePos, piece.color)
    ) {
      moves.push(capturePos);
    }
  }

  // En passant (simplified implementation, needs more logic)
  // TODO: Implement en passant

  return moves;
};

// Get possible moves for a knight
const getKnightMoves = (board: ChessBoard, position: Position): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  const possibleOffsets = [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: 1, y: -2 },
    { x: -1, y: -2 },
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: 2 },
  ];

  return possibleOffsets
    .map((offset) => ({
      x: position.x + offset.x,
      y: position.y + offset.y,
    }))
    .filter(
      (pos) =>
        isValidPosition(pos) &&
        (isEmpty(board, pos) || isOpponentPiece(board, pos, piece.color))
    );
};

// Get possible moves for a bishop
const getBishopMoves = (board: ChessBoard, position: Position): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  const directions = [
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 1 },
  ];

  return getSlidingMoves(board, position, piece.color, directions);
};

// Get possible moves for a rook
const getRookMoves = (board: ChessBoard, position: Position): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  const directions = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];

  return getSlidingMoves(board, position, piece.color, directions);
};

// Get possible moves for a queen
const getQueenMoves = (board: ChessBoard, position: Position): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  const directions = [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
  ];

  return getSlidingMoves(board, position, piece.color, directions);
};

// Get possible moves for a king
const getKingMoves = (
  board: ChessBoard,
  position: Position,
  includeCastling: boolean
): Position[] => {
  const piece = board[position.y][position.x];
  if (!piece) return [];

  const directions = [
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
  ];

  const moves = directions
    .map((dir) => ({ x: position.x + dir.x, y: position.y + dir.y }))
    .filter(
      (pos) =>
        isValidPosition(pos) &&
        (isEmpty(board, pos) || isOpponentPiece(board, pos, piece.color))
    );

  // Castling (simplified implementation)
  if (includeCastling && !piece.hasMoved) {
    // TODO: Add proper castling logic
  }

  return moves;
};

// Helper function for sliding pieces (bishop, rook, queen)
const getSlidingMoves = (
  board: ChessBoard,
  position: Position,
  color: PieceColor,
  directions: { x: number; y: number }[]
): Position[] => {
  const moves: Position[] = [];

  for (const dir of directions) {
    let currentPos = { x: position.x + dir.x, y: position.y + dir.y };

    while (isValidPosition(currentPos)) {
      if (isEmpty(board, currentPos)) {
        moves.push({ ...currentPos });
      } else if (isOpponentPiece(board, currentPos, color)) {
        moves.push({ ...currentPos });
        break;
      } else {
        break;
      }

      currentPos = { x: currentPos.x + dir.x, y: currentPos.y + dir.y };
    }
  }

  return moves;
};

// Move a piece on the board and return the new board
export const movePiece = (
  board: ChessBoard,
  from: Position,
  to: Position,
  simulateMove = false
): ChessBoard => {
  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[from.y][from.x];

  if (!piece) return newBoard;

  // Special case for castling
  // TODO: Implement castling

  // Special case for en passant
  // TODO: Implement en passant

  // Regular move
  newBoard[to.y][to.x] = { ...piece, hasMoved: true };
  newBoard[from.y][from.x] = null;

  // Pawn promotion (auto-queen for simplicity)
  if (
    piece.type === "pawn" &&
    ((piece.color === "white" && to.y === 0) ||
      (piece.color === "black" && to.y === 7))
  ) {
    newBoard[to.y][to.x] = createPiece("queen", piece.color);
  }

  return newBoard;
};

// Find the king's position
export const findKingPosition = (
  board: ChessBoard,
  color: PieceColor
): Position | null => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.type === "king" && piece.color === color) {
        return { x, y };
      }
    }
  }
  return null;
};

// Check if the king of the given color is in check
export const isKingInCheck = (
  board: ChessBoard,
  color: PieceColor
): boolean => {
  const kingPosition = findKingPosition(board, color);
  if (!kingPosition) return false;

  // Check if any opponent piece can capture the king
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color !== color) {
        const moves = getPossibleMoves(board, { x, y }, false, false);
        if (
          moves.some(
            (move) => move.x === kingPosition.x && move.y === kingPosition.y
          )
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

// Check if the game is over (checkmate or stalemate)
export const isGameOver = (
  board: ChessBoard,
  currentPlayerColor: PieceColor
): { isOver: boolean; reason: "checkmate" | "stalemate" | null } => {
  // Check if the current player has any legal moves
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === currentPlayerColor) {
        const moves = getPossibleMoves(board, { x, y });
        if (moves.length > 0) {
          return { isOver: false, reason: null };
        }
      }
    }
  }

  // If the king is in check, it's checkmate. Otherwise, it's stalemate
  const isCheck = isKingInCheck(board, currentPlayerColor);
  return {
    isOver: true,
    reason: isCheck ? "checkmate" : "stalemate",
  };
};

// Get algebraic notation for a position (e.g., "e4")
export const getAlgebraicNotation = (position: Position): string => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  return files[position.x] + ranks[position.y];
};

// Get position from algebraic notation (e.g., "e4" -> {x: 4, y: 4})
export const getPositionFromNotation = (notation: string): Position => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  
  const file = notation[0].toLowerCase();
  const rank = notation[1];
  
  return {
    x: files.indexOf(file),
    y: ranks.indexOf(rank)
  };
};

// Deep clone a board
export const cloneBoard = (board: ChessBoard): ChessBoard => {
  return board.map(row => 
    row.map(piece => piece ? { ...piece } : null)
  );
};
