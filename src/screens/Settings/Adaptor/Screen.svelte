<script>
  import channelModel from '../../../model/channel';
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import config from '../../../config';
  import { fmtClosingPeriod, fmtCurrency, fmtFee } from '../../../helpers';
  import { handleChannelAction, setAdaptorCustomUrl, setAdaptorMode } from './controller';

  const adaptor = model.adaptor;
  const channel = model.channel;
  const fx = model.fx;
  const settings = model.settings;
  const ui = model.ui;

  const ADAPTOR_TYPES = settingsModel.ADAPTOR_TYPES;
  const CHANNEL_STEP = model.CHANNEL_STEP;

  $: displayCurrency = $ui.displayCurrency === 'FIAT' ? $settings.currency : 'ADA';
  $: adaptorSelection = $settings.adaptor?.type === ADAPTOR_TYPES.CUSTOM ? ADAPTOR_TYPES.CUSTOM : ($settings.adaptor?.label ?? '');
  $: isOpening = $channel?.step === CHANNEL_STEP.OPENING;
  $: isOpened = $channel?.step === CHANNEL_STEP.OPENED;
  $: isClosing = $channel?.step === CHANNEL_STEP.CLOSING;
  $: channelActionLabel = isOpened ? 'Close channel' : 'Open channel';
  $: adaptorKeyHex = $adaptor?.info?.verificationKey?.toString?.() ?? '';
  $: closePeriodText = $adaptor?.info ? fmtClosingPeriod($adaptor.info.closePeriod) : 'none';
  $: flatFeeText = fmtFee($adaptor?.info?.fee, displayCurrency, $fx);
  $: channelOwedText = fmtCurrency($channel?.owedAmount ?? 0n, displayCurrency, 'none', $fx);

  async function onModeChange(event) {
    const select = event.currentTarget;
    const mode = select.value;
    const selectedOption = select.options?.[select.selectedIndex];
    const adaptorUrl = selectedOption?.dataset?.url ?? '';
    const switched = await setAdaptorMode(mode, adaptorUrl);
    if (!switched) {
      select.value = adaptorSelection;
    }
  }

  function onPromptCustomUrl() {
    const current = String($settings.adaptor?.type === ADAPTOR_TYPES.CUSTOM ? $settings.adaptor?.label : '').trim();
    const next = window.prompt('Enter a custom adaptor URL:', current);
    if (next === null) {
      return;
    }
    setAdaptorCustomUrl(next);
  }
</script>

<section class="stack adaptor-screen">
  <h2>Adaptor</h2>
  <p class="text">Choose and configure the adaptor used by your wallet.</p>

  <article class="summary-card">
    <section class="section-block">
      <p class="section-title">Configured adaptor</p>
      <div>
        <div>
          <select value={adaptorSelection} on:change={onModeChange}>
            {#each config.adaptors as option}
              <option value={option.label} data-url={option.url}>{option.label}</option>
            {/each}
            <option value={ADAPTOR_TYPES.CUSTOM}>custom</option>
          </select>
        </div>
      </div>

      {#if $settings.adaptor?.type === ADAPTOR_TYPES.CUSTOM}
        <div>
          <button type="button" class="btn-input" on:click={onPromptCustomUrl}>
            <span class="menu-value">{$settings.adaptor?.label || 'none'}</span>
            <span class="menu-chevron">›</span>
          </button>
        </div>
      {/if}
    </section>
  </article>

  {#if $adaptor?.info}
    <article class="summary-card">
      <section class="section-block">
        <p class="section-title">Adaptor key</p>
        <p class="mono">{adaptorKeyHex.slice(0, 16)}...</p>
      </section>
      <section class="section-block">
        <p class="section-title">Closing period</p>
        <p class="mono">{closePeriodText}</p>
      </section>
      <section class="section-block">
        <p class="section-title">Flat fee per payment</p>
        <p class="mono">{flatFeeText}</p>
      </section>

      {#if $channel?.tag}
        <section class="section-block">
          <p class="section-title">Channel's tag</p>
          <p class="mono">{$channel.tag.toString().slice(0, 16)}...</p>
        </section>
        <section class="section-block">
          <p class="section-title">Channel's state</p>
          <p class="mono">{channelModel.HUMAN_READABLE_STEP[$channel.step]}</p>
        </section>
        <section class="section-block">
          <p class="section-title">Total Paid</p>
          <p class="mono">{channelOwedText.sign}{channelOwedText.value}</p>
        </section>
      {/if}
    </article>
  {/if}


  <button type="button" class="btn bottom-action-btn" on:click={handleChannelAction}>
    <i class={isOpened || isClosing ? 'fa-solid fa-plug-circle-xmark' : 'fa-solid fa-plug-circle-bolt'} aria-hidden="true"></i>
    <span>{isOpening ? 'Open channel' : channelActionLabel}</span>
  </button>
</section>
