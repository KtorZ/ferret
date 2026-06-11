<script>
  import { onMount } from 'svelte';
  import PaymentSuccessAnimation from '../../../components/PaymentSuccessAnimation.svelte';
  import { navigation, ROUTES } from '../../../routing';

  onMount(() => {
    const timeout = setTimeout(() => {
      navigation.to(ROUTES.HOME);
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<section class="payment-success-screen" aria-label="Payment success">
  <PaymentSuccessAnimation />
</section>

<style>
  .payment-success-screen {
    width: 100%;
    min-height: 100svh;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: var(--color-primary);
  }
</style>
