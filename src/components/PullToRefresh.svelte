<script>
  import ferretRefresh from '../assets/images/ferret-refresh.png';

  export let enabled = true;
  export let onRefresh = async () => {};
  export let threshold = 72;
  export let maxTranslate = 92;

  let startY = null;
  let translateY = 0;
  let armed = false;
  let refreshing = false;
  let pulling = false;

  function findScrollable(event) {
    return event.currentTarget.closest('.app-shell');
  }

  function onTouchStart(event) {
    if (!enabled || refreshing) {
      return;
    }
    const scrollable = findScrollable(event);
    if (!scrollable || scrollable.scrollTop > 0) {
      startY = null;
      pulling = false;
      return;
    }
    startY = event.touches[0]?.clientY ?? null;
    armed = false;
    pulling = startY !== null;
  }

  function onTouchMove(event) {
    if (!enabled || refreshing || startY === null) {
      return;
    }
    const currentY = event.touches[0]?.clientY ?? startY;
    const delta = Math.max(0, currentY - startY);
    if (delta <= 0) {
      return;
    }

    const scrollable = findScrollable(event);
    if (!scrollable || scrollable.scrollTop > 0) {
      translateY = 0;
      armed = false;
      pulling = false;
      return;
    }

    event.preventDefault();
    translateY = Math.min(maxTranslate, delta * 0.45);
    armed = delta >= threshold;
    pulling = true;
  }

  async function onTouchEnd() {
    if (!enabled) {
      return;
    }
    const shouldRefresh = armed && !refreshing;
    startY = null;
    armed = false;
    pulling = false;
    translateY = 0;

    if (!shouldRefresh) {
      return;
    }

    refreshing = true;
    try {
      await onRefresh();
    } finally {
      refreshing = false;
    }
  }

  const ferretHiddenOffsetY = 28;
  const ferretRevealedOffsetY = -78;
  const ferretMinScale = 0.9;
  const ferretMaxScale = 1.06;

  $: progress = Math.min(1, Math.max(0, translateY / maxTranslate));
  $: easedProgress = 1 - (1 - progress) ** 2;
  $: ferretOffsetY = ferretHiddenOffsetY + (ferretRevealedOffsetY - ferretHiddenOffsetY) * easedProgress;
  $: ferretScale = ferretMinScale + (ferretMaxScale - ferretMinScale) * easedProgress;
  $: ferretOpacity = Math.min(1, Math.max(0, progress * 1.2));
</script>

<section
  class="pull-refresh"
  aria-label="Pull to refresh"
  on:touchstart={onTouchStart}
  on:touchmove={onTouchMove}
  on:touchend={onTouchEnd}
  on:touchcancel={onTouchEnd}
>
  <div class={`pull-refresh-content ${pulling ? 'is-pulling' : ''}`} style={`transform: translateY(${translateY}px);`}>
    <img
      class={`pull-refresh-ferret ${pulling ? 'is-pulling' : ''}`}
      src={ferretRefresh}
      alt=""
      aria-hidden="true"
      style={`transform: translate(-50%, ${ferretOffsetY}px) scale(${ferretScale}); opacity: ${ferretOpacity};`}
    />
    <div class="pull-refresh-slot">
      <slot />
    </div>
  </div>
</section>
