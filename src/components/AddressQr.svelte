<script>
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  export let address;

  let qrSrc = '';
  let qrBusy = false;
  let qrTick = 0;
  let qrDarkColor = '#D97D55';

  onMount(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const cssColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    if (cssColor) {
      qrDarkColor = cssColor;
    }
  });

  $: {
    const payload = address?.toString?.() ?? '';
    const tick = ++qrTick;
    qrSrc = '';
    qrBusy = payload.length > 0;

    if (payload) {
      QRCode.toDataURL(payload, {
        width: 512,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: {
          dark: qrDarkColor,
          light: '#00000000',
        },
      })
        .then((src) => {
          if (tick !== qrTick) {
            return;
          }
          qrSrc = src;
          qrBusy = false;
        })
        .catch(() => {
          if (tick !== qrTick) {
            return;
          }
          qrBusy = false;
        });
    }
  }
</script>

{#if qrSrc}
  <img class="qr-image" src={qrSrc} alt="Cardano address QR code" />
{:else if qrBusy}
  <div class="qr-placeholder" aria-label="Generating QR code">
    <span>...</span>
  </div>
{:else}
  <div class="qr-placeholder" aria-label="Cardano address QR code unavailable">
    <span>QR</span>
  </div>
{/if}
