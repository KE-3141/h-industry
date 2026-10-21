<script setup lang="ts">
const { clients } = useSiteContent()
</script>

<template>
  <section class="py-16 md:py-20 bg-neutral-50">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <SectionHeading title="主要取引先" class="mb-10" />
      <TagRows :items="clients" />
    </div>
  </section>
</template>
