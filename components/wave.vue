<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888786">
    <path
      d="M5 7H7V17H5V7ZM1 10H3V14H1V10ZM9 2H11V20H9V2ZM13 4H15V22H13V4ZM17 7H19V17H17V7ZM21 10H23V14H21V10Z"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import { gsap } from "gsap/gsap-core";
const props = defineProps<{ playing: boolean }>();

const tl = ref<gsap.core.Timeline | null>(null);

function createAnimation() {
  tl.value = gsap.timeline({ repeat: -1, yoyo: true }).to("svg path", {
    duration: 0.5,
    attr: {
      d: "M5 9H7V15H5V9ZM1 11H3V13H1V11ZM9 4H11V18H9V4ZM13 2H15V24H13V2ZM17 5H19V19H17V5ZM21 11H23V13H21V11Z",
    },
    ease: "power1.inOut",
  });

  tl.value.pause();
}

watch(
  () => props.playing,
  (playing) => {
    if (playing) {
      tl.value?.play();
    } else {
      tl.value?.pause();
    }
  }
);

onMounted(() => {
  createAnimation();
});
</script>

<style scoped>
svg {
  width: 20px;
  height: 20px;
}
</style>
