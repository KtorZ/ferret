<script>
  export let iconClass = '';
  export let label = '';
  export let showDot = false;
  export let onClick = () => {};
</script>

<button type="button" class="menu-btn" on:click={onClick}>
  <span class="menu-icon">
    <i class={iconClass} aria-hidden="true"></i>
    {#if showDot}
      <span class="attention-dot menu-dot"></span>
    {/if}
  </span>
  <span class="menu-label">{label}</span>
  <span class="menu-chevron">›</span>
</button>
