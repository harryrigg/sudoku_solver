<script lang="ts">
  import {
    SaveIcon,
    Trash2Icon,
    FileTextIcon,
    PlayCircleIcon,
    ClockIcon,
    XOctagonIcon,
    RefreshCcwIcon,
    CheckIcon,
    AlertTriangleIcon
  } from 'svelte-feather-icons';
  import { onMount } from 'svelte';

  onMount(async () => {
    // Uses custom HTML element so must be loaded on mount
    await import('ldrs/quantum');
  });

  import type { Board, CellState } from '$lib/types';
  import { solveRecurse } from '$lib/sudoku';
  import { board, speed } from '$lib/stores';

  import Sudoku from '$lib/components/Sudoku.svelte';
  import LoadModal from '$lib/modal/LoadModal.svelte';
  import SaveModal from '$lib/modal/SaveModal.svelte';
  import SpeedModal from '$lib/modal/SpeedModal.svelte';

  let currentModal: string | null = null;

  let sudoku: Sudoku;
  let message: string | number | null = null;

  type SolveState = {
    aborter: AbortController;
    previous: Board;
    finished: boolean;
    start: number;
  };
  let solveState: SolveState | null = null;

  $: solving = solveState != null ? !solveState.finished : false;
  $: completedSolve = solveState != null ? solveState.finished : false;
  $: allowInput = currentModal == null && !solving;

  board.subscribe(() => {
    // Save board on changes, unless we are currently solving
    if (!solving) {
      board.save();
    }

    // Reset solver state if modified after solving
    if (completedSolve) {
      solveState = null;
      message = null;
    }
  });

  function undoSolve() {
    if (solveState == null) return;
    message = null;
    board.load(solveState.previous);
    solveState = null;
  }

  async function solve() {
    // Create list of all cells already set by user
    const preset = $board
      .map((v, i) => [v, i])
      .filter((a) => a[0] != null)
      .map((a) => a[1] as number);

    message = 'solving';

    const aborter = new AbortController();
    aborter.signal.onabort = undoSolve;

    solveState = {
      aborter,
      previous: [...$board],
      finished: false,
      start: performance.now()
    };

    solveRecurse(preset, solveState.aborter.signal)
      .then((result) => {
        if (solveState == null) return;

        if (result) {
          // Successfully solved
          let duration = performance.now() - solveState.start;
          solveState.finished = true;
          message = duration;
        } else {
          // Could not be solved
          solveState = null;
          message = 'error';
        }
        setTimeout(() => (message = null), 3000);
      })
      .catch(() => {
        // Ignore exception - thrown on abort
      });
  }

  $: solveBtnTooltip = solving ? 'Stop Solving' : completedSolve ? 'Revert Solve' : 'Solve';
  function solveClick() {
    if (solving) {
      // Stop solving
      solveState?.aborter.abort();
    } else if (completedSolve) {
      // Undo solve
      undoSolve();
    } else {
      // Solve
      solve();
    }
  }

  function openModal(modal: string) {
    currentModal = modal;
  }

  function closeModal() {
    currentModal = null;
  }

  const asCellState = (v: number) => v as CellState;
</script>

{#if currentModal == 'save'}
  <SaveModal on:close={closeModal} />
{:else if currentModal == 'load'}
  <LoadModal on:close={closeModal} />
{:else if currentModal == 'speed'}
  <SpeedModal on:close={closeModal} />
{/if}

<div class="flex w-[calc(min(100vw-10%,450px))] flex-col items-center justify-center gap-3">
  <div class="relative h-full w-full">
    {#if message != null}
      <div
        class="
        absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col
        items-center justify-around gap-3 rounded bg-zinc-700 p-4 text-white opacity-95
      "
      >
        {#if typeof message === 'number'}
          <CheckIcon />
          <span>Solving Completed</span>
          Took: {message}ms
        {:else if message == 'solving'}
          <l-quantum color="white" size="25" />
          Solving
        {:else if message == 'error'}
          <AlertTriangleIcon />
          No solution exists!
        {/if}
      </div>
    {/if}

    <Sudoku {allowInput} bind:this={sudoku} />
  </div>

  <div
    class="grid w-[95%] grid-cols-[repeat(10,1fr)] rounded border bg-zinc-700 text-white *:aspect-square [&>button:not(:last-child)]:border-r"
  >
    {#each Array(9) as _, i}
      <button
        class="flex items-center justify-center"
        on:click={() => sudoku.setActiveValue(asCellState(i + 1))}>{i + 1}</button
      >
    {/each}
    <button class="flex items-center justify-center" on:click={() => sudoku.setActiveValue(null)}
      >C</button
    >
  </div>

  <div
    class="grid w-1/2 grid-cols-[repeat(5,1fr)] rounded border bg-zinc-700 text-white *:aspect-square [&>button:not(:last-child)]:border-r"
  >
    <button
      class="btn relative flex items-center justify-center"
      data-tooltip="Reset Board"
      on:click={() => {
        if (!solving) {
          board.reset();
        }
      }}><Trash2Icon /></button
    >
    <button
      class="btn relative flex items-center justify-center"
      data-tooltip="Save Board"
      on:click={() => {
        if (!solving) {
          openModal('save');
        }
      }}><SaveIcon /></button
    >
    <button
      class="btn relative flex items-center justify-center"
      data-tooltip="Load Board"
      on:click={() => {
        if (!solving) {
          openModal('load');
        }
      }}><FileTextIcon /></button
    >
    <button
      class="btn relative flex items-center justify-center"
      data-tooltip="Solve speed (current = {$speed})"
      on:click={() => openModal('speed')}><ClockIcon /></button
    >
    <button
      class="btn relative flex items-center justify-center"
      data-tooltip={solveBtnTooltip}
      on:click={solveClick}
    >
      {#if solving}
        <XOctagonIcon />
      {:else if completedSolve}
        <RefreshCcwIcon />
      {:else}
        <PlayCircleIcon />
      {/if}
    </button>
  </div>
</div>

<style>
  /* Style for tooltips */

  .btn::before,
  .btn::after {
    --scale: 0;

    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%) translateY(100%) scale(var(--scale));
    transition: all 30ms;
  }

  .btn::before {
    content: attr(data-tooltip);
    width: max-content;
    padding-inline: 6px;
    padding-block: 4px;
    border-radius: 5px;
    background-color: #52525b;
    transform-origin: center top;
    color: #52525b;
  }

  .btn::after {
    content: '';
    border: 8px solid transparent;
    border-bottom-color: #52525b;
    transform: translateX(-50%) scale(var(--scale));
    transform-origin: center bottom;
  }

  .btn:hover::before,
  .btn:hover::after {
    --scale: 1;
    color: white;
  }
</style>
