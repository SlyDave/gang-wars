<script setup lang="ts">
import { catalog } from '~/domain/catalog'

const REPOSITORY = 'https://github.com/SlyDave/gang-wars'

// A fixed zone, so the page rendered at build time and the visitor's browser say the same.
const capturedAt = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'UTC',
}).format(new Date(catalog.capturedAt))
</script>

<template>
  <footer
    class="mt-10 grid grid-cols-1 gap-3 border-t-2 border-(--gw-line) py-8 text-xs text-muted"
  >
    <p>
      Prices and pledge contents were read from the
      <ULink
        :to="catalog.source"
        target="_blank"
        class="text-primary underline underline-offset-2 hover:no-underline"
        >Gang Wars rewards page on Gamefound</ULink
      >
      on {{ capturedAt }} UTC; shipping is from the campaign’s shipping tables, and what the
      Scarface 1920 bundles hold from its own account of them. All of it can change while the
      campaign runs, and Gamefound’s checkout is always the final word.
    </p>
    <p>
      An unofficial fan-made tool. Not affiliated with, or endorsed by, Redzen Games or Gamefound.
      Gang Wars, Scarface 1920 and all product names and images belong to their owners.
    </p>
    <p>
      <ULink
        :to="REPOSITORY"
        target="_blank"
        class="text-primary underline underline-offset-2 hover:no-underline"
        >Source on GitHub</ULink
      >
    </p>
  </footer>
</template>
