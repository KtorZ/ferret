import { get, writable } from 'svelte/store';
import model from '../../../model';
import { navigation, ROUTES } from '../../../routing';

/** @type {import('svelte/store').Writable<null|{target: string, message: string, tone: string, timeout: number}>} */
export const fieldToast = writable(null);

function setFieldToast(target, message, tone) {
    if (get(fieldToast) != null) {
      clearTimeout(get(fieldToast).timeout);
    }

    const timeout = setTimeout(() => {
      fieldToast.set(null);
    }, 5600);

    fieldToast.set({ target, message, tone, timeout });
}

export function openWalletDetails() {
  navigation.to(ROUTES.SETTINGS_WALLET_DETAILS);
}

export async function promptStakeCredential() {
  try {
    const wallet = get(model.wallet);
    const current = wallet?.address?.stakeCredential?.toString?.() ?? '';
    const input = window.prompt('Enter stake credential (56-hex) or a bech32 stake address:', current);
    if (input === null) {
      return;
    }

    const value = String(input).trim();
    model.setStakeCredential(value === '' ? null : value);
  } catch(err) {
    setFieldToast('stakeCredential', err?.message ?? 'Invalid stake credential.', 'error');
  }
}

export async function promptExitAddress() {
  try {
    const wallet = get(model.wallet);
    const current = wallet?.exitAddress?.toString?.() ?? '';
    const input = window.prompt('Enter exit address (Cardano addr / addr_test). Leave empty for none.', current);
    if (input === null) {
      return;
    }

    const value = String(input).trim();
    model.setExitAddress(value === '' ? null : value);
  } catch(err) {
    setFieldToast('exitAddress', err?.message ?? 'Invalid exit address.', 'error');
  }
}

export async function exitWallet() {
  await model.exit();
  navigation.to(ROUTES.HOME);
  // FIXME: implement exitWallet properly
  //
  // const { balance, transactions } = get(wallet);
  // const noPendingTransactions = transactions.every(tx => txStatus(tx) !== TX_STATUS.PENDING);
  // 
  // if (balance === 0n && get(channel).tag == null && noPendingTransactions) {
  //   await model.exit();
  // }
  //
  // if (exitAddress == null) {
  //   setFieldToast('exitAddress', 'Set an exit address first.', 'info');
  //   return;
  // }
  // 
  // navigation.to(ROUTES.SETTINGS_WALLET_EXIT);
}
