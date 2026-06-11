<div class="payment-success-animation" aria-hidden="true">
  <svg class="svg-wrapper" viewBox="0 0 305 277" role="presentation">
    <path
      d="M196.6,27.6C179.1,18.3,159.2,13,138,13C69,13,13,69,13,138s56,125,125,125s125-56,125-125 c0-8.5-0.9-16.8-2.5-24.9"
      class="circle-gray"
    ></path>
    <path
      d="M196.6,27.6C179.1,18.3,159.2,13,138,13C69,13,13,69,13,138s56,125,125,125s125-56,125-125 c0-8.5-0.9-16.8-2.5-24.9"
      class="circle-yellow"
    ></path>
    <path
      d="M196.6,27.6C179.1,18.3,159.2,13,138,13C69,13,13,69,13,138s56,125,125,125s125-56,125-125 c0-8.5-0.9-16.8-2.5-24.9"
      class="circle-dark"
    ></path>
    <polyline points="72.5,123.5 131.5,179.5 284.5,18.5" class="tick-gray"></polyline>
    <polyline points="72.5,123.5 131.5,179.5 284.5,18.5" class="tick-yellow"></polyline>
    <polyline points="72.5,123.5 131.5,179.5 284.5,18.5" class="tick-dark"></polyline>
  </svg>
</div>

<style>
  .payment-success-animation {
    display: block;
    width: min(19rem, 74vw);
    aspect-ratio: 305 / 277;
    margin: 0 auto;
  }

  .svg-wrapper {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .tick-dark,
  .tick-yellow,
  .tick-gray,
  .circle-dark,
  .circle-yellow,
  .circle-gray {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-miterlimit: 10;
  }

  .tick-dark,
  .tick-yellow,
  .tick-gray {
    stroke-dasharray: 304;
    stroke-dashoffset: 0;
    animation-fill-mode: both;
  }

  .circle-dark,
  .tick-dark {
    stroke: var(--color-text-reverse);
  }

  .circle-yellow,
  .tick-yellow {
    stroke: var(--color-secondary);
  }

  .circle-gray,
  .tick-gray {
    stroke: var(--color-border);
  }

  .tick-dark {
    animation: tick-dark-draw 490ms 1368ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .tick-yellow {
    animation: tick-yellow-draw 492ms 1237ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .tick-gray {
    animation: tick-gray-draw 476ms 1037ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .circle-dark,
  .circle-yellow,
  .circle-gray {
    stroke-dasharray: 675;
    transform-origin: 138px 138px;
    animation-fill-mode: both, both;
  }

  .circle-dark {
    animation:
      circle-dark-rotate 1017ms 570ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both,
      circle-dark-dash 1029ms 578ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .circle-yellow {
    animation:
      circle-yellow-rotate 1017ms 359ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both,
      circle-yellow-dash 1029ms 357ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  .circle-gray {
    animation:
      circle-gray-rotate 1017ms 128ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both,
      circle-gray-dash 1029ms 128ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }

  @keyframes tick-dark-draw {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      stroke-dashoffset: 304;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }

  @keyframes tick-yellow-draw {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      stroke-dashoffset: 304;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }

  @keyframes tick-gray-draw {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      stroke-dashoffset: 304;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }

  @keyframes circle-dark-rotate {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: rotate(-180deg);
    }
    100% {
      animation-timing-function: linear;
      transform: rotate(0deg);
    }
  }

  @keyframes circle-dark-dash {
    0% {
      animation-timing-function: ease-in-out;
      stroke-dashoffset: -675;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }

  @keyframes circle-yellow-rotate {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: rotate(-180deg);
    }
    100% {
      animation-timing-function: linear;
      transform: rotate(0deg);
    }
  }

  @keyframes circle-yellow-dash {
    0% {
      animation-timing-function: ease-out;
      stroke-dashoffset: -675;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }

  @keyframes circle-gray-rotate {
    0% {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: rotate(-180deg);
    }
    100% {
      animation-timing-function: linear;
      transform: rotate(0deg);
    }
  }

  @keyframes circle-gray-dash {
    0% {
      animation-timing-function: ease-in-out;
      stroke-dashoffset: -675;
    }
    100% {
      animation-timing-function: linear;
      stroke-dashoffset: 0;
    }
  }
</style>
