<template>
  <span
    class="sl-icon"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="miter"
    >
      <polyline
        v-if="name === 'chevron'"
        points="6 9 12 15 18 9"
      />
      <template v-else-if="name === 'arrow-right'">
        <line
          x1="5"
          y1="12"
          x2="18"
          y2="12"
        />
        <polyline points="12 5 19 12 12 19" />
      </template>
      <template v-else-if="name === 'arrow-long'">
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
        />
        <polyline points="13 6 19 12 13 18" />
      </template>
      <template v-else-if="name === 'arrow-left'">
        <line
          x1="19"
          y1="12"
          x2="6"
          y2="12"
        />
        <polyline points="12 5 5 12 12 19" />
      </template>
      <polyline
        v-else-if="name === 'chevron-right'"
        points="9 6 15 12 9 18"
      />
      <polyline
        v-else-if="name === 'chevron-left'"
        points="15 6 9 12 15 18"
      />
      <polygon
        v-else-if="name === 'funnel'"
        points="3 5 21 5 14 13 14 19 10 21 10 13"
      />
      <template v-else-if="name === 'eye'">
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
        <circle
          cx="12"
          cy="12"
          r="3"
        />
      </template>
      <template v-else-if="name === 'eye-off'">
        <path d="M2 12s3.6-6 10-6c1.6 0 3 .4 4.2 1" />
        <path d="M20.5 9.2c1 1 1.5 1.8 1.5 1.8s-3.6 6-10 6c-1.6 0-3-.4-4.2-1" />
        <line
          x1="4"
          y1="20"
          x2="20"
          y2="4"
        />
      </template>
      <template v-else-if="name === 'close'">
        <line
          x1="5"
          y1="5"
          x2="19"
          y2="19"
        />
        <line
          x1="19"
          y1="5"
          x2="5"
          y2="19"
        />
      </template>
      <template v-else>
        <line
          x1="4"
          y1="6"
          x2="20"
          y2="6"
        />
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
        />
        <line
          x1="4"
          y1="18"
          x2="20"
          y2="18"
        />
      </template>
    </svg>
  </span>
</template>

<script setup lang="ts">
// The four glyphs the design hand-writes as inline SVG rather than pulling from
// Streamline: they use square caps and mitre joins at stroke-width 2, and are
// deliberately NOT stroke-scaled like <SlIcon>. Reused dozens of times across
// the nav, mobile menu and carousels.
defineProps<{
  name:
    | 'chevron'
    | 'chevron-right'
    | 'chevron-left'
    | 'arrow-right'
    | 'arrow-long'
    | 'arrow-left'
    | 'funnel'
    | 'eye'
    | 'eye-off'
    | 'close'
    | 'bars'
}>()
</script>
