<template lang="html">
  <div class="columns" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="column is-6 chara-area">
      <Character :code="currentGirl.code"
        :emote="girlCurrentEmote"
        :voice="voiceType"
        @click="changeEmote()"
        @voiceEnded="voiceType=''" />
      <MessageWindow :name="currentGirl.name"
        :text="serifu" width="is-6"
        :isCenter="false"
        :borderColor="currentGirl.color"/>
    </div>
    <div v-if="!$device.isMobile" class="column is-6">
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
        <b-carousel-item v-if="!currentUser.is_cooped_line" class="has-text-centered">
          <section class="hero is-success">
            <div class="hero-body">
              <section class="content-area">
                <p>LINE BOTでタスクをお知らせできます！</p>
                <b-button type="is-info" @click="$router.push('/option/?currentTab=lineCoop')">オプション画面で設定</b-button>
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
import MessageWindow from '@/components/MessageWindow.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'fullScreenWithHeader',
  components: {
    IconButton,
    Character,
    MessageWindow
  },
  created() {
    this.$store.dispatch('api/startLoad')
    this.currentGirlCode = this.$store.getters['girl/currentGirl'].code
    const now = new Date()
    const weekOfDays = ['日', '月', '火', '水', '木', '金', '土']
    const weekOfDay = weekOfDays[now.getDay()]
    const arrangedToday = `${now.getMonth() + 1}月${now.getDate()}日(${weekOfDay})`
    this.today = arrangedToday
  },
  async mounted() {
    const now = new Date()
    if(this.greetingCount <= 1) {
      this.serifus = await this.getSerifuSet({girlId: this.currentGirl.id, situations: 'greeting,touch'})
      this.fetchTopVisitedAt(now)
      if(this.$store.getters['option/isPlayVoice']) {
        this.$buefy.dialog.confirm({
          message: '音声が出ます',
          onConfirm: () => { this.playSerifu('greeting', this.$store.getters['option/isPlayVoice']) }
        })
      } else { this.playSerifu('greeting', this.$store.getters['option/isPlayVoice']) }
    } else {
      this.serifus = await this.getSerifuSet({girlId: this.currentGirl.id, situations: 'greeting2,touch'})
      const storeTime = new Date(this.$store.getters['application/topVisitedAt'])
      const visitedElapsedHour = (now.getTime() - storeTime.getTime()) / (1000 * 60)
      if(visitedElapsedHour >= 10) {
        this.playSerifu('greeting2', this.$store.getters['option/isPlayVoice'])
      }
      this.fetchTopVisitedAt(now)
    }
    if(this.$route.query.status == 'finishedTask') {
      this.serifus = await this.getSerifuSet({girlId: this.currentGirl.id, situations: 'greeting,touch,finished_task'})
      this.playSerifu('finished_task', this.$store.getters['option/isPlayVoice'])
      setTimeout(() => {
        this.resetSerifu()
      }, 10000)
    }
  },
  data() {
    return {
      backgroundUrl: '/images/bg-bloom.webp',
      today: null,
      girlCurrentEmote: 'normal',
      serifus: [],
      serifu: '',
      voiceType: ''
    }
  },
  methods: {
    ...mapActions('girl', ['getSerifuSet']),
    ...mapActions('application', ['fetchTopVisitedAt']),
    changeEmote() {
      this.playSerifu('touch', this.isPlayVoice)
      setTimeout(() => {
        this.resetSerifu()
      }, 5000)
    },
    playSerifu(situation, isOverVoice) {
      this.girlCurrentEmote = this.serifus[situation].emotion
      this.serifu = this.serifus[situation].text
      if(isOverVoice) {
        setTimeout(() => { this.voiceType = situation }, 300)
      }
    },
    resetSerifu() {
      this.serifu = ''
      this.girlCurrentEmote = 'normal'
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('girl', ['currentGirl']),
    ...mapGetters('application', ['topVisitedAt', 'greetingCount']),
    ...mapGetters('option', ['isPlayVoice'])
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