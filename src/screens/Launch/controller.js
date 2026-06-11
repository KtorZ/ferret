import model from '../../model';
import { navigation, ROUTES } from '../../routing';

export async function createWallet() {
  try {
    await model.initKonduit(null);
    navigation.to(ROUTES.HOME);
  } catch (err) {
    model.errorToast(err?.message ?? 'unknown error');
  }
}

export async function importWallet() {
  const signingKey = window.prompt('Enter your signing key (64 hex-digit):', '');
  if (signingKey === null) {
    return;
  }

  try {
    await model.initKonduit(signingKey);
    navigation.to(ROUTES.HOME);
  } catch (err) {
    model.errorToast(err?.message ?? 'unknown error');
  }
}
