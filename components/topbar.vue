<template>
  <div
    class="fixed top-0 left-0 right-0 flex gap-5 justify-between p-6 z-10 bg-white"
  >
    <NuxtLink to="/dashboard"
      ><img src="/images/logo.svg" class="" alt="muse logo"
    /></NuxtLink>

    <Search />

    <div class="avatar-container" ref="container">
      <button @click="handleClick" class="avatar"><p>TA</p></button>
      <div
        v-show="isMenuOpen"
        ref="menu"
        class="menu flex flex-col absolute p-3- rounded-3xl min-w-[240px] text-black overflow-hidden"
      >
        <div class="flex flex-col gap-2 p-3">
          <p class="font-semibold">{{ user.display_name }}</p>
          <p class="text-black/70 font-medium">{{ user?.email }}</p>
        </div>
        <div class="p-3 flex flex-col gap-3">
          <NuxtLink to="/logout" class="btn text-center">Log out</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logOut } from "~/composables/useAuth";
import type { SpotifyUser } from "~/types/assets";

const isMenuOpen = ref(false);

const menu = ref();

const container = ref();

const user = useCookie<SpotifyUser>("user");

const handleClick = () => {
  isMenuOpen.value = !isMenuOpen.value;
  window.addEventListener("click", (event) => listener(event));
};

const listener = (event: MouseEvent) => {
  if (menu.value) {
    if (
      !menu.value.contains(event.target) &&
      !container.value.contains(event.target)
    ) {
      isMenuOpen.value = false;
      window.removeEventListener("click", listener);
    }
  }
};
</script>

<style scoped>
.avatar-container {
  position: relative;
}
.avatar {
  width: 32px;
  height: 32px;
  background-color: black;
  border-radius: 32px;
  color: white;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: -0.35px;
}

.menu {
  transition-property: all;
  animation: slideIn 0.3s var(--power2-out);
  top: 120%;
  right: 12px;
  background: rgba(255, 255, 255, 1);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(25, 25, 25, 0.1);
}

@keyframes slideIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 100;
  }
}
</style>
