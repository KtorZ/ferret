<script>
  import model from '../../model';
  import TransactionCard from '../../components/TransactionCard.svelte';
  import { getActivity } from '../../helpers';

  const { channel, settings, ui, wallet } = model;

  $: activity = getActivity($ui.displayWallet, $wallet.transactions, $channel.transactions);
</script>

<section class="stack">
  <h2>Transaction History</h2>
  {#if activity.length === 0}
    <p class="muted">No transactions yet.</p>
  {:else}
    {#each activity as item}
      <TransactionCard item={item} walletAddress={$wallet.address} network={$settings.network} extended={true}/>
    {/each}
  {/if}
</section>
