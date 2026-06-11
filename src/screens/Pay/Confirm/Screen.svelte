<script>
  import model from '../../../model';
  import { fmtCurrency, fmtFee } from '../../../helpers';
  import { payConfirmCountdown, payFlowState, payInvoice } from '../controller';

  const global = model.state;
  const settings = model.settings;
  const fx = model.fx;
  const ui = model.ui;
  $: quote = $payFlowState.selectedQuote;
  $: displayCurrency = $ui?.displayCurrency === 'FIAT' ? $settings?.currency : 'ADA';
  $: fxRates = $fx ?? {};
  $: amountText = fmtCurrency(quote?.amount ?? 0n, displayCurrency, 'none', fxRates);
  $: routingFeeText = fmtFee(quote?.routingFee ?? 0n, displayCurrency, fxRates);
  $: adaptorFeeText = fmtFee(quote?.adaptorFee ?? 0n, displayCurrency, fxRates);
  $: totalText = fmtCurrency(quote?.total ?? 0n, displayCurrency, 'none', fxRates);
  $: countdown = Number($payConfirmCountdown ?? 0);
  $: disabled = countdown > 0 || $global === model.STATE.BUSY;
</script>

<section class="stack">
  <h2>Review payment</h2>
  <p class="text">Carefully review the invoice details before confirming.</p>

  <section class="section-block summary-card">
    <p class="section-title">Invoice</p>
    <p class="mono">{$payFlowState.invoice || 'none'}</p>
  </section>

  <section class="section-block summary-card">
    <p class="section-title">Payment details</p>
    <div class="row">
      <span>Amount</span>
      <span class="mono">{amountText.sign}{amountText.value}</span>
    </div>
    <div class="row">
      <span>Routing fee</span>
      <span class="mono">{routingFeeText}</span>
    </div>
    <div class="row">
      <span>Adaptor fee</span>
      <span class="mono">{adaptorFeeText}</span>
    </div>
    <div class="row">
      <strong>Total</strong>
      <strong class="mono">{totalText.sign}{totalText.value}</strong>
    </div>
  </section>
</section>

<button type="button" class="btn bottom-action-btn" on:click={payInvoice} disabled={disabled}>
  <i class={disabled ? 'fa-solid fa-hourglass-half' : 'fa-solid fa-bolt-lightning'} aria-hidden="true"></i>
  <span>{disabled ? String(countdown > 0 ? countdown : '') : 'Pay'}</span>
</button>
