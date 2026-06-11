<script>
  import model from '../model';
  import {
    fmtCurrency,
    fmtFee,
    txDetails,
    txDateText,
    txDirection,
    txStatusNote,
    txStatusLabel,
    txStatus,
    TX_STATUS,
  } from '../helpers';

  export let item;
  export let walletAddress;
  export let network;
  export let extended = false;
  let expanded = extended;
  const ui = model.ui;
  const fx = model.fx;
  const settings = model.settings;

  const txStatusIconClass = {
    [TX_STATUS.PENDING]: 'fa-solid fa-clock-rotate-left',
    [TX_STATUS.FAILED]: 'fa-solid fa-circle-xmark',
    [TX_STATUS.CONFIRMED]: 'fa-solid fa-check',
    [TX_STATUS.SETTLED]: 'fa-solid fa-check-double',
  };

  $: txContext = { walletAddress, network };
  $: status = txStatus(item);
  $: statusIconClass = txStatusIconClass[status] ?? 'fa-solid fa-circle';
  $: statusClass = `status-${status}`;
  $: statusLabel = txStatusLabel[status] ?? 'unknown';
  $: displayCurrency = $ui?.displayCurrency === 'FIAT' ? $settings?.currency : 'ADA';
  $: fxRates = $fx ?? {};
  $: details = txDetails(item, txContext);
  $: feeText = fmtFee(details.fee, displayCurrency, fxRates);
  $: direction = txDirection(details.amount);
  $: amountText = fmtCurrency(details.amount, displayCurrency, details.self ? '⇋' : 'auto', fxRates);
  $: date = txDateText(item);
  $: statusNote = expanded ? txStatusNote(item) : '';
  $: if (extended && !expanded) expanded = true;

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

<button
  type="button"
  class={`card-surface tx-card ${expanded ? 'is-open' : ''}`}
  aria-expanded={expanded}
  on:click={toggleExpanded}
>
  <div class="tx-row">
    <div class="tx-main">
      <p class={`tx-status tx-status-top ${statusClass}`}>
        <span class="status-icon"><i class={statusIconClass} aria-hidden="true"></i></span>
        <span>{statusLabel}</span>
      </p>
      <p class="tx-title">{details.description}</p>
      <p class="tx-date">{date}{statusNote}</p>
    </div>
    <p class={`tx-amount ${direction}`}>
      <span class="sign">{amountText.sign}</span><span>{amountText.value}</span>
    </p>
  </div>
  <div class={`tx-extra-wrap ${expanded ? 'is-open' : ''}`}>
    <div class="tx-extra-inner tx-row">
      <p class="tx-id">{item.id.toString().slice(0, 20)}</p>
      <p class="tx-fee">{feeText} fee</p>
    </div>
  </div>
</button>

<style>
  .tx-card {
    border-width: 1px;
    box-shadow: 2px 2px 0 0 var(--color-shadow);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.58rem 0.65rem;
    gap: 0.1rem;
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .tx-card:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 0 var(--color-shadow);
  }

  .tx-card:focus-visible {
    outline: 2px solid var(--color-info);
    outline-offset: 1px;
  }

  .tx-main {
    min-width: 0;
    max-width: 100%;
    display: grid;
    gap: 0.22rem;
  }

  .tx-title {
    font-weight: 700;
    font-size: 0.89rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .tx-row {
    display: flex;
    justify-content: space-between;
    gap: 0.95rem;
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }

  .tx-id,
  .tx-fee,
  .tx-date {
    margin-top: 0.22rem;
    font-size: 0.74rem;
    color: var(--color-text-muted);
    font-family: 'IBM Plex Mono', 'Menlo', 'Monaco', monospace;
    text-align: left;
  }

  .tx-status {
    margin-top: 0.22rem;
    display: inline-flex;
    align-items: center;
    gap: 0.26rem;
    font-size: 0.75rem;
    text-transform: lowercase;
    color: var(--color-text-muted);
  }

  .tx-status-top {
    position: absolute;
    top: 0.5rem;
    right: 0.65rem;
    margin-top: 0;
  }

  .tx-status.status-confirmed {
    color: var(--color-info);
  }

  .tx-status.status-failed {
    color: var(--color-danger);
  }

  .tx-status.status-settled {
    color: var(--color-success);
  }

  .status-icon {
    font-weight: 800;
    width: 0.9rem;
    display: inline-flex;
    justify-content: center;
  }

  .status-icon i {
    font-size: 0.72rem;
  }

  .tx-amount {
    min-width: 102px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: auto;
    font-weight: 800;
    text-align: right;
    font-family: 'IBM Plex Mono', 'Menlo', 'Monaco', monospace;
    font-size: 0.86rem;
    line-height: 1.2;
    padding-top: 1rem;
  }

  .tx-extra-wrap {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 200ms ease;
  }

  .tx-extra-wrap.is-open {
    grid-template-rows: 1fr;
  }

  .tx-extra-inner {
    overflow: hidden;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 180ms ease, transform 180ms ease;
  }

  .tx-extra-wrap.is-open .tx-extra-inner {
    opacity: 1;
    transform: translateY(0);
  }

  .sign {
    color: var(--color-primary);
    font-size: 1rem;
    position: relative;
    top: -0.05rem;
    margin-right: 0.2rem;
  }
</style>
