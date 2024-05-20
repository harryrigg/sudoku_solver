import { get } from 'svelte/store';

import { board, speed } from '$lib/stores';
import type { Board, CellState } from './types';

const sleep = () => new Promise((r) => setTimeout(r, 0));

let solveIterations: number;

export async function solveRecurse(preset: Array<number>, signal: AbortSignal) {
  solveIterations = 0;
  return await solve(preset, 0, signal);
}

async function solve(preset: Array<number>, offset: number, signal: AbortSignal): Promise<boolean> {
  solveIterations++;

  // Returns control to the event loop at a rate determined by the `speed` store.
  // Prevents the app from freezing during solving, and acts to slow down computation for visualization
  if (solveIterations % get(speed) == 0) await sleep();
  signal.throwIfAborted();

  if (offset < 80) {
    if (preset.includes(offset)) {
      // Can't change this value, move on to solving the remainder of the board
      return await solve(preset, offset + 1, signal);
    } else {
      // Try each value
      for (let val = 1; val < 10; val++) {
        board.set(offset, val as CellState);
        // If the board is valid, and the rest of the board can be solved, unwind
        if (checkValidity(get(board)) && (await solve(preset, offset + 1, signal))) return true;
      }
    }
  } else {
    if (preset.includes(offset)) {
      // Board completed
      return checkValidity(get(board));
    } else {
      // Try each value
      for (let val = 1; val < 10; val++) {
        board.set(offset, val as CellState);
        if (checkValidity(get(board))) return true;
      }
    }
  }

  // No luck -- clear cell at this offset and then backtrack
  board.set(offset, null);
  return false;
}

// Check if all values in the board are valid so far.
// Ignores any null values.
export function checkValidity(board: Board): boolean {
  const rows = checkRows(board);
  const cols = checkCols(board);
  const subGrids = checkSubGrids(board);
  return rows && cols && subGrids;
}

function checkRows(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    let seen = 0;
    for (let col = 0; col < 9; col++) {
      const val = board[row * 9 + col];
      if (val != null) {
        if (((seen >> val) & 1) == 1) return false;
        seen = seen | (1 << val);
      }
    }
  }
  return true;
}

function checkCols(board: Board): boolean {
  for (let col = 0; col < 9; col++) {
    let seen = 0;
    for (let row = 0; row < 9; row++) {
      const val = board[row * 9 + col];
      if (val != null) {
        if (((seen >> val) & 1) == 1) return false;
        seen = seen | (1 << val);
      }
    }
  }
  return true;
}

function checkSubGrids(board: Board): boolean {
  const subGrids = [
    [
      [0, 1, 2],
      [0, 1, 2]
    ],
    [
      [0, 1, 2],
      [3, 4, 5]
    ],
    [
      [0, 1, 2],
      [6, 7, 8]
    ],
    [
      [3, 4, 5],
      [0, 1, 2]
    ],
    [
      [3, 4, 5],
      [3, 4, 5]
    ],
    [
      [3, 4, 5],
      [6, 7, 8]
    ],
    [
      [6, 7, 8],
      [0, 1, 2]
    ],
    [
      [6, 7, 8],
      [3, 4, 5]
    ],
    [
      [6, 7, 8],
      [6, 7, 8]
    ]
  ];

  for (const [rows, cols] of subGrids) {
    let seen = 0;
    for (const row of rows) {
      for (const col of cols) {
        const val = board[row * 9 + col];
        if (val != null) {
          if (((seen >> val) & 1) == 1) return false;
          seen = seen | (1 << val);
        }
      }
    }
  }
  return true;
}
