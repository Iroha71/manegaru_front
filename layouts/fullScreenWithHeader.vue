<template lang="html">
    <div class="root">
        <b-loading is-full-page :active.sync="$store.getters['api/isLoading']" />
        <Header />
        <div class="hero is-fullheight-with-navbar">
            <nuxt />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
    components: {
        Header
    }
}
</script>

<style lang="scss" scoped>
.columns {
    margin: 0;
    height: calc(100vh - 3.25rem);
}
</style>