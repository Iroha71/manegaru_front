<template lang="html">
    <div class="root">
        <b-loading is-full-page :active.sync="$store.getters['api/isLoading']">
            <flower-spinner
                :animation-duration="1500"
                :size="70"
                color="#EA5B52" />
        </b-loading>
        <Header />
        <div class="hero is-fullheight-with-navbar">
            <nuxt />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { FlowerSpinner } from 'epic-spinners'
export default {
    components: {
        Header,
        FlowerSpinner
    }
}
</script>

<style lang="scss" scoped>
.columns {
    margin: 0;
    height: calc(100vh - 3.25rem);
}
</style>