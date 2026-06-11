<script>
  import { onMount } from 'svelte';
  import AppHeader from './components/AppHeader.svelte';
  import HomeScreen from './screens/Home/Screen.svelte';
  import HistoryScreen from './screens/History/Screen.svelte';
  import LaunchScreen from './screens/Launch/Screen.svelte';
  import PayScreen from './screens/Pay/Screen.svelte';
  import ConfirmScreen from './screens/Pay/Confirm/Screen.svelte';
  import PaySuccessScreen from './screens/Pay/Success/Screen.svelte';
  import SettingsScreen from './screens/Settings/Screen.svelte';
  import TopUpScreen from './screens/TopUp/Screen.svelte';
  import config from './config';
  import model from './model';
  import { navigation, ROUTES } from './routing';

  const STATE = model.STATE;
  const global = model.state;
  const wallet = model.wallet;
  const ui = model.ui;

  $: currentView = $navigation.currentView;
  $: isSettingsView = String(currentView ?? '').startsWith('/settings');
  $: isPaymentSuccessView = currentView === ROUTES.PAY_SUCCESS;
  $: isSplashMode = currentView === ROUTES.HOME && $global < STATE.READY;
  $: hideHeader = isSplashMode || isPaymentSuccessView;
  $: showBack = currentView !== ROUTES.HOME && !isSplashMode;
  $: showLogo = currentView === ROUTES.HOME && !isSplashMode;
  $: showSettingsButton = currentView === ROUTES.HOME && !isSplashMode;
  $: showCurrencyButton = currentView === ROUTES.SETTINGS_ADAPTOR;
  $: transparentHeader = currentView === ROUTES.PAY && !('disableCamera' in config);

  function onToastDone() {
    model.clearToast();
  }

  onMount(() => {
    navigation.mount();
    return () => {
      navigation.unmount();
    };
  });
</script>

<div
  class="app-shell {isSplashMode ? 'splash-mode' : ''} {currentView === ROUTES.HOME && !!$wallet.address ? 'home-mode' : ''} {isPaymentSuccessView ? 'fullscreen-mode' : ''}"
>
  {#if !hideHeader}
    <AppHeader
      {showBack}
      {showLogo}
      {showSettingsButton}
      {showCurrencyButton}
      transparent={transparentHeader}
      onBack={() => navigation.back()}
      onSettingsClick={() => navigation.to(ROUTES.SETTINGS)}
      onCurrencyClick={() => model.toggleCurrencyDisplayMode()}
    />
  {/if}

  <main class="panel {isPaymentSuccessView ? 'panel-fullscreen' : ''}">
    {#if currentView === ROUTES.HOME && isSplashMode}<LaunchScreen />{/if}
    {#if currentView === ROUTES.HOME && !isSplashMode}<HomeScreen />{/if}
    {#if currentView === ROUTES.HISTORY}<HistoryScreen />{/if}
    {#if currentView === ROUTES.PAY}<PayScreen />{/if}
    {#if currentView === ROUTES.CONFIRM}<ConfirmScreen />{/if}
    {#if currentView === ROUTES.PAY_SUCCESS}<PaySuccessScreen />{/if}
    {#if currentView === ROUTES.TOP_UP}<TopUpScreen />{/if}
    {#if isSettingsView}<SettingsScreen />{/if}
  </main>

  {#if $global === STATE.BUSY && !isSplashMode}
    <div class="app-refresh-overlay">
      <span class="loader" aria-hidden="true"></span>
    </div>
  {/if}

  {#if $ui?.toast?.message}
    <div class="app-toast {$ui.toast.severity}" role="status" aria-live="polite" on:animationend={onToastDone}>
      {$ui.toast.message}
    </div>
  {/if}
</div>
