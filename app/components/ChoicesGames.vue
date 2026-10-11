<script setup lang="ts">
import { LINES } from '~/domain/preferences'

const { preferences, setLine } = usePreferences()
</script>

<template>
  <PaperPanel
    title="Games"
    icon="i-fa-games"
  >
    <div class="grid grid-cols-1 gap-2">
      <ChoiceSwitch
        v-for="{ line, label, description, icon } in LINES"
        :key="line"
        :model-value="preferences.lines[line]"
        :label="label"
        :hint="description"
        :icon="icon"
        @update:model-value="setLine(line, $event)"
      />
    </div>

    <p class="mt-4 text-xs text-muted">
      Both come in English, French, Spanish or German, at the same price: you choose the language of
      each on Gamefound. Gang Wars will not be sold in shops, so this campaign and its late pledge
      are the only way to get it.
    </p>
  </PaperPanel>
</template>
