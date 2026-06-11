import Navigo from 'navigo';
import { writable, get } from 'svelte/store';

export const ROUTES = {
  HOME: '/',
  PAY: '/pay',
  CONFIRM: '/pay/confirm',
  PAY_SUCCESS: '/pay/success',
  HISTORY: '/history',
  TOP_UP: '/topup',
  SETTINGS: '/settings',
  SETTINGS_ADAPTOR: '/settings/adaptor',
  SETTINGS_CONNECTOR: '/settings/connector',
  SETTINGS_NETWORK: '/settings/network',
  SETTINGS_LANGUAGE: '/settings/language',
  SETTINGS_CURRENCY: '/settings/currency',
  SETTINGS_FX: '/settings/fx',
  SETTINGS_WALLET_DETAILS: '/settings/wallet',
  SETTINGS_WALLET_EXIT: '/settings/wallet/exit',
};

const { subscribe, set } = writable({ currentView: ROUTES.HOME });

const router = new Navigo('/');

export const navigation = {
  subscribe,

  to(route) {
    router.navigate(route);
  },

  back() {
    if (history.length > 0) {
      return history.back();
    }

    const previousView = get({ subscribe })
      .currentView
      .split("/")
      .slice(0, -1)
      .join("/");

    if (previousView !== '' && previousView !== undefined) {
      return this.to(previousView);
    }

    return this.to(ROUTES.HOME);
  },

  mount() {
    const currentPath = normalizePath(location.pathname);
    const knownViews = Object.values(ROUTES);
    const deeplink = knownViews.includes(currentPath) ? currentPath : null;

    for (const view of knownViews) {
      router.on(view, () => {
        set({ currentView: view });
      });
    }

    router.resolve();

    if (deeplink) {
      this.to(deeplink);
    }
  },

  unmount() {
    router.destroy();
  },
};

function normalizePath(pathname) {
  const value = String(pathname ?? '').trim() || '/';
  if (value !== '/' && value.endsWith('/')) {
    return value.slice(0, -1);
  }
  return value;
}
