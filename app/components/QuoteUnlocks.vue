<script setup lang="ts">
import { getProduct } from '~/domain/catalog'
import { updateUrl } from '~/domain/gift'
import { unlockImage } from '~/domain/unlocks'

import type { Quote } from '~/domain/quote'
import type { UnlockKind } from '~/domain/unlocks'

const props = defineProps<{
  quote: Quote
}>()

const { app } = useRuntimeConfig()

const IMAGE_SIZE = 640

const KIND_LABELS: Readonly<Record<UnlockKind, string>> = {
  stretchGoal: 'Stretch goal',
  reveal: 'Added in the campaign',
}

/** Each unlock the order earns, with the thing that earns it and the picture the site stores. */
const unlocks = computed(() =>
  props.quote.unlocks.map((unlock) => ({
    ...unlock,
    // What it is, and what the campaign says becomes of it afterwards, where it says.
    story: unlock.after === null ? unlock.what : `${unlock.what} ${unlock.after}`,
    earnedBy: getProduct(unlock.with).name,
    // The stored images live under the site's base path, wherever it is deployed.
    imageUrl: `${app.baseURL}${unlockImage(unlock)}`,
  })),
)
</script>

<template>
  <PaperPanel
    v-if="unlocks.length > 0"
    title="Free with this order"
    icon="i-fa-gift"
  >
    <p class="mb-4 text-xs text-muted">
      Not things to add to the cart: the campaign puts them in for every backer whose pledge has
      what earns them. It unlocked all four of its stretch goals before it closed.
    </p>
    <ul class="grid grid-cols-1 gap-3">
      <li
        v-for="unlock in unlocks"
        :key="unlock.id"
        class="flex gap-3 border border-default bg-elevated/40 p-3 sm:gap-4"
      >
        <img
          :src="unlock.imageUrl"
          :alt="unlock.name"
          :width="IMAGE_SIZE"
          :height="IMAGE_SIZE"
          loading="lazy"
          decoding="async"
          class="size-20 shrink-0 border border-default object-cover sm:size-24"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-1.5">
          <div class="flex items-start justify-between gap-3">
            <h4 class="text-sm leading-snug font-semibold text-highlighted sm:text-base">
              {{ unlock.name }}
            </h4>
            <p class="shrink-0 text-base font-bold text-error">Free</p>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            <UBadge
              :label="KIND_LABELS[unlock.kind]"
              :color="unlock.kind === 'stretchGoal' ? 'primary' : 'neutral'"
              variant="subtle"
              size="sm"
            />
            <UBadge
              :label="`With ${unlock.earnedBy}`"
              color="neutral"
              variant="outline"
              size="sm"
            />
          </div>
          <p class="text-xs text-muted">
            {{ unlock.story }}
            <ULink
              :to="updateUrl(unlock.update)"
              target="_blank"
              class="text-primary underline underline-offset-2 hover:no-underline"
              >Campaign Update #{{ unlock.update }}</ULink
            >.
          </p>
        </div>
      </li>
    </ul>
  </PaperPanel>
</template>
