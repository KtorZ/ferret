import model from '../../../model';

export function setLocale(event) {
  try {
    model.configureLocale(event.currentTarget.value);
  } catch (err) {
    model.errorToast(err?.message ?? 'Invalid locale.');
  }
}
