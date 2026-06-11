import model from '../../../model';

export function setFxProvider(event) {
  try {
    model.configureFxProvider(event.currentTarget.value);
  } catch (err) {
    model.errorToast(err?.message ?? 'Invalid FX provider.');
  }
}
