/**
 * Settings menu navigation controller.
 */
import model from '../../../model';
import { navigation, ROUTES } from '../../../routing';

export function openNetwork() {
  navigation.to(ROUTES.SETTINGS_NETWORK);
}

export function openLanguage() {
  navigation.to(ROUTES.SETTINGS_LANGUAGE);
}

export function openCurrency() {
  navigation.to(ROUTES.SETTINGS_CURRENCY);
}

export function openAdaptor() {
  navigation.to(ROUTES.SETTINGS_ADAPTOR);
}

export function openFx() {
  navigation.to(ROUTES.SETTINGS_FX);
}

export function openConnector() {
  navigation.to(ROUTES.SETTINGS_CONNECTOR);
}

export function openWalletDetails() {
  navigation.to(ROUTES.SETTINGS_WALLET_DETAILS);
}

export function downloadBackup() {
  try {
    const { filename, payload } = model.exportBackup();
    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: 'application/json' },
    );
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(href);
    model.successToast('Backup downloaded.');
  } catch (err) {
    model.errorToast(err?.message ?? 'Unable to create backup.');
  }
}
