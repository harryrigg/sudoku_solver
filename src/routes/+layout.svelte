<script>
  import { GithubIcon } from 'svelte-feather-icons';
  import '../app.css';
</script>

<div class="relative flex h-full items-center justify-center">
  <div
    class="absolute bottom-0 right-1/2 flex translate-x-1/2 items-center gap-2 p-4 text-zinc-400 md:right-0 md:translate-x-0"
  >
    <a href="https://github.com/harryrigg/sudoku_solver" target="_blank"
      ><GithubIcon class="stroke-zinc-500" size="1.2x" /></a
    >
    •
    <span class="w-max">
      Built by <a class="text-zinc-500" href="https://github.com/harryrigg" target="_blank"
        >Harry Rigg</a
      >
    </span>
  </div>
  <slot />
</div>
