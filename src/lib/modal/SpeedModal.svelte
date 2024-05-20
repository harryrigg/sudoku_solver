<script lang="ts">
  import { speed } from '$lib/stores';
  import Modal from './Modal.svelte';
</script>

<Modal class="w-4/5 md:w-3/5 lg:w-[30%]" on:close>
  <div class="flex flex-col gap-2">
    <span class="text-xl">Change solve speed</span>
    <div class="w-full border-t border-zinc-500"></div>
    <input type="range" min="1" max="150" bind:value={$speed} />
    <span class=""><b>Value:</b> {$speed}</span>
  </div>
</Modal>
