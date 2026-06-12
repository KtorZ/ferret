<script>
  import { navigation, ROUTES } from '../../routing';

  import AdaptorScreen from './Adaptor/Screen.svelte';
  import ConnectorScreen from './Connector/Screen.svelte';
  import CurrencyScreen from './Currency/Screen.svelte';
  import FxScreen from './Fx/Screen.svelte';
  import LanguageScreen from './Language/Screen.svelte';
  import MenuScreen from './Menu/Screen.svelte';
  import NetworkScreen from './Network/Screen.svelte';
  import VersionScreen from './Version/Screen.svelte';
  import WalletDetailsScreen from './WalletDetails/Screen.svelte';
  import WalletExitScreen from './WalletDetails/WalletExit/Screen.svelte';
</script>

{#if $navigation.currentView === ROUTES.SETTINGS}
  <MenuScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_ADAPTOR}
  <AdaptorScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_FX}
  <FxScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_CONNECTOR}
  <ConnectorScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_NETWORK}
  <NetworkScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_LANGUAGE}
  <LanguageScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_CURRENCY}
  <CurrencyScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_VERSION}
  <VersionScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_WALLET_DETAILS}
  <WalletDetailsScreen />
{/if}

{#if $navigation.currentView === ROUTES.SETTINGS_WALLET_EXIT}
  <WalletExitScreen />
{/if}
