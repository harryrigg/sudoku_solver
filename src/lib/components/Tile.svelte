<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let value: number | null;
  export let active;
</script>

<button
  class="
    grid place-items-center
    bg-zinc-900 text-zinc-200
    {active ? 'border-[2px] border-zinc-200' : ''}
    outline-none
  "
  tabindex="0"
  on:click={() => dispatch('click')}
  on:focus={() => dispatch('click')}
>
  {value == null ? '' : value}
</button>
