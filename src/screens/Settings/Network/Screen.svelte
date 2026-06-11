<script>
  import config from '../../../config';
  import model from '../../../model';
  import settingsModel from '../../../model/settings';
  import { setNetwork } from './controller';

  const settings = model.settings;
  const KNOWN_NETWORKS = settingsModel.KNOWN_NETWORKS;
</script>

<section class="stack">
  <h2>Network</h2>
  <p class="text">Which Cardano network the app is connected to. This isn't dynamically configurable at the moment and is mostly informative.</p>

  <section class="section-block">
    <div>
      <div>
        <select value={$settings.network} on:change={setNetwork}>
          {#each KNOWN_NETWORKS as candidate}
            <option value={candidate} disabled={candidate !== config.networkName}>{candidate}</option>
          {/each}
        </select>
      </div>
    </div>
  </section>
</section>
