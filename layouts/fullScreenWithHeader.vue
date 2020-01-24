<template lang="html">
    <div class="root">
        <b-loading is-full-page :active.sync="$store.getters['api/isLoading']" />
        <b-navbar type="is-primary"></b-navbar>
        <div class="hero is-fullheight-with-navbar">
            <nuxt />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.columns {
    margin: 0;
    height: calc(100vh - 3.25rem);
}
</style>