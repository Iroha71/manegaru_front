<template>
  <div :class="`column ${size}`">
    <div class="card" @click="executeParentEvent()">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
      </header>
      <div class="card-content">
        <div class="content has-text-centered">
          <slot name="content" />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <span>
            <slot name="footer" />
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    executeParentEvent() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  cursor: pointer;
}
</style>
