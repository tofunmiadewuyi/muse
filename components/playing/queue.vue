<template>
  <div class="album p-5 rounded-[24px] bg-[var(--grey)] w-[320px] relative">
    <button
      @click="() => (expanded = !expanded)"
      class="hover:bg-black/10 flex items-center justify-center h-8 w-8 rounded-xl absolute top-5 right-5"
    >
      <i
        v-if="expanded"
        class="ri-arrow-down-s-line text-[20px] leading-[20px]"
      ></i>
      <i v-else class="ri-arrow-up-s-line text-[20px] leading-[20px]"></i>
    </button>

    <div>
      <div class="flex gap-1 pb-1 items-center text-[var(--grey-dark)]">
        <i class="ri-play-list-2-fill text-[20px] leading-[20px]"></i>
        <p>Next</p>
      </div>
      <p v-show="!expanded">Song 1</p>
    </div>

    <div class="expandable wrapper" :class="{ open: expanded }">
      <div class="inner">
        <div class="content flex flex-col gap-2 mt-2">
          <NuxtLink class="song">Song 1</NuxtLink>
          <NuxtLink class="song">Song 2</NuxtLink>
          <NuxtLink class="song">Song 3</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false);
</script>

<style scoped>
.album {
  transition: all 300ms ease;
}

.song {
  @apply px-2.5 py-2 rounded-xl bg-black/5 hover:bg-black/15 cursor-pointer transition;
}

.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 1s var(--expo-out);
}

.wrapper.open {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
}
</style>
