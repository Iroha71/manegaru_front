<template lang="html">
  <div class="columns" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="column is-6 chara-area">
      <Character :code="currentGirlCode" :emote="girlCurrentEmote" @click="changeEmote()" />
    </div>
    <div class="column is-6">
      <b-carousel :interval="8000">
        <b-carousel-item class="has-text-centered">
          <section class="hero is-success">
            <div class="hero-body">
              <section class="content-area">
                <p class="subtitle">今日は</p>
                <p class="title">{{ today }}</p>
              </section>
            </div>
          </section>
        </b-carousel-item>
        <b-carousel-item class="has-text-centered">
          <section class="hero is-danger">
            <div class="hero-body">
              <section class="content-area">
                <p class="subtitle">未着手タスク</p>
                <p class="title">{{ yetTaskNum }}</p>
              </section>
            </div>
          </section>
        </b-carousel-item>
        <b-carousel-item class="has-text-centered">
          <section class="hero is-warning">
            <div class="hero-body">
              <section class="content-area">
                <p class="subtitle">作業中タスク</p>
                <p class="title">{{ workingTaskNum }}</p>
              </section>
            </div>
          </section>
        </b-carousel-item>
      </b-carousel>
      <section class="section menu-area has-text-centered">
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="タスク" size="is-large" @click="$router.push('/task')" />
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="秘書" size="is-large" @click="$router.push('/girl/select/')" />
        <IconButton class="menu-button" type="is-primary" iconName="checkbox" message="箱庭" size="is-large" />
      </section>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/parts/IconButton.vue'
import Character from '@/components/Character.vue'
export default {
  layout: 'fullScreenWithHeader',
  components: {
    IconButton,
    Character
  },
  mounted() {
    this.$store.dispatch('task/countNotFinishTasks')
      .then(taskCount => {
        this.yetTaskNum = taskCount.yet
        this.workingTaskNum = taskCount.working
      })
  },
  created() {
    const ls = JSON.parse(localStorage.getItem('comcon'))
    this.currentGirlCode = ls.girl.currentGirl.code
    const now = new Date()
    const weekOfDays = ['日', '月', '火', '水', '木', '金', '土']
    const weekOfDay = weekOfDays[now.getDay()]
    const arrangedToday = `${now.getMonth() + 1}月${now.getDate()}日(${weekOfDay})`
    this.today = arrangedToday
  },
  data() {
    return {
      yetTaskNum: 0,
      workingTaskNum: 0,
      backgroundUrl: '/images/bg-bloom.webp',
      today: null,
      girlCurrentEmote: 'normal'
    }
  },
  methods: {
    changeEmote() {
      this.girlCurrentEmote = this.girlCurrentEmote === 'normal' ? 'tere' : 'normal'
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