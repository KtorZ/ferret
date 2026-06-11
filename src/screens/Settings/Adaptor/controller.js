import model from '../../../model';
import settingsModel from '../../../model/settings';
import { get } from 'svelte/store';
import { Tag } from '../../../kernel';
import { lovelaceToAdaNumber, parseLovelace } from '../../../helpers';
import { navigation, ROUTES } from '../../../routing';

const CHANNEL_RESERVE_LOVELACE = 2_500_000n;
const MIN_CHANNEL_OPEN_LOVELACE = 1_000_000n;

function ensureAdaptorMutationAllowed() {
  const step = get(model.channel)?.step ?? model.CHANNEL_STEP.NONE;
  if (step === model.CHANNEL_STEP.OPENING) {
    throw new Error('A channel is currently opening. Pull to refresh from home.');
  }
  if (step === model.CHANNEL_STEP.OPENED) {
    throw new Error('Close the current channel before changing adaptor.');
  }
  if (step === model.CHANNEL_STEP.CLOSING) {
    throw new Error('A channel is currently closing. Please wait.');
  }
}

function maxOpenAmount(balanceLovelace) {
  const max = BigInt(balanceLovelace ?? 0n) - CHANNEL_RESERVE_LOVELACE;
  return max > 0n ? max : 0n;
}

export async function setAdaptorMode(label, selectedUrl = '') {
  const mode = String(label ?? '').trim();

  if (mode === settingsModel.ADAPTOR_TYPES.CUSTOM) {
    try {
      ensureAdaptorMutationAllowed();
      model.configureAdaptor(settingsModel.ADAPTOR_TYPES.CUSTOM, '');
      return true;
    } catch (err) {
      model.errorToast(err?.message ?? 'Adaptor cannot be changed right now.');
      return false;
    }
  }

  try {
    ensureAdaptorMutationAllowed();
    await model.initAdaptor(selectedUrl);
    model.configureAdaptor(settingsModel.ADAPTOR_TYPES.PREDEFINED, mode);
    model.successToast('Adaptor updated.');
    return true;
  } catch (err) {
    model.errorToast(err?.message ?? 'Adaptor is invalid.');
    return false;
  }
}

export async function setAdaptorCustomUrl(value) {
  try {
    ensureAdaptorMutationAllowed();
    await model.initAdaptor(value);
    model.configureAdaptor(settingsModel.ADAPTOR_TYPES.CUSTOM, value);
    model.successToast('Adaptor updated.');
  } catch (err) {
    model.errorToast(err?.message ?? 'Adaptor information is invalid.');
  }
}

export async function handleChannelAction() {
  const channelState = get(model.channel);
  const step = channelState?.step ?? model.CHANNEL_STEP.NONE;

  if (step === model.CHANNEL_STEP.OPENING) {
    model.errorToast('Cannot open channel now: a channel is already opening.');
    return;
  }
  if (step === model.CHANNEL_STEP.CLOSING) {
    model.errorToast('A channel is currently closing. Please wait.');
    return;
  }

  if (step === model.CHANNEL_STEP.OPENED) {
    const confirmed = window.confirm('Close the current channel?');
    if (!confirmed) {
      return;
    }
    try {
      await model.closeChannel();
      model.successToast('Close request submitted. It should appear soon.');
      navigation.to(ROUTES.HOME);
    } catch (err) {
      model.errorToast(err?.message ?? 'Unable to close channel.');
    }
    return;
  }

  const adaptorState = get(model.adaptor);
  if (!adaptorState?.info) {
    model.errorToast('Configure an adaptor first or check your connection.');
    return;
  }

  const balanceLovelace = BigInt(get(model.wallet)?.balance ?? 0n);
  if (balanceLovelace < CHANNEL_RESERVE_LOVELACE) {
    model.errorToast('Insufficient funds. At least 2 ADA are required.');
    return;
  }

  const maxAmount = maxOpenAmount(balanceLovelace);
  const suggestedAmount = maxAmount;
  const input = window.prompt(
    'Enter initial amount (₳) to deposit:',
    String(lovelaceToAdaNumber(suggestedAmount)),
  );
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

  if (amount < MIN_CHANNEL_OPEN_LOVELACE) {
    model.errorToast(`Initial amount must be at least ₳${lovelaceToAdaNumber(MIN_CHANNEL_OPEN_LOVELACE)}.`);
    return;
  }
  if (amount > maxAmount) {
    model.errorToast(`Initial amount cannot exceed ₳${lovelaceToAdaNumber(maxAmount)}.`);
    return;
  }

  try {
    const tagLength = Number(adaptorState.info?.maxTagLength ?? 32);
    const tag = Tag.generate(tagLength);
    await model.openChannel(tag, amount);
    model.successToast('Open request submitted. It should appear soon.');
    navigation.to(ROUTES.HOME);
  } catch (err) {
    model.errorToast(err?.message ?? 'Unable to open channel.');
  }
}
