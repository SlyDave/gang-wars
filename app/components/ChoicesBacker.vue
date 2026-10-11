<script setup lang="ts">
import { getProduct } from '~/domain/catalog'
import { GIFTS, updateUrl } from '~/domain/gift'

import type { GiftClaim } from '~/domain/types'

const { preferences, update } = usePreferences()
const { format } = useMoney()
const { app } = useRuntimeConfig()

const IMAGE_SIZE = 640

/** Each gift with the add-on it is, and the picture the site stores of it. */
const gifts = GIFTS.map((gift) => {
  const product = getProduct(gift.product)
  return {
    ...gift,
    product,
    // The stored images live under the site's base path, wherever it is deployed.
    imageUrl: product.image === null ? null : `${app.baseURL}${product.image}`,
  }
})

const setClaim = (claim: GiftClaim, claimed: boolean): void => {
  update({ [claim]: claimed })
}
</script>

<template>
  <PaperPanel
    title="Free gifts"
    icon="i-fa-gift"
  >
    <p class="mb-4 text-xs text-muted">
      The campaign gives three add-ons away, each to backers who did something for it. Say which
      apply to you and they are added to a Gang Wars order at no charge. Gamefound knows you by your
      account, so pledge with the one you followed or backed with.
    </p>

    <ul class="grid grid-cols-1 gap-4">
      <li
        v-for="gift in gifts"
        :key="gift.claim"
      >
        <ChoiceSwitch
          :model-value="preferences[gift.claim]"
          :label="gift.label"
          :hint="gift.hint"
          :icon="gift.icon"
          @update:model-value="setClaim(gift.claim, $event)"
        />
        <div class="mt-2 flex items-start gap-3">
          <img
            v-if="gift.imageUrl !== null"
            :src="gift.imageUrl"
            :alt="gift.product.name"
            :width="IMAGE_SIZE"
            :height="IMAGE_SIZE"
            loading="lazy"
            decoding="async"
            class="size-14 shrink-0 border border-default object-cover"
          />
          <p class="min-w-0 text-xs text-muted">
            <span class="font-semibold text-highlighted">{{ gift.product.name }}.</span>
            {{ gift.story }}
            <template v-if="!preferences[gift.claim]">
              Otherwise it is an add-on at {{ format(gift.product.effectivePrice) }}.
            </template>
            <ULink
              :to="updateUrl(gift.update)"
              target="_blank"
              class="text-primary underline underline-offset-2 hover:no-underline"
              >Campaign Update #{{ gift.update }}</ULink
            >.
          </p>
        </div>
      </li>
    </ul>
  </PaperPanel>
</template>
