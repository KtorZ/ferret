<script>
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import config from '../../../config';
  import { purgeConnectorCache, setConnectorCustomUrl, setConnectorMode } from './controller';

  const settings = model.settings;
  const CONNECTOR_TYPES = settingsModel.CONNECTOR_TYPES;

  $: connectorSelection = $settings.connector?.type === CONNECTOR_TYPES.CUSTOM ? CONNECTOR_TYPES.CUSTOM : ($settings.connector?.label ?? '');

  async function onModeChange(event) {
    const select = event.currentTarget;
    const mode = select.value;
    const selectedOption = select.options?.[select.selectedIndex];
    const connectorUrl = selectedOption?.dataset?.url ?? '';
    const switched = await setConnectorMode(mode, connectorUrl);
    if (!switched) {
      select.value = connectorSelection;
    }
  }

  async function onCustomInput(event) {
    await setConnectorCustomUrl(event.currentTarget.value);
  }
</script>

<section class="stack connector-screen">
  <h2>Connector</h2>
  <p class="text">This app does NOT embed a full node, and thus relies on a <i>Connector</i> to fetch data from and interact with Cardano L1.</p>
  <br/>
  <p class="text">It is recommended to configure a connector that has no relation with your <i>Adaptor</i> to remain censorship-resistant.</p>

  <section class="section-block">
    <div>
      <div>
        <select value={connectorSelection} on:change={onModeChange}>
          {#each config.connectors as option}
            <option value={option.label} data-url={option.url}>{option.label}</option>
          {/each}
          <option value={CONNECTOR_TYPES.CUSTOM}>Custom</option>
        </select>
      </div>
    </div>
  </section>

  {#if $settings.connector?.type === CONNECTOR_TYPES.CUSTOM}
    <section class="section-block">
      <p class="text">Enter a custom connector URL for {$settings.network}.</p>
      <div>
        <div>
          <input
            class="connector-inline-input"
            value={$settings.connector?.label ?? ''}
            placeholder="none"
            on:change={onCustomInput}
          />
        </div>
      </div>
    </section>
  {/if}

  <button type="button" class="btn bottom-action-btn connector-cache-cta" on:click={purgeConnectorCache}>
    purge cache
  </button>
</section>

<style>
  .connector-screen {
    padding-bottom: calc(var(--action-btn-height) + 2.4rem + env(safe-area-inset-bottom));
  }
</style>
