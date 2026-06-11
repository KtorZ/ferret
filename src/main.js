import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { enableLogsAndPanicHook, LogLevel } from './kernel';
import model from './model';

const APP_UPDATED_FLAG = 'ferret.app.updated';

enableLogsAndPanicHook(LogLevel.Debug);

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const hadControllerAtBoot = navigator.serviceWorker.controller != null;
  let refreshing = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadControllerAtBoot || refreshing) {
      return;
    }

    refreshing = true;
    sessionStorage.setItem(APP_UPDATED_FLAG, '1');
    window.location.reload();
  });
}

const app = mount(App, {
  target: document.getElementById('app'),
})

if (typeof window !== 'undefined' && sessionStorage.getItem(APP_UPDATED_FLAG) === '1') {
  sessionStorage.removeItem(APP_UPDATED_FLAG);
  model.successToast('App updated.');
}

export default app
