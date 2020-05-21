<template lang="html">
  <div class="columns" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="column is-6 chara-area">
      <Character :code="currentUser.girl.code"
        :emote="girlCurrentEmote"
        :voice="voiceType"
        @click="changeEmote()"
        @voiceEnded="resetSerifu()" />
      <MessageWindow :name="currentUser.girl.name"
        :text="serifu" width="is-6"
        :isCenter="false"
        :borderColor="currentUser.girl.color"/>
    </div>
    <div v-if="!$device.isMobile" class="column is-6 right-content-area">
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
      <section v-if="!$device.isMobile" class="section">
        <b-button type="is-primary task" @click="$router.push('/task')">
          <img src="/icons/bundle_task.png" />
          <p>タスク</p>
        </b-button>
        <b-button type="is-info" class="girl sub-content" @click="$router.push('/girl/select')">
          <img :src="`/characters/${currentUser.girl.code}/icon.png`" />
          <p>秘書</p>
        </b-button>
        <b-button type="is-success" class="room sub-content" @click="$router.push('/girl/room/')">
          <img src="/icons/garden.png" />
          <p>部屋</p>
        </b-button>
        <b-button type="is-danger" class="option sub-content" @click="$router.push('/option/')">
          <img src="/icons/setting.png" />
          <p>設定</p>
        </b-button>
      </section>
    </div>
    <b-field v-if="$device.isMobile" class="menu-area-mobile">
      <b-button type="is-primary" size="is-large" @click="$router.push('/task')">タスク</b-button>
      <b-button type="is-info" size="is-large" @click="$router.push('/girl/select')">秘書</b-button>
      <b-button type="is-success" size="is-large" @click="$router.push($url.room)">部屋</b-button>
      <b-button type="is-danger" size="is-large" @click="$router.push('/option/')">設定</b-button>
    </b-field>
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
    const now = new Date()
    const weekOfDays = ['日', '月', '火', '水', '木', '金', '土']
    const weekOfDay = weekOfDays[now.getDay()]
    const arrangedToday = `${now.getMonth() + 1}月${now.getDate()}日(${weekOfDay})`
    this.today = arrangedToday
    if(!this.$store.getters['application/isAllowedSound'] && this.$store.getters['option/isPlayVoice']) {
      this.$buefy.dialog.confirm({
        message: '音声が出ます',
        onConfirm: () => { 
          this.$store.dispatch('application/setIsAllowedSound', true)
          this.loadSerifu()
        }
      })
    }
  },
  async mounted() {
    console.log(this.$url.root)
    if(this.$store.getters['application/isAllowedSound'])
      this.loadSerifu()
  },
  data() {
    return {
      backgroundUrl: '/images/bg-top.webp',
      today: null,
      girlCurrentEmote: 'normal',
      serifus: [],
      serifu: '',
      voiceType: ''
    }
  },
  methods: {
    ...mapActions('application', ['fetchTopVisitedAt']),
    ...mapActions('user', ['setLoggedUser']),
    changeEmote() {
      this.playSerifu('touch')
    },
    playSerifu(situation) {
      if(situation === "") {
        return false
      }
      this.serifu = this.serifus[situation].text
      this.girlCurrentEmote = this.serifus[situation].emotion
      if(this.isAllowedSound && this.isPlayVoice) {
        setTimeout(() => { this.voiceType = situation }, 500)
      }
    },
    async loadSerifu() {
      const situation = this.getSerifuSituation()
      let [ serifus, userInfo ] = await Promise.all([
        this.$api.serifu.index({ girl_id: this.currentUser.girl.id, situation: situation.set }),
        this.$api.user.show(this.currentUser.id)
      ])
      this.serifus = serifus.data
      this.setLoggedUser(userInfo.data)
      this.playSerifu(situation.justPlay)
    },
    resetSerifu() {
      this.voiceType = ''
      setTimeout(() => {
        this.serifu = ''
        this.girlCurrentEmote = 'normal'
      }, 500)
    },
    getSerifuSituation() {
      let requestSituation = ''
      let playSituation = ''
      if(this.$route.query.status === 'finishedTask') {
        requestSituation = 'greeting,finished_task,touch'
        playSituation = 'finished_task'
      } else if(this.greetingCount <= 1) {
        requestSituation = 'greeting,touch'
        playSituation = 'greeting'
      } else {
        requestSituation = 'touch'
        if(this.isRevisitSite()) {
          requestSituation += ',greeting2'
          playSituation = 'greeting2'
        }
      }
      return { set: requestSituation, justPlay: playSituation }
    },
    isRevisitSite() {
      const REVISIT_MINUTE = 10
      const now = new Date()
      const beforeVisitedAt = new Date(this.topVisitedAt)
      const elapseMinute = (now.getTime() - beforeVisitedAt.getTime()) / (1000 * 60)
      if(elapseMinute >= REVISIT_MINUTE) {
        this.fetchTopVisitedAt(now)
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('application', ['topVisitedAt', 'greetingCount', 'isAllowedSound']),
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
    display: flex;
    justify-content: center;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .content-area {
    margin: auto;
  }
  .menu-area-mobile {
    position: absolute;
    z-index: 2;
    bottom: 0;
  }
  .right-content-area {
    position: relative;
    .section {
      button {
        position: absolute;
        border-radius: 50%;
        height: 10rem;
        width: 10rem;
        margin: auto;
        &.sub-content {
          height: 8rem;
          width: 8rem;
        }
        img {
          height: 5rem;
          width: auto;
        }
        &.task {
          top: 50%;
          left: 30%;
        }
        &.girl {
          top: 50%;
          left: 55%;
          
        }
        &.room {
          top: 70%;
          left: 50%;
        }
        &.option {
          top: 75%;
          left: 30%;
        }
      }
    }
  }
}
</style>