<template>
  <teleport to="#teleports">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-white backdrop-blur-sm bg-opacity-50"
    >
      <div class="modal bg-[white] rounded-3xl shadow-lg overflow-auto">
        <div
          class="title flex justify-between items-center border-b border-black/5 p-4"
        >
          <h2 class="">{{ title }}</h2>
          <button
            @click="closeModal"
            class="bg-black/5 hover:bg-black/10 flex items-center justify-center h-8 w-8 rounded-xl"
          >
            <i class="ri-close-fill text-[20px] leading-[20px]"></i>
          </button>
        </div>

        <div class="p-4">
          <slot>The modal content</slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const { isOpen, title } = defineProps<{ isOpen: Boolean; title: string }>();

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
.modal {
  width: 320px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px) scale(0.85);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 100;
  }
}
</style>
