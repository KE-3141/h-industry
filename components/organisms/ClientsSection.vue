<script setup lang="ts">
const { clients } = useSiteContent()
</script>

<template>
  <section class="py-16 md:py-20 bg-neutral-50">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <SectionHeading label="Clients" title="主要取引先" class="mb-10" />
      <ul class="flex flex-wrap justify-center gap-3">
        <li v-for="client in clients" :key="client">
          <TagBadge variant="neutral">{{ client }}</TagBadge>
        </li>
      </ul>
    </div>
  </section>
</template>
