<script>
  import PullToRefresh from '../../components/PullToRefresh.svelte';
  import QuickAction from '../../components/QuickAction.svelte';
  import SwipeDeck from '../../components/SwipeDeck.svelte';
  import TransactionCard from '../../components/TransactionCard.svelte';
  import cardanoLogo from '../../assets/images/logo-cardano.svg';
  import config from '../../config';
  import emptyActivityFerret from '../../assets/images/empty-activity-ferret.png';
  import lightningLogo from '../../assets/images/logo-bitcoin-lightning.svg';
  import model from '../../model';
  import { openPay } from '../Pay/controller';
  import { addFunds } from './controller';
  import { 
    TX_REALM, 
    channelBalance,
    getActivity,
    metricBalanceParts
  } from '../../helpers';
  import { navigation, ROUTES } from '../../routing';

  const wallet = model.wallet;
  const channel = model.channel;
  const ui = model.ui;
  const fx = model.fx;
  const settings = model.settings;

  $: displayCurrency = $ui?.displayCurrency === 'FIAT' ? $settings?.currency : 'ADA';
  $: fxRates = $fx ?? {};
  $: channelStep = $channel?.step ?? model.CHANNEL_STEP.NONE;
  $: hasOpenedChannel = channelStep === model.CHANNEL_STEP.OPENED 
      || channelStep === model.CHANNEL_STEP.CLOSING;
  $: hasPendingChannel = channelStep === model.CHANNEL_STEP.OPENING;
  $: openedChannel = hasOpenedChannel ? $channel : null;

  $: adaptorShortName = openedChannel
    ? $settings.adaptor.label
    : hasPendingChannel
      ? 'opening'
      : 'no channel';

  $: adaptorIconClass = hasOpenedChannel
    ? 'fa-solid fa-bolt-lightning'
    : hasPendingChannel
      ? 'fa-solid fa-plug-circle-minus'
      : 'fa-solid fa-plug-circle-xmark';

  $: walletBalanceLovelace = $wallet?.balance ?? 0n;
  $: walletBalanceParts = metricBalanceParts(walletBalanceLovelace, displayCurrency, fxRates);

  $: channelBalanceLovelace = hasOpenedChannel ? channelBalance($channel) : 0n;
  $: channelBalanceParts = metricBalanceParts(channelBalanceLovelace, displayCurrency, fxRates);

  $: hasWalletFunds = $wallet.balance > 0n;
  $: homeCtaMode = !hasWalletFunds ? 'topup' : !hasOpenedChannel ? 'open-channel' : 'pay';

  $: ctaIconClass =
    homeCtaMode === 'topup'
      ? 'fa-solid fa-plus'
      : homeCtaMode === 'open-channel'
        ? 'fa-solid fa-plug'
        : 'fa-solid fa-bolt-lightning';

  $: ctaLabel =
    homeCtaMode === 'topup'
      ? 'Top-up'
      : homeCtaMode === 'open-channel'
        ? 'Open channel'
        : 'Pay';

  $: activeIndex = $ui.displayWallet === TX_REALM.L2 ? 1 : 0;

  $: activity = getActivity($ui.displayWallet, $wallet.transactions, $channel.transactions);

  function onSwipeIndexChange(nextIndex) {
    model.setDisplayWallet(nextIndex === 1 ? TX_REALM.L2 : TX_REALM.L1);
  }

  function onPrimaryCta() {
    if (homeCtaMode === 'topup') {
      navigation.to(ROUTES.TOP_UP);
      return;
    }

    if (homeCtaMode === 'open-channel') {
      navigation.to(ROUTES.SETTINGS_ADAPTOR);
      return;
    }

    if (homeCtaMode === 'pay') {
      void openPay();
    }
  }
</script>

<PullToRefresh onRefresh={() => model.refresh()}>
  <section class="stack home-screen">
    <SwipeDeck activeIndex={activeIndex} onIndexChange={onSwipeIndexChange} ariaLabel="Wallet balances">
      <svelte:fragment slot="card-0">
        <section class="wallet-surface wallet-surface-l1 {$ui.displayWallet === TX_REALM.L1 ? 'is-active' : ''}" aria-label="L1 wallet panel">
          <p class="balance-label">L1 balance</p>
          <div class="balance-row">
            <p class="metric metric-left">
              <span class="currency">{walletBalanceParts.symbol}</span>
              <span class="whole">{walletBalanceParts.whole}</span><span class="dec">.{walletBalanceParts.cents}</span>
            </p>
            <img src={cardanoLogo} alt="Cardano" class="balance-wallet-logo" />
          </div>
          <div class="quick-actions" aria-label="Home actions">
              <QuickAction
                iconClass="fa-solid fa-plus"
                label="top up"
                onClick={() => navigation.to(ROUTES.TOP_UP)}
                disabled={false}
              />
              <QuickAction
                iconClass="fa-solid fa-right-left"
                label="currency"
                onClick={() => model.toggleCurrencyDisplayMode()}
              />
          </div>
        </section>
      </svelte:fragment>

      <svelte:fragment slot="card-1">
        <section class="wallet-surface wallet-surface-l2 {$ui.displayWallet === TX_REALM.L2 ? 'is-active' : ''}" aria-label="L2 wallet panel">
          <button
            type="button"
            class="adaptor-chip wallet-adaptor-chip {hasOpenedChannel ? '' : hasPendingChannel ? 'is-pending' : 'is-missing'}"
            on:click={() => navigation.to(ROUTES.SETTINGS_ADAPTOR)}
          >
            <i class="{adaptorIconClass} chip-icon" aria-hidden="true"></i>
            <span class="adaptor-label">{adaptorShortName}</span>
          </button>
          <p class="balance-label">L2 balance</p>
          <div class="balance-row">
            <p class="metric metric-left">
              <span class="currency">{channelBalanceParts.symbol}</span>
              <span class="whole">{channelBalanceParts.whole}</span><span class="dec">.{channelBalanceParts.cents}</span>
            </p>
            <img src={lightningLogo} alt="Bitcoin Lightning" class="balance-wallet-logo" />
          </div>
          <div class="quick-actions" aria-label="Home actions">
              <QuickAction
                iconClass="fa-solid fa-plus"
                label="top up"
                disabled={!hasOpenedChannel}
                onClick={() => addFunds()}
              />
              <QuickAction
                iconClass="fa-solid fa-right-left"
                label="currency"
                onClick={() => model.toggleCurrencyDisplayMode()}
              />
          </div>
        </section>
      </svelte:fragment>
    </SwipeDeck>

    <section class="section-block activity-section">
      {#if activity.length > 0}
        <div class="row row-top">
          <h3 class="activity-title"> Latest Activity</h3>
          <button
            type="button"
            class="text-btn subtle-link"
            on:click={() => navigation.to(ROUTES.HISTORY)}>
            see all ({activity.length})
          </button>
        </div>
        {#each activity.slice(0, 3) as item}
          <TransactionCard item={item} walletAddress={$wallet?.address} network={config.networkName} />
        {/each}
      {/if}
    </section>
  </section>
</PullToRefresh>

<button type="button" class="btn bottom-action-btn" on:click={onPrimaryCta}>
  <i class={ctaIconClass} aria-hidden="true"></i>
  <span>{ctaLabel}</span>
</button>

{#if activity.length <= 0}
  <div class="activity-empty">
    <img
      class="empty-illustration"
      src={emptyActivityFerret}
      alt="No activity illustration"
      loading="lazy"
    />
  </div>
{/if}
