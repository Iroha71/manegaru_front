<template>
    <div :class="setWindowStyle()">
        <div class="name-area" v-if="name"><span :style="{ border: `solid 0.25rem ${borderColor}` }">{{ name }}</span></div>
        <article class="text-area-back" :style="{ background: backColor }"></article>
        <article class="text-area side-center has-text-left" :style="{ border: `solid 0.25rem ${borderColor}` }">
            <Atext :message="text" />
        </article>
    </div>
</template>

<script>
import Atext from '@/components/parts/AnimeText.vue'
export default {
    props: {
        width: {
            type: String,
            required: false,
            default: 'is-7'
        },
        name: {
            type: String,
            required: false,
            default: ''
        },
        text: {
            type: String,
            required: true
        },
        borderColor: {
            type: String,
            required: false,
            default: '#3B63AF'
        },
        backColor: {
            type: String,
            required: false,
            default: '#fff'
        },
        isCenter: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    components: {
        Atext
    },
    methods: {
        setWindowStyle() {
            const position = this.isCenter || this.$device.isMobile ? 'side-center' : ''
            return `message-window column ${this.width} ${position}`
        },
    }
}
</script>

<style lang="scss" scoped>
.message-window {
    position: absolute;
    z-index: 2;
    height: 25vh;
    bottom: 5%;
    padding: 0;
    .name-area {
        position: absolute;
        z-index: 2;
        span {
            font-family: 'LightNovel';
            height: 2rem;
            padding: 0.5rem;
            background: #fff;
            font-size: 1.2rem;
            border-radius: 240px 15px 100px 15px / 15px 200px 15px 185px;
        }
    }
    article {
        height: calc(25vh - 2rem);
        width: 100%;
        padding: 0.75rem;
        padding-top: 2.25rem;
        position: absolute;
        &.text-area-back {
            border-radius: 20px 15px 100px 15px / 15px 200px 15px 185px;
        }
        &.text-area {
            font-size: 1.5rem;
            width: 98%;
            border-radius: 15px 200px 15px 185px / 240px 15px 100px 15px;
            background: #fff;
            z-index: 1;
        }
    }
}
.side-center {
    right: 0;
    left: 0;
    margin: auto;
}
</style>