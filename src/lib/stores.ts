import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

import type { Board, CellState } from '$lib/types';

function createBoard() {
  const { subscribe, set, update } = writable<Board>(Array(81).fill(null));

  if (browser && localStorage.board) {
    set(JSON.parse(localStorage.board));
  }

  return {
    subscribe,
    set: (offset: number, value: CellState) => {
      if (offset >= 81) {
        return;
      }
      update((b) => {
        b[offset] = value;
        return b;
      });
    },
    load: (newBoard: Board) => {
      set(newBoard);
    },
    save: () => {
      if (browser) {
        localStorage.board = JSON.stringify(get(board));
      }
    },
    reset: () => {
      set(Array(81).fill(null));
    }
  };
}
export const board = createBoard();

function createSpeed() {
  const { subscribe, set, update } = writable<number>(1);

  if (browser && localStorage.speed) {
    set(JSON.parse(localStorage.speed));
  }

  subscribe((speed) => {
    if (browser) {
      localStorage.speed = speed;
    }
  });

  return {
    subscribe,
    set,
    update
  };
}
export const speed = createSpeed();
