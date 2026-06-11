<script>
  export let variant = 'primary';
  export let full = false;
  export let subtle = false;
  export let type = 'button';
  export let disabled = false;
  export let className = '';
  export let onClick = () => {};

  $: classes = [
    'btn',
    variant === 'danger' ? 'danger' : '',
    full ? 'full' : '',
    subtle ? 'subtle-link' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
</script>

<button {type} class={classes} {disabled} on:click={onClick}>
  <slot />
</button>
