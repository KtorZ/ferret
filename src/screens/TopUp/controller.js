import model from '../../model';

export async function copyAddress(depositAddress) {
  depositAddress = String(depositAddress ?? '').trim();
  if (!depositAddress) {
    return false;
  }

  try {
    await globalThis?.navigator?.clipboard?.writeText?.(depositAddress);
    return true;
  } catch {
    model.errorToast('Clipboard is unavailable in this environment.');
    return false;
  }
}
