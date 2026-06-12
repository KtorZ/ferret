<script>
  import SettingMenuItem from '../../../components/SettingMenuItem.svelte';
  import {
    downloadBackup,
    openAdaptor,
    openConnector,
    openCurrency,
    openFx,
    openLanguage,
    openNetwork,
    openVersion,
    openWalletDetails,
  } from './controller';

  const showAdaptorDot = false;
</script>

<section class="stack settings-menu-screen">
  <h2>Settings</h2>

  <section class="section-block">
    <p class="section-title">General settings</p>
    <div class="menu-list">
      <SettingMenuItem iconClass="fa-solid fa-network-wired" label="network" onClick={openNetwork} />
      <SettingMenuItem iconClass="fa-solid fa-language" label="language" onClick={openLanguage} />
      <SettingMenuItem iconClass="fa-solid fa-austral-sign" label="currency" onClick={openCurrency} />
      <SettingMenuItem iconClass="fa-solid fa-code-commit" label="version" onClick={openVersion} />
    </div>
  </section>

  <section class="section-block">
    <p class="section-title">Lightning</p>
    <div class="menu-list">
      <SettingMenuItem iconClass="fa-solid fa-plug" label="adaptor" onClick={openAdaptor} showDot={showAdaptorDot} />
      <SettingMenuItem iconClass="fa-solid fa-comments-dollar" label="foreign exchange" onClick={openFx} />
    </div>
  </section>

  <section class="section-block">
    <p class="section-title">Cardano</p>
    <div class="menu-list">
      <SettingMenuItem iconClass="fa-solid fa-tower-broadcast" label="connector" onClick={openConnector} />
      <SettingMenuItem iconClass="fa-solid fa-wallet" label="wallet details" onClick={openWalletDetails} />
    </div>
  </section>

  <button type="button" class="btn bottom-action-btn" on:click={downloadBackup}>
    <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
    <span>Backup</span>
  </button>
</section>

<style>
  .settings-menu-screen {
    padding-bottom: calc(6.2rem + env(safe-area-inset-bottom));
  }
</style>
