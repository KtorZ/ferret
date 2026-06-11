<script>
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import { setLocale } from './controller';

  const settings = model.settings;
  const KNOWN_LOCALES = settingsModel.KNOWN_LOCALES;
</script>

<section class="stack">
  <h2>Language</h2>
  <p class="text">Choose the interface language and formatting locale.</p>

  <section class="section-block">
    <div>
      <div>
        <select value={$settings.locale} on:change={setLocale}>
          {#each KNOWN_LOCALES as locale}
            <option value={locale}>{locale}</option>
          {/each}
        </select>
      </div>
    </div>
  </section>
</section>
