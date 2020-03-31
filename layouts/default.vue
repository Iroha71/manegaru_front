<template>
  <div class="root">
    <b-loading is-full-page :active.sync="$store.getters['api/isLoading']" :class="{ 'trans-background': $route.path=='/task/' }">
      <flower-spinner
        :animation-duration="1500"
        :size="70"
        color="#FED983" />
    </b-loading>
    <Header />
    <div class="hero is-fullheight-with-navbar">
      <div class="columns">
        <div class="column is-2 has-background-grey-dark has-text-white">
          <Sidemenu />
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
import Sidemenu from '@/components/Sidemenu.vue'
import { FlowerSpinner } from 'epic-spinners'
export default {
  components: {
    Header,
    Sidemenu,
    FlowerSpinner
  }
}
</script>

<style lang="scss" scoped>
.columns {
  margin: 0;
  height: calc(100vh - 3.25rem);
  overflow-y: auto;
  .column {
    overflow-y: auto;
  }
  &::-webkit-scrollbar, .column::-webkit-scrollbar {
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
