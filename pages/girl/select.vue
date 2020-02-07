<template>
    <div class="section">
        <div v-for="(girl, index) in girls"
            :key="girl.id"
            :style="getPosition(index)"
            class="column is-4">
            <img v-if="(centeredIndex-index)<=0" :src="`/characters/${girl.code}/all.png`" />
        </div>
        <b-button type="is-danger" @click="sendGirlPosition('prev')">前</b-button>
        <b-button type="is-primary" @click="sendGirlPosition('next')">次</b-button>
    </div>
</template>
<script>
export default {
    layout: 'fullScreen',
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
        img {
            height: 90vh;
            max-width: initial;
        }
    }
}
</style>