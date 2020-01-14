<template>
  <div class="root">
    <b-navbar type="is-primary"></b-navbar>
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

<style lang="scss" scoped>
.columns {
  margin: 0;
  height: calc(100vh - 3.25rem);
  section.column {
    overflow-y: scroll;
  }
}
</style>
