<script>
  import { onDestroy } from 'svelte';
  import model from '../../../model';
  import { fieldToast, exitWallet, promptExitAddress, promptStakeCredential } from './controller';

  const wallet = model.wallet;

  $: paymentValue = $wallet?.address?.paymentCredential?.asKey?.()?.toString?.() ?? '-';
  $: stakeValue = $wallet?.address?.stakeCredential?.toString?.() ?? 'none';
  $: exitValue = $wallet?.exitAddress?.toString?.() ?? 'none';

  onDestroy(() => {
    if ($fieldToast) {
      clearTimeout($fieldToast.timeout);
      fieldToast.set(null);
    }
  });
</script>

<section class="stack wallet-details-screen">
  <h2>Wallet Details</h2>
  <p class="text">Information about your L2 wallet are stored and configurable here. This concerns the wallet used to interact with Cardano L1, but also information relevant to the L2 channels.</p>

  <article class="summary-card">
    <section class="section-block">
      <p class="section-title section-title-with-help"><span>Payment credential</span></p>
      <p class="mono">{paymentValue}</p>
    </section>

    <section class="section-block">
      <p class="section-title">
        Stake credential
        {#if stakeValue === '-'}
          <span class="attention-dot details-dot" aria-hidden="true"></span>
        {/if}
      </p>
      <p class="text">Used to stake funds locked in L2.</p>
      <div class="credential-field-wrap">
        {#if $fieldToast && $fieldToast.target === 'stakeCredential'}
          {#key `stake-${$fieldToast.timeout}`}
            <div class={`field-toast ${$fieldToast.tone} floating`} role="status" aria-live="polite">{$fieldToast.message}</div>
          {/key}
        {/if}
        <div>
          <button type="button" class="btn-input" on:click={promptStakeCredential}>
            <span class="mono">{stakeValue}</span>
            <span class="chevron">›</span>
          </button>
        </div>
      </div>
    </section>
  </article>

  <article class="summary-card">
    <section class="section-block">
      <p class="section-title">Exit address</p>
      <p class="text">Address to withdraw all funds to when exiting the L2.</p>
      <div class="credential-field-wrap">
        {#if $fieldToast && $fieldToast.target === 'exitAddress'}
          {#key `exit-${$fieldToast.timeout}`}
            <div class={`field-toast ${$fieldToast.tone} floating`} role="status" aria-live="polite">{$fieldToast.message}</div>
          {/key}
        {/if}
        <div>
          <button type="button" class="btn-input" on:click={promptExitAddress}>
            <span class="mono">{exitValue}</span>
            <span class="chevron">›</span>
          </button>
        </div>
      </div>
    </section>
  </article>
</section>


  <button type="button" class="btn danger bottom-action-btn wallet-destroy-cta" on:click={exitWallet}>
    <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
    <span>Empty &amp; destroy wallet</span>
  </button>
