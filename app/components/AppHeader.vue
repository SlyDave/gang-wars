<script setup lang="ts">
import { CURRENCIES, LEADING_CURRENCIES } from '~/domain/currencies'

import type { CurrencyCode, ThemeName } from '~/domain/types'

const { theme, setTheme } = useTheme()
const { preferences, setCurrency, reset } = usePreferences()

const THEMES: readonly { value: ThemeName; label: string; icon: string }[] = [
  { value: 'gangwars', label: 'Gang Wars', icon: 'i-fa-gangwars' },
  { value: 'scarface', label: 'Scarface 1920', icon: 'i-fa-scarface' },
]

const CURRENCY_OPTIONS = CURRENCIES.map(({ code, name, symbol }) => ({
  value: code,
  label: `${symbol} ${code}`,
  description: name,
}))

/** The euro, the dollar and the pound in a group of their own, ahead of the rest. */
const CURRENCY_GROUPS = [
  CURRENCY_OPTIONS.slice(0, LEADING_CURRENCIES),
  CURRENCY_OPTIONS.slice(LEADING_CURRENCIES),
]

/** GitHub Sponsors, opened on a one-time donation of three dollars, which can be changed there. */
const DONATE_URL = 'https://github.com/sponsors/SlyDave?frequency=one-time&sponsor=SlyDave&amount=3'

const DONATE_HINT =
  'Hi! If you find this useful, please consider a small donation to fuel more creations and help me pay for the hosting - you’re the best, cheers!'

const chosenTheme = computed<ThemeName>({
  get: () => theme.value,
  set: setTheme,
})

const currency = computed<CurrencyCode>({
  get: () => preferences.value.currency,
  set: setCurrency,
})
</script>

<template>
  <header class="flex flex-col gap-5 py-6 sm:py-8">
    <div>
      <!-- The logo, and across from it the list of what has changed. The row ends where the
           one below does: see the note on that one. -->
      <div class="flex items-start justify-between gap-4 lg:pr-2">
        <p class="gw-title text-6xl text-highlighted sm:text-7xl">Gang Wars</p>
        <div class="flex shrink-0">
          <WhatsNew />
          <span
            aria-hidden="true"
            class="invisible hidden gw-scroll overflow-y-scroll lg:block"
          />
        </div>
      </div>
      <h1 class="mt-1 gw-title text-2xl text-primary gw-glow sm:text-3xl">Rewards calculator</h1>
      <p class="mt-3 max-w-xl text-sm text-muted">
        Switch on what you want from the Gang Wars campaign, the Scarface 1920 reprint included.
        This finds the cheapest combination of pledges, bundles and add-ons that gets you all of it.
      </p>
      <p class="mt-2 max-w-xl text-sm text-muted">
        The campaign closed on 16 October 2026. Orders are finished in the Pledge Manager, which
        Redzen Games expect to open in a few months; the prices here are the campaign’s.
      </p>
    </div>

    <div class="flex flex-wrap items-end gap-3 lg:pr-2">
      <div class="w-full sm:w-auto sm:min-w-96">
        <p class="mb-1.5 gw-label text-[0.65rem] text-muted">Style</p>
        <SegmentedChoice
          v-model="chosenTheme"
          :options="THEMES"
          label="Style"
        />
      </div>
      <div class="min-w-56 flex-1 sm:w-64 sm:flex-none">
        <p class="mb-1.5 gw-label text-[0.65rem] text-muted">Currency</p>
        <USelectMenu
          v-model="currency"
          :items="CURRENCY_GROUPS"
          value-key="value"
          :filter-fields="['label', 'description']"
          :search-input="{ placeholder: 'Find a currency…' }"
          aria-label="Currency"
          size="lg"
          class="gw-control w-full"
        />
      </div>
      <UButton
        label="Reset"
        icon="i-fa-arrow-rotate-left"
        color="neutral"
        variant="outline"
        class="gw-control gw-label text-xs"
        @click="reset"
      />
      <!-- Takes whatever of the row is left, and is stamped in red to be noticed. Where the
           row is too narrow to keep it, it drops to a line of its own, and is held to a
           sensible width there rather than stretching across the page. -->
      <UTooltip
        :delay-duration="150"
        :ui="{ content: 'h-auto max-w-80 py-2' }"
      >
        <UButton
          :to="DONATE_URL"
          target="_blank"
          label="Donate"
          icon="i-fa-donate"
          color="error"
          variant="solid"
          class="gw-control min-w-36 flex-1 justify-center gw-label text-xs sm:max-w-80"
        />
        <template #content>
          <span class="leading-snug">{{ DONATE_HINT }}</span>
        </template>
      </UTooltip>
      <!-- The column beneath this end of the row keeps a gap and a scrollbar's width clear of
           the page's edge (pages/index.vue). The row's padding is the gap; this, a scrollbar
           with nothing to scroll, is the width — whatever that is on the system in use — so
           the row ends exactly where that column's panels do. Its margin undoes the row's gap. -->
      <span
        aria-hidden="true"
        class="invisible -ml-3 hidden gw-scroll overflow-y-scroll lg:block"
      />
    </div>
  </header>
</template>
