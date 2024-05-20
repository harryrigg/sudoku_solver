<script lang="ts">
  import type { CellState } from '$lib/types';
  import { board } from '$lib/stores';
  import Tile from './Tile.svelte';

  export let allowInput: boolean;

  let activeTile = -1;

  $: if (!allowInput) {
    activeTile = -1;
  }

  export function setActiveValue(val: CellState) {
    if (!allowInput) return;
    if (activeTile != -1) $board[activeTile] = val;
  }

  function setActiveTile(offset: number) {
    if (!allowInput) return;
    activeTile = offset;
  }

  function onKeydown(ev: KeyboardEvent) {
    if (!allowInput) return;

    if (activeTile != -1 && ev.key >= '1' && ev.key <= '9') {
      $board[activeTile] = Number(ev.key) as CellState;
    } else if (activeTile != -1 && (ev.key == 'Delete' || ev.key == 'Backspace')) {
      $board[activeTile] = null;
    } else if (ev.key === 'Escape') {
      activeTile = -1;
    } else if (ev.key === 'ArrowLeft') {
      activeTile = Math.max(activeTile - 1, 0);
    } else if (ev.key === 'ArrowRight') {
      activeTile = Math.min(activeTile + 1, 80);
    } else if (ev.key === 'ArrowUp') {
      activeTile = Math.max(Math.floor(activeTile / 9) - 1, 0) * 9 + (activeTile % 9);
    } else if (ev.key === 'ArrowDown') {
      activeTile = Math.min(Math.floor(activeTile / 9) + 1, 8) * 9 + (activeTile % 9);
    }
  }

  function gridPosToOffset(subgrid: number, offset: number): number {
    return (
      Math.floor(subgrid / 3) * 27 + Math.floor(offset / 3) * 9 + (subgrid % 3) * 3 + (offset % 3)
    );
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="grid aspect-square grid-cols-3 grid-rows-3 gap-1 border-2 border-zinc-200 bg-zinc-200">
  {#each { length: 9 } as _, i}
    <div class="grid grid-cols-3 grid-rows-3 gap-[1px]">
      {#each { length: 9 } as _, j}
        {@const index = gridPosToOffset(i, j)}
        {@const cellValue = $board[index]}
        {@const isActive = activeTile == index}

        <Tile value={cellValue} active={isActive} on:click={() => setActiveTile(index)} />
      {/each}
    </div>
  {/each}
</div>
