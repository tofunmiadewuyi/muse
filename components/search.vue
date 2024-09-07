<template>
  <div class="w-full relative flex justify-center" ref="container">
    <div class="input w-full max-w-[320px] relative">
      <i class="ri-search-line search-icon"></i>
      <input
        type="text"
        ref="searchEl"
        v-model="search"
        placeholder="Search Spotify"
        class="search-input"
        @focus="handleFocus"
      />
    </div>
    <div v-show="isSearching" class="search-results">
      <p>Serach results</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const search = ref<string>();
const isSearching = ref(false);

const searchEl = ref();
const container = ref();

const handleFocus = (event: any) => {
  isSearching.value = true;
  window.addEventListener("click", (event) => listener(event));
};

const listener = (event: MouseEvent) => {
  if (container.value) {
    if (!container.value.contains(event.target)) {
      isSearching.value = false;
      window.removeEventListener("click", listener);
    }
  }
};
</script>

<style scoped>
.search-input {
  @apply bg-[var(--grey)] rounded-[16px] py-2 pl-8 w-full;
}

.search-icon {
  @apply text-[20px] leading-[20px] absolute top-1/2 -translate-y-1/2 text-[var(--grey-dark)] left-2;
}

.search-results {
  @apply p-6 rounded-[32px] absolute top-[110%] w-full max-w-[840px];
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.07);
  animation: slideDown 500ms var(--power2-out);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
