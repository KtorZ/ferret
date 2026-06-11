<script>
  import { onDestroy } from 'svelte';

  export let trigger = false;
  export let triggerKey = 0;
  export let message = '';
  export let className = 'app-toast info';
  export let durationMs = 1650;

  let visible = false;
  let timer = null;
  let seenTrigger = false;
  let seenTriggerKey = triggerKey;

  function show() {
    if (timer) {
      clearTimeout(timer);
    }
    visible = true;
    timer = setTimeout(() => {
      visible = false;
      timer = null;
    }, durationMs);
  }

  $: if (trigger && !seenTrigger) {
    seenTrigger = true;
    show();
  }

  $: if (triggerKey !== seenTriggerKey) {
    seenTriggerKey = triggerKey;
    if (triggerKey) {
      show();
    }
  }

  $: if (!trigger) {
    seenTrigger = false;
  }

  onDestroy(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
</script>

{#if visible}
  <div class={className} role="status" aria-live="polite">{message}</div>
{/if}
