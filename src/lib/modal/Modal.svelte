<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="fixed bottom-0 left-0 right-0 top-0 z-10 grid place-items-center bg-black/70"
  on:click|self={() => dispatch('close')}
>
  <div class="rounded bg-zinc-700 p-3 text-zinc-50 {$$props.class}">
    <slot />
  </div>
</div>
