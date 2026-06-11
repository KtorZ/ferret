<script>
  export let iconClass = '';
  export let label = '';
  export let showDot = false;
  export let disabled = false;
  export let onClick = () => {};
</script>

<button type="button" class="quick-action" on:click={onClick} {disabled}>
  <span class="quick-icon" aria-hidden="true">
    <i class={iconClass}></i>
    {#if showDot}
      <span class="attention-dot quick-dot"></span>
    {/if}
  </span>
  <span class="quick-text">{label}</span>
</button>
