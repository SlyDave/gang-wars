<script setup lang="ts">
import type { Quote } from '~/domain/quote'

/**
 * On a phone the choices come first and the answer is a long way below them, so the total
 * rides along at the foot of the screen with a way down to the cart.
 */
defineProps<{
  quote: Quote
}>()

const { format } = useMoney()
</script>

<template>
  <div
    v-if="quote.lines.length > 0"
    class="fixed inset-x-0 bottom-0 z-40 border-t-2 border-(--gw-line) bg-default/95 backdrop-blur lg:hidden"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
      <div>
        <p class="gw-label text-[0.65rem] text-muted">Total to pay</p>
        <p class="mt-1 gw-figure text-2xl leading-none text-highlighted gw-glow">
          {{ format(quote.total) }}
        </p>
      </div>
      <UButton
        to="#cart"
        external
        label="See the cart"
        icon="i-fa-cart"
        color="primary"
        variant="outline"
        class="gw-label text-xs"
      />
    </div>
  </div>
</template>
