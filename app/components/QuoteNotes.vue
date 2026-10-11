<script setup lang="ts">
import type { Quote } from '~/domain/quote'

const props = defineProps<{
  quote: Quote
}>()

const bonusNames = computed<string>(() =>
  props.quote.bonus.map((product) => product.name).join(', '),
)

/** The campaign names US tariffs as something it may add later; it concerns nobody else. */
const mayOweTariffs = computed<boolean>(() =>
  ['usa', 'hawaiiAlaska'].includes(props.quote.destination.region),
)
</script>

<template>
  <PaperPanel
    v-if="quote.lines.length > 0"
    title="Good to know"
    icon="i-fa-circle-info"
  >
    <ul class="grid grid-cols-1 gap-4 text-sm">
      <li class="flex items-start gap-3">
        <UIcon
          name="i-fa-clock"
          class="mt-0.5 size-4 shrink-0 text-primary"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">When it ships.</span>
          {{ quote.waves }} Those are the dates the games are due to leave China: the campaign gives
          no delivery date.
        </p>
      </li>

      <li class="flex items-start gap-3">
        <UIcon
          name="i-fa-shipping"
          class="mt-0.5 size-4 shrink-0 text-primary"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">Shipping is an estimate, paid later.</span>
          No shipping is charged with the pledge. The figure here is the campaign’s own estimate for
          your region; the real one is worked out in the pledge manager, from what is in the order.
          <template v-if="quote.unpricedShipping.length > 0">
            The campaign only gives estimates for the pledges and the Scarface 1920 bundles, so
            expect more on top for the add-ons in this order.
          </template>
        </p>
      </li>

      <li
        v-if="mayOweTariffs"
        class="flex items-start gap-3"
      >
        <UIcon
          name="i-fa-triangle-exclamation"
          class="mt-0.5 size-4 shrink-0 text-warning"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">Tariffs are not in this total.</span>
          The campaign says any US import tariff in force when the games ship will be added in the
          pledge manager.
        </p>
      </li>

      <li
        v-if="quote.bonus.length > 0"
        class="flex items-start gap-3"
      >
        <UIcon
          name="i-fa-bonus"
          class="mt-0.5 size-4 shrink-0 text-warning"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">You get more than you asked for.</span>
          A bundle that includes {{ bonusNames }} is cheaper than buying only what you asked for, so
          {{ quote.bonus.length === 1 ? 'it comes' : 'they come' }} along at no extra cost.
        </p>
      </li>

      <li class="flex items-start gap-3">
        <UIcon
          name="i-fa-list"
          class="mt-0.5 size-4 shrink-0 text-primary"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">How this is worked out.</span>
          Every combination of pledges, bundles and single add-ons that covers your choices is
          weighed, and the one with the lowest price for the rewards wins — even where a bundle
          brings things you switched off. Shipping is left out of that comparison because add-ons
          have no shipping estimate: counting it would unfairly favour buying everything separately.
        </p>
      </li>

      <li
        v-if="quote.unavailable.length > 0"
        class="flex items-start gap-3"
      >
        <UIcon
          name="i-fa-triangle-exclamation"
          class="mt-0.5 size-4 shrink-0 text-error"
        />
        <p class="text-toned">
          <span class="font-semibold text-highlighted">Something is missing.</span>
          {{ quote.unavailable.length }} of the things you asked for
          {{ quote.unavailable.length === 1 ? 'is' : 'are' }} not on sale in the captured catalogue,
          and {{ quote.unavailable.length === 1 ? 'is' : 'are' }} left out of the total.
        </p>
      </li>
    </ul>
  </PaperPanel>
</template>
