<script>
  import { onMount, onDestroy } from 'svelte';
  import config from '../../config';
  import qrFerret from '../../assets/images/qr-ferret.png';
  import { payFlowState, onInvoiceDetected, onInvoiceInput, prepareQuoteFromCurrentInvoice, promptManualInvoice } from './controller';
  import { BarcodeDetectorPolyfill } from '@undecaf/barcode-detector-polyfill';

  const cameraDisabled = 'disableCamera' in config;
  let videoEl = null;
  let mediaStream = null;
  let detector = null;
  let scanFrame = null;
  let cameraError = '';
  let cameraReady = false;
  let scannerSupported = true;
  $: invoiceMissing = String($payFlowState.invoice ?? '').trim() === '';
  $: ctaMode = !cameraDisabled && invoiceMissing ? 'enter-manual' : 'submit-pay';
  $: ctaDisabled = ctaMode === 'submit-pay' && invoiceMissing;

  async function stopCamera() {
    if (scanFrame) {
      cancelAnimationFrame(scanFrame);
      scanFrame = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    if (videoEl) {
      try {
        videoEl.pause();
      } catch {
        // ignore
      }
      videoEl.srcObject = null;
    }
    detector = null;
    cameraReady = false;
  }

  function scanLoop() {
    if (!detector || !videoEl || videoEl.readyState < 2) {
      scanFrame = requestAnimationFrame(scanLoop);
      return;
    }

    detector.detect(videoEl)
      .then((results) => {
        const value = String(results?.[0]?.rawValue ?? '').trim();
        if (!value) {
          return;
        }
        void onInvoiceDetected(value);
        stopCamera();
      })
      .catch(() => {
        // Keep manual input as fallback.
      })
      .finally(() => {
        if (mediaStream) {
          scanFrame = requestAnimationFrame(scanLoop);
        }
      });
  }

  async function startCamera() {
    cameraError = '';
    if (cameraDisabled) {
      return;
    }
    await stopCamera();
    if (!navigator?.mediaDevices?.getUserMedia) {
      scannerSupported = false;
      cameraError = 'Camera access is not supported by this browser.';
      return;
    }
    if (typeof window?.BarcodeDetector !== 'function') {
      window['BarcodeDetector'] = BarcodeDetectorPolyfill;
    }
    try {
      const supported = await window.BarcodeDetector.getSupportedFormats();
      if (!supported.includes('qr_code')) {
        scannerSupported = false;
        cameraError = 'QR scanning is not supported by this browser.';
        return;
      }
      detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
        audio: false,
      });
      if (videoEl) {
        videoEl.srcObject = mediaStream;
        await videoEl.play();
      }
      cameraReady = true;
      scannerSupported = true;
      scanLoop();
    } catch (err) {
      cameraReady = false;
      cameraError = err?.message ?? 'Unable to access camera.';
    }

  }

  onMount(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopCamera();
        return;
      }
      if (!cameraDisabled) {
        startCamera();
      }
    };
    const onPageHide = () => {
      stopCamera();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    startCamera();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
    };
  });

  onDestroy(() => {
    stopCamera();
  });

  async function onPrimaryCta() {
    if (ctaMode === 'enter-manual') {
      promptManualInvoice();
      return;
    }
    await prepareQuoteFromCurrentInvoice();
  }
</script>

<section class="stack">
  {#if cameraDisabled}
    <h2>Pay</h2>
    <p class="muted">Paste a BOLT11 invoice, then use the bottom Pay button.</p>
    <textarea value={$payFlowState.invoice} placeholder="Enter invoice manually" rows="6" on:input={onInvoiceInput}></textarea>
  {:else}
    <section class="pay-screen">
      <div class="pay-camera-wrap">
        <video class="pay-camera {cameraReady ? 'is-ready' : 'is-hidden'}" bind:this={videoEl} autoplay playsinline muted></video>
        <div class="pay-camera-overlay">
          <div class="pay-guide" aria-hidden="true">
            <p class="pay-camera-instructions">Scan BOLT11 QR Code or enter it manually</p>
            <img class="pay-guide-image" src={qrFerret} alt="" />
          </div>
        </div>
        {#if !cameraReady}
          <div class="pay-camera-fallback muted">
            {#if cameraError}
              {cameraError}
              {#if scannerSupported}
                <button type="button" class="link-btn connect-link" on:click={startCamera}>Try again</button>
              {/if}
            {:else}
              Requesting camera access...
            {/if}
          </div>
        {/if}
      </div>
    </section>
  {/if}
</section>

<button type="button" class="btn bottom-action-btn" on:click={onPrimaryCta} disabled={ctaDisabled}>
  <i class={ctaMode === 'enter-manual' ? 'fa-solid fa-keyboard' : 'fa-solid fa-bolt-lightning'} aria-hidden="true"></i>
  <span>{ctaMode === 'enter-manual' ? 'Enter manually' : 'Pay'}</span>
</button>

<style>
  .pay-screen {
    position: fixed;
    inset: 0;
    z-index: 10;
  }

  .pay-camera-wrap {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: var(--color-text);
  }

  .pay-camera {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 150ms ease;
  }

  .pay-camera.is-hidden {
    opacity: 0;
  }

  .pay-camera.is-ready {
    opacity: 1;
  }

  .pay-camera-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pay-guide {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    justify-items: center;
    gap: 0.45rem;
  }

  .pay-camera-instructions {
    text-align: center;
    color: var(--color-text-reverse);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0 1rem;
    text-shadow: 0 1px 2px color-mix(in srgb, var(--color-text) 50%, transparent);
  }

  .pay-guide-image {
    width: 90%;
    max-width: 500px;
    height: auto;
    object-fit: contain;
    display: block;
  }

  .pay-camera-fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    gap: 0.5rem;
    text-align: center;
    padding: 1rem;
    color: var(--color-text-reverse);
    background: color-mix(in srgb, var(--color-text) 55%, transparent);
  }
</style>
