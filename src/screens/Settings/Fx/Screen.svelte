<script>
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import { setFxProvider } from './controller';

  const settings = model.settings;
  const KNOWN_FX_PROVIDERS = settingsModel.KNOWN_FX_PROVIDERS;
</script>

<section class="stack">
  <h2>Foreign Exchange</h2>
  <p class="text">Choose the Foreign eXchange source used for currency exchange through the app.</p>

  <section class="section-block">
    <div>
      <div>
        <select value={$settings.fxProvider} on:change={setFxProvider}>
          {#each KNOWN_FX_PROVIDERS as provider}
            <option value={provider}>{provider}</option>
          {/each}
        </select>
      </div>
    </div>
  </section>
</section>
