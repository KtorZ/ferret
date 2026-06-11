<script>
  import model from '../../../../model';
  import { fmtCurrency } from '../../../../helpers';
  import { exitWallet } from './controller';

  const wallet = model.wallet;

  let normalizedExitAddress = '';
  $: normalizedExitAddress = String($wallet?.exitAddress?.toString?.() ?? '').trim();
  $: canExit = normalizedExitAddress.length > 0 && normalizedExitAddress !== 'none';
  $: withdrawAmountText = fmtCurrency($wallet?.balance ?? 0n, 'ADA');
</script>

<section class="stack wallet-exit-screen">
  <h2>Empty &amp; Destroy Wallet</h2>
  <p class="text">This action is <span class="danger">irreversible</span>. All channels will be closed and wallet state deleted.</p>

  <section class="section-block summary-card">
    <p class="section-title">Summary</p>
    <div class="row">
      <span>Amount to withdraw</span>
      <span class="mono">{withdrawAmountText.sign}{withdrawAmountText.value}</span>
    </div>
    <div class="row">
      <span>Closing delay</span>
      <span class="mono">~10s</span>
    </div>
    <div class="row stacked">
      <span>Destination</span>
      <span class="mono">{normalizedExitAddress || 'none'}</span>
    </div>
  </section>

  <button type="button" class="btn danger bottom-action-btn wallet-destroy-cta" on:click={exitWallet} disabled={!canExit}>
    <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
    <span>Empty &amp; destroy wallet</span>
  </button>
</section>
