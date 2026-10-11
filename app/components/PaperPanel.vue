<script setup lang="ts">
/** A sheet with a double rule and a heading: the container everything on the page sits in. */
defineProps<{
  title: string
  icon: string
}>()

defineSlots<{
  default: () => unknown
  /** Sits at the right-hand end of the heading. */
  aside?: () => unknown
}>()
</script>

<template>
  <section class="gw-frame">
    <div class="gw-frame-body p-4 sm:p-6">
      <header class="mb-5 flex items-center gap-3">
        <UIcon
          :name="icon"
          class="size-5 shrink-0 text-primary"
        />
        <h2 class="gw-title text-2xl text-primary sm:text-3xl">{{ title }}</h2>
        <!-- A dotted leader, as beside the headings of the campaign's tables. -->
        <span
          class="min-w-4 flex-1 border-t-2 border-dotted border-(--gw-line) opacity-50"
          aria-hidden="true"
        />
        <slot name="aside" />
      </header>
      <slot />
    </div>
  </section>
</template>
