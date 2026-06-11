<script>
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import { setCurrency } from './controller';

  const settings = model.settings;
  const KNOWN_CURRENCIES = settingsModel.KNOWN_CURRENCIES;
</script>

<section class="stack">
  <h2>Currency</h2>
  <p class="text">Choose the fiat currency to display alongside ada. The double-arrow button on the wallet cards allows you to toggle between fiat and ada.</p>

  <section class="section-block">
    <div>
      <div>
        <select value={$settings.currency} on:change={setCurrency}>
          {#each KNOWN_CURRENCIES as currency}
            <option value={currency}>{currency}</option>
          {/each}
        </select>
      </div>
    </div>
  </section>
</section>
