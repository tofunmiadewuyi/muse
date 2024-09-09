<template>
  <div>
    <NuxtLoadingIndicator color="black" :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import "remixicon/fonts/remixicon.css";

useSeoMeta({
    title: 'Muse',
    ogTitle: 'Muse',
    description: 'Listen & Enjoy Anywhere.',
    ogDescription: 'Listen & Enjoy Anywhere',
    ogImage: '~/public/images/opengraph.png',
    twitterCard: 'summary_large_image'
  } as Parameters<typeof useSeoMeta>[0],)
</script>
