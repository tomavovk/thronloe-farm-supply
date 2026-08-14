<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!-- App shell for the account and auth screens (design `body.app-view`): no
         announce bar, no footer, the header framed top and bottom, and the page
         itself scrolls inside the viewport rather than the document. -->
    <div class="border-line border-y">
      <AppHeader />
    </div>

    <main class="min-h-0 flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
