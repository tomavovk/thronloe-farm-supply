<template>
  <div class="flex min-h-screen flex-col">
    <!-- The announce bar scrolls away; only the header is sticky (design .site-header). -->
    <AppAnnounceBar />
    <AppHeader />

    <main class="flex flex-1 flex-col">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
