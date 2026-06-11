<script>
  import AppButton from '../../components/AppButton.svelte';
  import splashFerret from '../../assets/images/splash-ferret.svg';
  import model from '../../model';
  import { createWallet, importWallet } from './controller';

  const appState = model.state;
  const STATE = model.STATE;

  $: showSpinner = $appState === STATE.LOADING || $appState === STATE.BUSY;
  $: showActions = $appState !== STATE.BOOTING && !showSpinner;
</script>

<section class="stack connect-screen onboarding-screen">
  <article>
    <p class="app-brand">Ferret</p>
    <img
      class="hero-mark onboarding-illustration"
      src={splashFerret}
      alt="Electrified ferret"
    />
    <div class="splash-copy">
      <p class="splash-slogan">Lightning fast ada payment</p>
      <p class="splash-subtitle">powered by <span>Konduit</span></p>
    </div>
  </article>

  {#if showSpinner}
    <div class="launch-loading">
        <span class="loader" aria-hidden="true"></span>
    </div>
  {:else if showActions}
    <div class="connect-actions onboarding-actions">
      <AppButton full className="connect-btn" onClick={createWallet}>Create a new L2 wallet</AppButton>
      <button type="button" class="link-btn connect-link" on:click={importWallet}>I already have a wallet</button>
    </div>
  {/if}
</section>
