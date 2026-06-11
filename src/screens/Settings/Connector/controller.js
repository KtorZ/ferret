import model from '../../../model';
import settingsModel from '../../../model/settings';

export async function setConnectorMode(label, selectedUrl = '') {
  const mode = String(label ?? '').trim();

  if (mode === settingsModel.CONNECTOR_TYPES.CUSTOM) {
    try {
      model.configureConnector(settingsModel.CONNECTOR_TYPES.CUSTOM, '');
      return true;
    } catch (e) {
      model.errorToast(`unable to set connector: ${e?.message ?? 'unknown error'}`);
      return false;
    }
  }

  try {
    await model.initConnector(selectedUrl);
    model.configureConnector(settingsModel.CONNECTOR_TYPES.PREDEFINED, mode);
    model.successToast('Connector updated.');
    return true;
  } catch (e) {
    model.errorToast(`unable to set connector: ${e?.message ?? 'unknown error'}`);
    return false;
  }
}

export async function setConnectorCustomUrl(value) {
  try {
    await model.initConnector(value);
    model.configureConnector(settingsModel.CONNECTOR_TYPES.CUSTOM, value);
    model.successToast('Connector updated.');
  } catch (e) {
    model.errorToast(`unable to set connector: ${e?.message ?? 'unknown error'}`);
  }
}

export async function purgeConnectorCache() {
  try {
    await model.purgeHttpCache();
    model.successToast('Connector cache cleared.');
  } catch (e) {
    model.errorToast(`failed to purge cache: ${e?.message ?? 'unknown error'}`);
  }
}
