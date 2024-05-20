<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { AlertTriangleIcon } from 'svelte-feather-icons';

  import type { Board, CellState } from '$lib/types';
  import { board } from '$lib/stores';
  import Modal from '$lib/modal/Modal.svelte';

  const dispatch = createEventDispatcher();

  let parsedBoard: Board | null = null;
  let parseError: boolean = false;

  let inputVal: string = '';

  function load() {
    if (parsedBoard == null) return;
    board.load(parsedBoard);
    dispatch('close');
  }

  function serializeBoard(input: string) {
    if (input.trim() === '') return null;

    let newBoard = new Array(9 * 9).fill(null);
    const split = input.split('\n').map((s) => s.trim());

    for (const line of split) {
      if (line.trim() === '') continue;

      const values = line.split(' ');
      if (values.length != 2) {
        return null;
      }

      const [index, value] = values;
      const indexNum = parseInt(index);
      const valueNum = parseInt(value);

      if (Number.isNaN(indexNum) || Number.isNaN(valueNum)) {
        return null;
      }

      if (indexNum < 0 || indexNum >= 81 || valueNum < 1 || valueNum > 9) {
        return null;
      }

      newBoard[indexNum] = valueNum as CellState;
    }
    return newBoard;
  }

  function tryParse(input: string) {
    parsedBoard = serializeBoard(input);
    if (parsedBoard == null) {
      parseError = true;
    } else {
      parseError = false;
    }
  }

  $: tryParse(inputVal);
</script>

<Modal class="h-3/5 w-4/5 md:h-2/5 md:w-3/5 lg:h-2/5 lg:w-2/5" on:close>
  <div class="flex h-full flex-col gap-2">
    <h2 class="m-[1px] text-xl">Load Board</h2>
    <div class="w-full border-t border-zinc-500"></div>
    <div class="relative h-full">
      <textarea
        class="h-full w-full resize-none rounded border border-black bg-zinc-600 p-2 shadow-none outline-none placeholder:text-zinc-300"
        placeholder="Paste save file contents here..."
        bind:value={inputVal}
      ></textarea>
      {#if parseError}
        <span
          class="absolute bottom-3 left-3 flex items-center gap-[6px] text-sm text-red-400 [&>svg]:stroke-red-400"
        >
          <AlertTriangleIcon size="1.0x" />
          Input Invalid
        </span>
      {/if}
    </div>
    <button
      class="rounded border py-2 disabled:border-zinc-600 disabled:bg-zinc-600 disabled:text-zinc-400"
      disabled={parsedBoard == null}
      on:click={load}>Load</button
    >
  </div>
</Modal>
