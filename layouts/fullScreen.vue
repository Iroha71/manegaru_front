<template>
    <div class="root">
        <b-loading is-full-page :active.sync="$store.getters['api/isLoading']" />
        <div class="hero is-fullheight">
            <nuxt />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.hero {
    max-height: 100vh;
}
</style>