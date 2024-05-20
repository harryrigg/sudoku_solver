<script lang="ts">
  import { CheckIcon, CopyIcon } from 'svelte-feather-icons';

  import type { Board } from '$lib/types';
  import { board } from '$lib/stores';
  import Modal from '$lib/modal/Modal.svelte';

  $: serializedBoard = saveBoard($board);

  function saveBoard(board: Board): string {
    let output = '';
    board.forEach((val, i) => {
      if (val != null) {
        output += `${i} ${val}\n`;
      }
    });
    return output;
  }

  let copied = false;
  let textarea: HTMLTextAreaElement;
  function copyToClipboard() {
    navigator.clipboard.writeText(textarea.value);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }
</script>

<Modal class="h-3/5 w-4/5 md:h-2/5 md:w-3/5 lg:h-2/5 lg:w-2/5" on:close>
  <div class="flex h-full flex-col gap-2">
    <h2 class="m-[1px] text-xl">Save Board</h2>
    <div class="w-full border-t border-zinc-500"></div>
    <div class="relative h-full">
      <textarea
        class="h-full w-full resize-none rounded border border-black bg-zinc-600 p-2 shadow-none outline-none"
        bind:this={textarea}
        readonly>{serializedBoard}</textarea
      >
      <button
        class="absolute bottom-2 right-2 flex h-6 min-w-6 items-center justify-center rounded text-sm transition-all hover:bg-zinc-300 [&>svg]:stroke-zinc-50"
        title="Copy"
        on:click={copyToClipboard}
      >
        {#if !copied}
          <CopyIcon size="1.2x" class="stroke-zinc-50" />
        {:else}
          <span class="flex items-center gap-1 px-1">
            <CheckIcon size="1.0x" />
            Copied
          </span>
        {/if}
      </button>
    </div>
  </div>
</Modal>
