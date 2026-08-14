<template>
  <div :class="gridClass">
    <div
      v-for="n in count"
      :key="n"
      class="flex flex-col"
    >
      <!-- Same square media + two text lines as ProductCard, so nothing shifts
           when the real cards arrive. -->
      <div class="mb-4 aspect-square w-full">
        <VoltSkeleton height="100%" />
      </div>
      <VoltSkeleton
        width="80%"
        height="1rem"
        class="mb-2"
      />
      <VoltSkeleton
        width="4rem"
        height="1.125rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    gridClass?: string
  }>(),
  {
    count: 6,
    gridClass: 'grid min-w-0 grid-cols-2 gap-x-4 gap-y-16 md:grid-cols-3',
  },
)
</script>
