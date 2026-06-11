import model from '../../../../model';

export async function exitWallet() {
  try { 
    await model.exit();
  } catch (err) {
    model.errorToast(err?.message ?? 'unknown error');
  }
}
