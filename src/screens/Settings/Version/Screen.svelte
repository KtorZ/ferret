<script>
  const commitHash = __FERRET_COMMIT_HASH__;
  const commitDate = __FERRET_COMMIT_DATE__;

  $: displayDate = formatCommitDate(commitDate);

  function formatCommitDate(value) {
    if (!value || value === 'unknown') {
      return 'unknown';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  }
</script>

<section class="stack">
  <h2>Version</h2>
  <p class="text">Build information about this app.</p>

  <article class="summary-card version-card">
    <section class="section-block">
      <p class="section-title">Commit hash</p>
      <p class="mono">{commitHash}</p>
    </section>

    <section class="section-block">
      <p class="section-title">Commit date</p>
      <p class="mono">{displayDate}</p>
    </section>
  </article>
</section>

<style>
  .version-card {
    gap: 0.72rem;
  }
</style>
