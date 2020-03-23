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
import { mapGetters } from 'vuex'

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
    const girlId = this.$store.getters['girl/currentGirl'].id
    if(this.$store.getters['application/greetingCount'] <= 1) {
      this.serifus = await this.$store.dispatch('girl/getSerifuSet', { girlId: girlId, situations: 'greeting,touch' })
      this.girlCurrentEmote = this.serifus.greeting.emotion
      this.serifu = this.serifus.greeting.text
      if(this.$store.getters['option/isPlayVoice']) {
        this.$buefy.dialog.confirm({
          message: '音声が出ます',
          onConfirm: () => { this.voiceType = 'greeting' }
        })
      }
    } else {
      this.serifus = await this.$store.dispatch('girl/getSerifuSet', { girlId: girlId, situations: 'greeting,touch'})
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
    changeEmote() {
        this.serifu = this.serifus.touch.text
        this.girlCurrentEmote = this.serifus.touch.emotion
        if(this.$store.getters['option/isPlayVoice']) {
          this.voiceType = 'touch'
        }
        setTimeout(() => {
          this.serifu = ''
          this.girlCurrentEmote = this.serifus.greeting.emotion
        }, 5000)
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('girl', ['currentGirl'])
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