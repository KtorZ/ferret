<script>
  export let activeIndex = 0;
  export let total = 2;
  export let ignoreSelector = '.quick-action';
  export let ariaLabel = 'Swipe deck';
  export let onIndexChange = () => {};

  let viewportWidth = 0;
  let swipeStartX = null;
  let swipeStartY = null;
  let swipeDeltaX = 0;
  let swipeDragging = false;
  let swipeTrackAnimating = false;

  $: clampedTotal = Math.max(1, Number(total ?? 1));
  $: maxIndex = clampedTotal - 1;
  $: currentIndex = Math.max(0, Math.min(maxIndex, Number(activeIndex ?? 0)));
  $: baseTranslatePx = -currentIndex * viewportWidth;
  $: swipeTranslatePx = baseTranslatePx + swipeDeltaX;
  $: swipeTrackStyle = `transform: translate3d(${swipeTranslatePx}px, 0, 0); ${swipeTrackAnimating ? '' : 'transition: none;'}`;
  $: swipeTrackWidth = `${clampedTotal * 100}%`;

  function touchPoint(evt) {
    return evt.touches?.[0] ?? null;
  }

  function onSwipeTouchStart(evt) {
    const target = evt.target;
    if (target?.closest?.(ignoreSelector)) {
      return;
    }
    const touch = touchPoint(evt);
    if (!touch) {
      return;
    }
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
    swipeDeltaX = 0;
    swipeDragging = false;
    swipeTrackAnimating = false;
  }

  function onSwipeTouchMove(evt) {
    if (swipeStartX === null || swipeStartY === null) {
      return;
    }
    const touch = touchPoint(evt);
    if (!touch) {
      return;
    }
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;

    if (!swipeDragging) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
        return;
      }
      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        swipeStartX = null;
        swipeStartY = null;
        swipeDeltaX = 0;
        swipeDragging = false;
        swipeTrackAnimating = true;
        return;
      }
      swipeDragging = true;
    }

    evt.preventDefault();
    evt.stopPropagation();

    const atLeftEdge = currentIndex === 0 && deltaX > 0;
    const atRightEdge = currentIndex === maxIndex && deltaX < 0;
    const friction = atLeftEdge || atRightEdge ? 0.35 : 1;
    swipeDeltaX = deltaX * friction;
  }

  function onSwipeTouchEnd() {
    if (!swipeDragging) {
      swipeStartX = null;
      swipeStartY = null;
      swipeDeltaX = 0;
      swipeTrackAnimating = true;
      return;
    }
    swipeTrackAnimating = true;
    const threshold = Math.max(56, viewportWidth * 0.2);
    let nextIndex = currentIndex;
    if (swipeDeltaX <= -threshold) {
      nextIndex = Math.min(maxIndex, currentIndex + 1);
    } else if (swipeDeltaX >= threshold) {
      nextIndex = Math.max(0, currentIndex - 1);
    }
    swipeDeltaX = 0;
    if (nextIndex !== currentIndex) {
      onIndexChange(nextIndex);
    }
    swipeStartX = null;
    swipeStartY = null;
    swipeDragging = false;
  }
</script>

<section
  class="wallet-surface-swipe"
  role="group"
  aria-label={ariaLabel}
  bind:clientWidth={viewportWidth}
  on:touchstart={onSwipeTouchStart}
  on:touchmove={onSwipeTouchMove}
  on:touchend={onSwipeTouchEnd}
  on:touchcancel={onSwipeTouchEnd}
>
  <div class="wallet-surface-track {swipeDragging ? 'is-dragging' : ''}" style={`${swipeTrackStyle} width: ${swipeTrackWidth};`}>
    <slot name="card-0"></slot>
    <slot name="card-1"></slot>
  </div>
</section>
