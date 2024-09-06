<template>
  <div class="flex flex-col gap-8">
    <div class="container">
      <NuxtLink
        to="/playlists"
        class="text-[120px] hover:scale-110 transition-transform duration-150 ease-in"
      >
        <i class="ri-play-list-fill"></i>
      </NuxtLink>
      <Modal
        :isOpen="isModalOpen"
        @close="() => (isModalOpen = false)"
        title="Test Modal"
      >
        <div>This is my modal content</div>
      </Modal>
      <div class="flex flex-col gap-2">
        <p>Playlists</p>
        <p class="text-[var(--grey-dark)]">Create & Manage</p>
      </div>
      <button
        @click="() => (isModalOpen = true)"
        class="p-2 h-9 w-9 rounded-[12px] bg-black/15 absolute top-6 right-6"
      >
        <i class="ri-add-line text-[20px] leading-[20px]"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const isModalOpen = ref(false);
</script>

<style scoped lang="css">
.container {
  --container: 320px;
  width: var(--container);
  height: var(--container);
  background-color: var(--grey);
  border-radius: calc(var(--container) / 6.4);
  position: relative;
  box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 5%);
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  text-align: center;
  /* overflow: hidden; */
  transition: transform 300ms ease;
  perspective: 800px;
  padding: calc(var(--container) / 10);
  font-size: 16px;
  letter-spacing: -0.4px;
}
</style>
