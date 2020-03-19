<template>
    <span>
        <img :style="{ backgroundImage: `url(/characters/${code}/body.png)` }" 
            :src="`/characters/${code}/${currentEmote}.png`"
            @click="touchEvent()" />
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
        },
        isOverVoice: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            currentEmote: this.emote,
            isLipOpen: false,
            lipSyncManager: {}
        }
    },
    methods: {
        touchEvent() {
            this.$emit('click')
        },
        syncLip() {
            this.currentEmote = this.emote + '_open'
        }
    },
    watch: {
        isOverVoice() {
            if(this.isOverVoice) {
                this.syncLip()
            } else {
                clearInterval(this.lipSyncManager)
                this.currentEmote = this.emote
            }
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