<template>
  <div></div>
</template>

<script setup lang="ts">
const dragValue = ref(0);

function initializeGSAP() {
  Draggable.create(".knob", {
    type: "x",
    bounds: track.value,
    onClick: function () {
      console.log("knob clicked with gsap");
    },
    onDrag: function (event) {
      //   dragValue.value = this.x;
    },
    onDragEnd: function (event) {
      console.log("dragging stopped");
      dragValue.value = this.x;
      progress.value = (this.x / trackWidth) * 100;
    },
  });
}

const searchReq = computed(() => {
  if (genreFilter.value) {
    return {
      value: `${searchValue.value} `,
      query: {
        type: "artist,track",
        limit: 6,
      },
    };
  }
  if (popularityFilter.value) {
    return {
      value: searchValue.value,
      query: {
        type: "artist,album,track,playlist",
        limit: 3,
      },
    };
  }
});
</script>

<style scoped></style>
