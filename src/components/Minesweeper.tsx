import React, { useState, useEffect, useCallback } from 'react';
import { playClick, playAlert, playChord } from '../sound';

interface MinesweeperProps {
  onClose: () => void;
}

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
};

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export const Minesweeper: React.FC<MinesweeperProps> = ({ onClose }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(MINES);
  const [isPlaying, setIsPlaying] = useState(false);

  const initGame = useCallback(() => {
    // Generate empty board
    const newGrid: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    // Place mines
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Count neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setHasWon(false);
    setFlagsLeft(MINES);
    setTimer(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !gameOver && !hasWon) {
      interval = setInterval(() => {
        setTimer((t) => Math.min(t + 1, 999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, hasWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || hasWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (!isPlaying) setIsPlaying(true);
    playClick();

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Hit a mine
      playAlert();
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) cell.isRevealed = true;
        })
      );
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Flood fill algorithm
    const reveal = (row: number, col: number) => {
      if (
        row < 0 ||
        row >= ROWS ||
        col < 0 ||
        col >= COLS ||
        newGrid[row][col].isRevealed ||
        newGrid[row][col].isFlagged
      ) {
        return;
      }

      newGrid[row][col].isRevealed = true;

      if (newGrid[row][col].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);

    // Check win condition
    let unrevealedSafe = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newGrid[row][col].isMine && !newGrid[row][col].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      setHasWon(true);
      playChord();
    }

    setGrid(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || hasWon || grid[r][c].isRevealed) return;
    playClick();

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const current = newGrid[r][c].isFlagged;

    if (!current && flagsLeft <= 0) return;

    newGrid[r][c].isFlagged = !current;
    setFlagsLeft((prev) => (current ? prev + 1 : prev - 1));
    setGrid(newGrid);
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1:
        return 'text-blue-700 font-bold';
      case 2:
        return 'text-green-700 font-bold';
      case 3:
        return 'text-red-700 font-bold';
      case 4:
        return 'text-purple-900 font-bold';
      case 5:
        return 'text-amber-900 font-bold';
      case 6:
        return 'text-teal-700 font-bold';
      default:
        return 'text-black font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset p-1 max-w-sm shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">bomb</span>
            <span>Minesweeper</span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
          >
            ✕
          </button>
        </div>

        {/* Menu Bar */}
        <div className="bg-[#c0c0c0] px-2 py-0.5 text-xs border-b border-[#808080] flex gap-3 text-black">
          <span className="cursor-pointer hover:underline" onClick={initGame}>
            Game
          </span>
          <span className="cursor-pointer hover:underline" onClick={() => alert('Windows 98 Classic Minesweeper')}>
            Help
          </span>
        </div>

        <div className="p-2.5 bg-[#c0c0c0] flex flex-col items-center">
          {/* Top Panel with Counters & Smiley Face */}
          <div className="win-inset-gray w-full p-2 mb-2 flex items-center justify-between border-2 border-gray-400">
            {/* Mines Left Counter */}
            <div className="bg-black text-red-600 font-mono text-xl px-2 py-0.5 border border-gray-600 tracking-widest font-bold">
              {String(Math.max(0, flagsLeft)).padStart(3, '0')}
            </div>

            {/* Reset Smiley Button */}
            <button
              onClick={() => {
                playClick();
                initGame();
              }}
              className="win-btn w-8 h-8 flex items-center justify-center text-lg shadow-md"
            >
              {gameOver ? '😵' : hasWon ? '😎' : '🙂'}
            </button>

            {/* Timer Counter */}
            <div className="bg-black text-red-600 font-mono text-xl px-2 py-0.5 border border-gray-600 tracking-widest font-bold">
              {String(timer).padStart(3, '0')}
            </div>
          </div>

          {/* Minefield Grid */}
          <div className="win-inset bg-[#bdbdbd] p-1 grid grid-cols-9 gap-[1px] select-none border-2 border-gray-600">
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold leading-none ${
                    cell.isRevealed
                      ? 'border border-gray-400 bg-[#c0c0c0]'
                      : 'win-btn bg-[#c0c0c0]'
                  }`}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborCount > 0 ? (
                      <span className={getNumberColor(cell.neighborCount)}>
                        {cell.neighborCount}
                      </span>
                    ) : (
                      ''
                    )
                  ) : cell.isFlagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
