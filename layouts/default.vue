<template>
  <div class="root">
    <b-loading is-full-page :active.sync="$store.getters['api/isLoading']" />
    <Header />
    <div class="hero is-fullheight-with-navbar">
      <div class="columns">
        <div class="column is-2 has-background-grey-light">
          <aside class="menu">
            <p class="menu-label">メニュー</p>
            <ul><li>リスト</li></ul>
          </aside>
        </div>
        <section class="column">
          <nuxt />
        </section>
      </div>
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
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
    &-track { 
      border-radius: 10px;
      background: #fff;
    }
    &-thumb {
      border-radius: 10px;
      background: #09c9d9;
    }
  }
}
</style>
