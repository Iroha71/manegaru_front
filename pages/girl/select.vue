<template>
<div>
    <div class="section">
        <div v-for="(girl, index) in girls"
            :key="girl.id"
            :style="getPosition(index)"
            class="column is-4-desktop is-4-tablet is-12-mobile">
            <transition name="fade" mode="out-in">
                <img v-if="(centeredIndex-index)<=0" :src="`/characters/${girl.code}/all.png`" />
            </transition>
        </div>
        <MessageWindow :name="selectedGirl.name" :text="selectedGirl.detail" />
    </div>
    <div class="controll-area column is-2 is-offset-5-desktop is-8-touch is-offset-2-touch">
        <b-button type="is-danger" @click="sendGirlPosition('prev')">前</b-button>
        <b-button type="is-primary" @click="sendGirlPosition('next')">次</b-button>
    </div>
</div>
</template>
<script>
import MessageWindow from '@/components/MessageWindow.vue'
export default {
    layout: 'fullScreen',
    components: {
        MessageWindow
    },
    async asyncData({store, route}) {
        const girls = await store.dispatch('girl/index', route.query.isFirst)
        return { girls: girls }
    },
    data() {
        return {
            moveDistance: 100,
            currentDistance: 100,
            centeredIndex: 0
        }
    },
    methods: {
        getPosition(index) {
            const layer = this.centeredIndex - index
            const zIndex = `z-index: ${layer};`
            const position = `transform: translate3d(${this.currentDistance}%, 0, ${layer * 50}px);`
            return zIndex + position
        },
        sendGirlPosition(sendType) {
            if(sendType === 'next' && this.centeredIndex < this.girls.length -1) {
                this.currentDistance -= this.moveDistance
                this.centeredIndex += 1
            } else if(sendType === 'prev' && this.centeredIndex > 0) {
                this.currentDistance += this.moveDistance
                this.centeredIndex -= 1
            }
        }
    },
    computed: {
        selectedGirl() {
            return this.girls[this.centeredIndex]
        }
    }
}
</script>

<style lang="scss" scoped>
.section {
    height: 100vh;
    padding-bottom: 0;
    display: flex;
    perspective: 150px;
    .column {
        overflow: visible;
        transition: .5s;
        padding-bottom: 0;
        img {
            position: absolute;
            bottom: 0;
            height: 90vh;
            max-width: initial;
            filter: drop-shadow(5px 0 0 #000);
        }
    }
}
.controll-area {
    display: flex;
    justify-content: space-around;
    position: absolute;
    z-index: 1;
    bottom: 0;
}
.fade {
    &-enter-active, &-leave-active {
        transition: .3s;
    }
    &-enter, &-leave-to {
        opacity: 0;
    }
}
</style>