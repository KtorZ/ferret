<script>
  export let showBack = false;
  export let onBack = () => {};
  export let showLogo = false;
  export let showSettingsButton = false;
  export let showSettingsDot = false;
  export let onSettingsClick = () => {};
  export let showCurrencyButton = false;
  export let onCurrencyClick = () => {};
  export let transparent = false;
</script>

<header class="topbar {transparent ? 'is-transparent' : ''}">
  <div class="top-left">
    {#if showLogo}
      <div class="header-brand" aria-label="Ferret">
        <span class="header-wordmark">ferret</span>
      </div>
    {/if}
    {#if showBack}
      <button type="button" class="back-btn" aria-label="back" on:click={onBack}>‹ back</button>
    {/if}
  </div>

  <div class="top-actions">
    {#if showSettingsButton}
      <button type="button" class="topbar-settings-btn" aria-label="settings" on:click={onSettingsClick}>
        <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
        {#if showSettingsDot}
          <span class="attention-dot quick-dot"></span>
        {/if}
      </button>
    {/if}
    {#if showCurrencyButton}
      <button type="button" class="topbar-settings-btn" aria-label="currency" on:click={onCurrencyClick}>
        <i class="fa-solid fa-right-left" aria-hidden="true"></i>
      </button>
    {/if}
  </div>
</header>
