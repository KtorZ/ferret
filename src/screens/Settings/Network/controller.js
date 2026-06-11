import model from '../../../model';

export function setNetwork(event) {
  try {
    model.configureNetwork(event.currentTarget.value);
  } catch (err) {
    model.errorToast(err?.message ?? 'Invalid network.');
  }
}
