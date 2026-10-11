<script setup lang="ts">
import { DESTINATIONS, REGION_NAMES, destinationFor } from '~/domain/destinations'

import type { Quote } from '~/domain/quote'

defineProps<{
  /** The order as it stands: how many shipments it makes depends on what is in it. */
  quote: Quote
}>()

const { preferences, update } = usePreferences()

const DESTINATION_OPTIONS = DESTINATIONS.map(({ code, name }) => ({ label: name, value: code }))

const MAX_TAX_RATE = 100
const TAX_RATE_STEP = 0.5

const destination = computed(() => destinationFor(preferences.value.destination))

const destinationCode = computed<string>({
  get: () => preferences.value.destination,
  set: (code) => {
    // A corrected rate belongs to the country it was corrected for.
    update({ destination: code, taxRate: null })
  },
})

const includeTax = computed<boolean>({
  get: () => preferences.value.includeTax,
  set: (value) => {
    update({ includeTax: value })
  },
})

const taxRate = computed<number>({
  get: () => preferences.value.taxRate ?? destination.value.taxRate,
  set: (rate) => {
    update({ taxRate: rate === destination.value.taxRate ? null : rate })
  },
})

const taxTiming = computed<string>(() => {
  switch (destination.value.collection) {
    case 'checkout':
      return 'Added by Gamefound when you pay: on the rewards now, and on the shipping when that is charged.'
    case 'none':
      return 'Not collected by the campaign.'
  }
})
</script>

<template>
  <PaperPanel
    title="Delivery & tax"
    icon="i-fa-shipping"
  >
    <div class="grid grid-cols-1 gap-5">
      <div>
        <p class="mb-2 flex items-center gap-2 gw-label text-xs text-toned">
          <UIcon
            name="i-fa-destination"
            class="size-4 text-primary"
          />
          Deliver to
        </p>
        <USelectMenu
          v-model="destinationCode"
          :items="DESTINATION_OPTIONS"
          value-key="value"
          :search-input="{ placeholder: 'Find a country…' }"
          aria-label="Deliver to"
          size="lg"
          class="w-full"
        />
        <p class="mt-2 text-xs text-muted">
          Shipping zone:
          <span class="font-semibold text-toned">{{ REGION_NAMES[destination.region] }}</span>
        </p>
      </div>

      <div>
        <p class="mb-2 flex items-center gap-2 gw-label text-xs text-toned">
          <UIcon
            name="i-fa-waves"
            class="size-4 text-primary"
          />
          Shipping waves
        </p>
        <p
          class="text-xs text-muted"
          data-testid="shipping-note"
        >
          <template v-if="quote.lines.length > 0">{{ quote.waves }}</template>
          <template v-else>
            The Scarface 1920 reprint ships in Wave 1 and Gang Wars in Wave 2. Nothing is ordered
            yet.
          </template>
          The campaign always sends the two games apart, so there is no single or split shipping to
          choose. No shipping is paid with the pledge: it is all charged later, in the pledge
          manager.
        </p>
      </div>

      <div>
        <ChoiceSwitch
          v-model="includeTax"
          label="Include Tax / VAT"
          :hint="`${destination.taxName} for ${destination.name}`"
          icon="i-fa-tax"
        />
        <div
          v-if="includeTax"
          class="mt-3 flex flex-wrap items-center gap-3"
        >
          <label
            for="tax-rate"
            class="gw-label text-xs text-toned"
            >{{ destination.taxName }} rate</label
          >
          <UInputNumber
            id="tax-rate"
            v-model="taxRate"
            :min="0"
            :max="MAX_TAX_RATE"
            :step="TAX_RATE_STEP"
            :format-options="{ maximumFractionDigits: 2 }"
            class="w-32"
          />
          <span class="text-sm text-muted">%</span>
        </div>
        <p
          v-if="includeTax"
          class="mt-2 text-xs text-muted"
        >
          {{ taxTiming }}
          <template v-if="destination.note !== undefined">{{ destination.note }}</template>
        </p>
      </div>
    </div>
  </PaperPanel>
</template>
