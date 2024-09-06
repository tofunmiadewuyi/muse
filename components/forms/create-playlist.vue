<template>
    <div >
        <form @submit.prevent="handleCreate" class="grid grid-cols-1 gap-3">
            <div>
                <label class="label" for="name" >Playlist name</label>
                <input class="input" id="id" v-model="name" placeholder="New playlist name" type="text"></input>
            </div>
            <div>
                <label class="label" for="desc" >Playlist name</label>
                <textarea class="input" id="desc" v-model="desc" rows="4" placeholder="A short descrpiption of this playlist."></textarea>
            </div>
            <button class="btn">Create</button>
        </form>
    </div>
</template>

<script setup lang="ts">
const name = ref();
const desc = ref()

const handleCreate = async () => {
    const {createPlaylist} = useSpotify();
    const data = await createPlaylist(name.value, desc.value);
    if (data) {
        useToast('Playlist created successfully')
    }
}
</script>

<style lang="css" scoped>
textarea {
    @apply rounded-xl px-3 w-full;
    border: 1px solid rgba(0,0,0,0.07)

}

label {
    font-size: 12px;
    letter-spacing: -0.3px;
    color: var(--grey-dark)
}

input {
    @apply rounded-xl h-12 px-3 w-full;
    border: 1px solid rgba(0,0,0,0.07)
}
</style>