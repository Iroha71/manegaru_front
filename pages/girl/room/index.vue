<template>
<div class="section">
    <div class="container">
        <div class="columns is-multiline">
            <div v-for="result in results"
                :key="result.id" class="column is-3"
                :class="{ 'mobile': $device.isMobile }"
                @click="$router.push($url.roomChild.build(result.id))">
                <picture>
                    <source :srcset="`/characters/${result.girl.code}/all.webp`" type="image/webp" />
                    <img :src="`/characters/${result.girl.code}/all.png`" />
                </picture>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    layout: 'fullScreenWithHeader',
    async asyncData({ app }) {
        const result = await app.$api.userGirl.index(null)
        return { results: result.data }
    }
}
</script>

<style lang="scss" scoped>
.column {
    height: 70vh;
    overflow: hidden;
    padding: calc(0.5rem + 3px);
    cursor: pointer;
    img {
        height: 100%;
        max-width: initial;
    }
    &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: -1;
        height: 70vh;
        border: solid 3px #0078dd;
        transform: skewY(-5deg);
        width: 25%;
    }
    &.mobile::before {
        width: 100% !important;
    }
}
</style>