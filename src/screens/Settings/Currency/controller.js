import model from '../../../model';

export function setCurrency(event) {
  try {
    model.configureCurrency(event.currentTarget.value);
  } catch (err) {
    model.errorToast(err?.message ?? 'Invalid currency.');
  }
}
