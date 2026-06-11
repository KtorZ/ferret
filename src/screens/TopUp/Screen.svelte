<script>
  import model from '../../model';
  import AddressQr from '../../components/AddressQr.svelte';
  import FloatingToast from '../../components/FloatingToast.svelte';
  import { copyAddress } from './controller';
  const wallet = model.wallet;

  let copiedAddress = false;

  async function onCopyAddress() {
    copiedAddress = false;
    const copied = await copyAddress(depositAddress);
    copiedAddress = copied;
  }

  $: depositAddress = $wallet?.address?.toString?.() ?? '';
</script>

<section class="stack topup-screen">
  <div>
    <h2>Top Up</h2>
    <p class="muted">Deposit L1 (Cardano) funds at this address to open an L2 channel with your configured adaptor and pay on the Lightning network.</p>
  </div>
  <section class="section-block">
    <AddressQr address={depositAddress} />
    <p class="mono topup-address">{depositAddress}</p>
    <button type="button" class="btn bottom-action-btn topup-cta" on:click={onCopyAddress}>
      <i class="fa-solid fa-copy" aria-hidden="true"></i>
      <span>Copy address</span>
    </button>
  </section>
</section>

<FloatingToast trigger={copiedAddress} message="address copied" />
