import { get, writable } from 'svelte/store';
import model from '../../model';
import { navigation, ROUTES } from '../../routing';
import { isBolt11, lnurlToBolt11 } from '../../helpers/bolt11'

const DEFAULT_PAY_FLOW_STATE = {
  invoice: '',
  selectedQuote: null,
};

export const payFlowState = writable(DEFAULT_PAY_FLOW_STATE);

let payCountdownTimer = null;
export const payConfirmCountdown = writable(0);

function clearPayCountdown() {
  if (payCountdownTimer) {
    clearInterval(payCountdownTimer);
    payCountdownTimer = null;
  }
  payConfirmCountdown.set(0);
}

function startPayCountdown() {
  clearPayCountdown();

  payConfirmCountdown.set(3);

  payCountdownTimer = setInterval(() => {
    const { currentView } = get(navigation);
    if (currentView !== ROUTES.CONFIRM) {
      clearPayCountdown();
      return;
    }

    const countdown = get(payConfirmCountdown);

    if (countdown > 1) {
      payConfirmCountdown.set(countdown - 1);
      return;
    }

    clearPayCountdown();
  }, 1000);
}

function normalizeInvoice(input) {
  return String(input ?? '').trim().replace(/^lightning:/i, '');
}

async function openQuoteSummary(invoiceInput) {
  const invoice = normalizeInvoice(invoiceInput);
  if (!invoice) {
    throw new Error('Paste a BOLT11 invoice first.');
  }

  const quote = await model.getQuote(invoice);
  const adaptorFee = BigInt(get(model.adaptor)?.info?.fee ?? 0n);
  const amount = BigInt(quote?.amount ?? 0n);
  const routingFee = BigInt(quote?.routingFee ?? 0n);
  const total = amount + routingFee + adaptorFee;

  navigation.to(ROUTES.CONFIRM);
  payFlowState.set({
    invoice,
    selectedQuote: {
      quote,
      amount,
      routingFee,
      adaptorFee,
      total,
    },
  });
  startPayCountdown();
}

export function onInvoiceInput(event) {
  const value = String(event.currentTarget.value ?? '');
  payFlowState.update((state) => ({ ...state, invoice: value }));
}

export async function onInvoiceDetected(input) {
  try {
    const invoice = isBolt11(input) ? input : lnurlToBolt11(input);
    await openQuoteSummary(invoice);
  } catch (err) {
    model.errorToast(err?.message ?? 'invalid or unprocessable invoice.');
  }
}

export function promptManualInvoice() {
  const current = String(get(payFlowState).invoice ?? '').trim();
  const next = window.prompt('Enter BOLT11 invoice:', current);
  if (next === null) {
    return;
  }
  void onInvoiceDetected(next);
}

export async function prepareQuoteFromCurrentInvoice() {
  try {
    await openQuoteSummary(get(payFlowState).invoice);
  } catch (err) {
    model.errorToast(err?.message ?? 'invalid or unprocessable invoice.');
  }
}

export async function payInvoice() {
  const countdown = get(payConfirmCountdown);
  if (countdown > 0) {
    return;
  }

  const { invoice, selectedQuote } = get(payFlowState);

  try {
    await model.pay(invoice, selectedQuote.quote);
    navigation.to(ROUTES.PAY_SUCCESS);
  } catch(err) {
    model.errorToast(`Error while submitting payment: ${err.message ?? err}`);
    navigation.to(ROUTES.HOME);
  } finally {
    clearPayCountdown();
    payFlowState.set(DEFAULT_PAY_FLOW_STATE);
  }
}

export async function openPay() {
  const adaptorInfo = get(model.adaptor)?.info ?? null;
  if (!adaptorInfo) {
    model.errorToast('Adaptor is unavailable at the moment. Please try again later.');
    return;
  }
  clearPayCountdown();
  payFlowState.set(DEFAULT_PAY_FLOW_STATE);
  navigation.to(ROUTES.PAY);
}

export async function confirmPay() {
  await payInvoice();
}
