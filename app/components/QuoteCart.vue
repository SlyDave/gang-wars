<script setup lang="ts">
import { catalog } from '~/domain/catalog'

import { LINES } from '~/domain/preferences'

import type { CartLine, Quote } from '~/domain/quote'
import type { GameLine } from '~/domain/types'

const props = defineProps<{
  quote: Quote
}>()

const groupName = (group: GameLine): string =>
  LINES.find(({ line }) => line === group)?.label ?? group

interface Section {
  readonly group: GameLine
  readonly entries: { readonly line: CartLine; readonly position: number }[]
}

/** The lines as they come — by game, then category, then name — cut into one run per game. */
const sections = computed<readonly Section[]>(() => {
  const result: Section[] = []
  for (const [index, line] of props.quote.lines.entries()) {
    const entry = { line, position: index + 1 }
    const current = result.at(-1)
    if (current?.group === line.group) {
      current.entries.push(entry)
    } else {
      result.push({ group: line.group, entries: [entry] })
    }
  }
  return result
})
</script>

<template>
  <PaperPanel
    id="cart"
    title="Add to your Gamefound cart"
    icon="i-fa-cart"
  >
    <template #aside>
      <UButton
        :to="catalog.source"
        target="_blank"
        label="Rewards page"
        trailing-icon="i-fa-arrow-up-right-from-square"
        color="primary"
        variant="ghost"
        size="xs"
        class="hidden sm:inline-flex"
      />
    </template>

    <p
      v-if="quote.lines.length === 0"
      class="py-6 text-center text-sm text-muted"
    >
      Nothing to add yet.
    </p>

    <template v-else>
      <p class="mb-4 text-xs text-muted">
        Add exactly these, one of each, to reproduce the order. They are listed game by game: the
        pledge or bundle first, then the add-ons by category.
      </p>
      <div class="grid grid-cols-1 gap-5">
        <section
          v-for="section in sections"
          :key="section.group"
        >
          <h3 class="mb-2 flex items-center gap-3 gw-label text-xs text-error">
            {{ groupName(section.group) }}
            <span
              class="flex-1 border-t-2 border-dotted border-(--gw-line) opacity-40"
              aria-hidden="true"
            />
          </h3>
          <ul class="grid grid-cols-1 gap-3">
            <CartLineCard
              v-for="{ line, position } in section.entries"
              :key="line.product.id"
              :line="line"
              :position="position"
            />
          </ul>
        </section>
      </div>
    </template>
  </PaperPanel>
</template>
