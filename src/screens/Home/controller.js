import model from '../../model';
import { get } from 'svelte/store';
import { parseLovelace } from '../../helpers';

const CHANNEL_RESERVE_LOVELACE = 2_000_000n;

export async function addFunds() {
  const channelState = get(model.channel);
  const step = channelState?.step ?? model.CHANNEL_STEP.NONE;

  if (step === model.CHANNEL_STEP.OPENING) {
    model.errorToast('Cannot add funds yet: the channel is currently opening.');
    return;
  }

  if (step === model.CHANNEL_STEP.CLOSING) {
    model.errorToast('Cannot add funds yet: the channel is currently closing.');
    return;
  }

  // FIXME: info should come from the channel on-chain information, not the adaptor. 
  // We need not the adaptor to be available for add or close operations.
  const adaptorState = get(model.adaptor);
  if (!adaptorState?.info) {
    model.errorToast('Adaptor does not seem available now.');
    return;
  }

  const input = window.prompt('Enter amount (₳) to add.');
  if (input === null) {
    return;
  }

  let amount = 0n;
  try {
    amount = parseLovelace(input);
  } catch {
    model.errorToast('Invalid ADA amount.');
    return;
  }

  try {
    await model.addToChannel(amount);
    model.successToast('Funds will be added to the channel shortly.');
  } catch (err) {
    model.errorToast(err?.message ?? 'Unable to add funds to channel.');
  }
}
