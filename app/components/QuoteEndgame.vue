<script setup lang="ts">
import { catalog } from '~/domain/catalog'
import { ENDGAME_ADDON, ENDGAME_COUNTDOWN_MINUTES, endgamePhase } from '~/domain/endgame'
import { updateUrl } from '~/domain/gift'
import { updateCover } from '~/domain/unlocks'

import type { EndgamePhase } from '~/domain/endgame'

const { format } = useMoney()
const { app } = useRuntimeConfig()

const IMAGE_SIZE = 640

/** The stored images live under the site's base path, wherever it is deployed. */
const imageUrl = `${app.baseURL}${updateCover(ENDGAME_ADDON.update)}`

const scheduledEnd = new Date(catalog.campaignEnd)

/**
 * "Thursday 15 October at 20:00 UTC", put together part by part in one fixed locale and zone,
 * so the page rendered at build time and the visitor's browser say the same to the letter.
 */
const beginsAt = ((): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }).formatToParts(scheduledEnd)
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((candidate) => candidate.type === type)?.value ?? ''
  return `${part('weekday')} ${part('day')} ${part('month')} at ${part('hour')}:${part('minute')} UTC`
})()

/**
 * Whether the Endgame has begun. The page is built ahead of time, so this starts as it was at
 * the build, which the browser is handed with the page, and is brought up to the minute once
 * the page is running.
 */
const phase = useState<EndgamePhase>('endgame-phase', () =>
  endgamePhase(catalog.campaignEnd, new Date()),
)

/** The same moment by the visitor's own clock, which only their browser knows. */
const localTime = ref<string | null>(null)

onMounted(() => {
  phase.value = endgamePhase(catalog.campaignEnd, new Date())
  localTime.value = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(scheduledEnd)
})

const hasBegun = computed<boolean>(() => phase.value === 'begun')
</script>

<template>
  <PaperPanel
    :title="hasBegun ? 'The Endgame' : 'Coming in the Endgame'"
    icon="i-fa-clock"
  >
    <div class="flex gap-3 border border-default bg-elevated/40 p-3 sm:gap-4">
      <img
        :src="imageUrl"
        :alt="ENDGAME_ADDON.name"
        :width="IMAGE_SIZE"
        :height="IMAGE_SIZE"
        loading="lazy"
        decoding="async"
        class="size-20 shrink-0 border border-default object-cover sm:size-24"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-1.5">
        <div class="flex items-start justify-between gap-3">
          <h4 class="text-sm leading-snug font-semibold text-highlighted sm:text-base">
            {{ ENDGAME_ADDON.name }}
          </h4>
          <p class="shrink-0 text-right text-base font-bold text-highlighted">
            {{ format(ENDGAME_ADDON.price) }}
            <span class="block text-xs font-normal text-muted"
              >{{ format(ENDGAME_ADDON.priceAfter) }} afterwards</span
            >
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <UBadge
            label="Endgame add-on"
            color="primary"
            variant="subtle"
            size="sm"
          />
          <UBadge
            :label="hasBegun ? 'On sale while the Endgame lasts' : 'Not on sale yet'"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
        <p class="text-xs text-muted">
          A poker deck in red and gold, with the characters of Gang Wars on its cards: a keepsake
          and, the campaign says, something to play Gang Wars with once its next stretch goal is
          unlocked.
          <template v-if="hasBegun">
            It went on sale when the Endgame began, on {{ beginsAt }}, at
            {{ format(ENDGAME_ADDON.price) }} for as long as the Endgame lasts; afterwards it is
            {{ format(ENDGAME_ADDON.priceAfter) }}, in the pledge manager. This calculator’s
            catalogue was read before then, so the deck is not in the order above: add it on
            Gamefound yourself.
          </template>
          <template v-else>
            It goes on sale the moment the Endgame begins, on {{ beginsAt
            }}<template v-if="localTime !== null"> ({{ localTime }} for you)</template>, at
            {{ format(ENDGAME_ADDON.price) }}; once the Endgame is over it is
            {{ format(ENDGAME_ADDON.priceAfter) }}, in the pledge manager. It is not on sale yet, so
            it is not in the order above.
          </template>
        </p>
      </div>
    </div>

    <p class="mt-4 text-xs text-muted">
      <span class="font-semibold text-highlighted">How the Endgame works.</span>
      The campaign does not close at its scheduled end. A {{ ENDGAME_COUNTDOWN_MINUTES }}-minute
      countdown starts then, and each backer’s first purchase after that puts it back to
      {{ ENDGAME_COUNTDOWN_MINUTES }} minutes; the campaign is over when it runs out. So it stays
      open for as long as people keep buying, and nobody can say for how long.
      <ULink
        :to="updateUrl(ENDGAME_ADDON.update)"
        target="_blank"
        class="text-primary underline underline-offset-2 hover:no-underline"
        >Campaign Update #{{ ENDGAME_ADDON.update }}</ULink
      >.
    </p>
  </PaperPanel>
</template>
