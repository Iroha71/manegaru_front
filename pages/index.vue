<template lang="html">
  <div class="columns" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="column is-6 chara-area">
      <img :src="`/characters/${currentGirlCode}/all.png`" />
    </div>
    <div class="column is-6">
      <b-carousel :interval="8000">
        <b-carousel-item v-for="(banerInfo, i) in banerInfos" :key="i" class="has-text-centered">
          <section :class="`hero ${banerInfo.color}`">
            <div class="hero-body">
              <section class="content-area">
                <p class="subtitle">{{ banerInfo.label }}</p>
                <p class="title">{{ banerInfo.content }}</p>
              </section>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
      <section class="section menu-area has-text-centered">
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="タスク" size="is-large" />
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="秘書" size="is-large" />
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="箱庭" size="is-large" />
      </section>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/parts/IconButton.vue'
export default {
  layout: 'fullScreenWithHeader',
  components: {
    IconButton
  },
  created() {
    const ls = JSON.parse(localStorage.getItem('comcon'))
    this.currentGirlCode = ls.girl.currentGirl.code
    const now = new Date()
    const weekOfDays = ['日', '月', '火', '水', '木', '金', '土']
    const weekOfDay = weekOfDays[now.getDay()]
    const arrangedToday = `${now.getMonth() + 1}月${now.getDate()}日(${weekOfDay})`
    this.banerInfos[0].content = arrangedToday
  },
  data() {
    return {
      banerInfos: [
        { label: '今日は', content: null, color: 'is-success' },
        { label: '未着手タスク', content: '0', color: 'is-danger' },
        { label: '作業中タスク', content: '0', color: 'is-warning' }],
        backgroundUrl: "/images/bg-bloom.webp"
    }
  }
}
</script>

<style lang="scss" scoped>
.columns {
  overflow-y: auto;
  background-size: cover;
  background-position: center center;
  .chara-area {
    text-align: center;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    img {
      max-width: none;
      max-height: 100%;
    }
  }
  .content-area {
    margin: auto;
  }
  .menu-area {
    .menu-button {
      margin-bottom: 0.75rem;
      width: 80%;
    }
  }
}
</style>