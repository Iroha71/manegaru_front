<template>
    <span>
        <img :style="{ backgroundImage: `url(/characters/${code}/body.png)` }" 
            :src="`/characters/${code}/${emote}.png`"
            @click="touchEvent">
    </span>
</template>

<script>
export default {
    props: {
        code: {
            type: String,
            required: true
        },
        emote: {
            type: String,
            required: true
        }
    },
    methods: {
        touchEvent() {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    background-position: center center;
    background-size: contain;
    height: 100%;
    max-width: initial;
}
</style>