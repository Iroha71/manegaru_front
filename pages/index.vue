<template lang="html">
  <div class="columns" :style="{ backgroundImage: `url(${backgroundUrl})` }">
    <div class="column is-6 chara-area">
      <Character :code="currentGirl.code" :emote="girlCurrentEmote" @click="changeEmote()" :isOverVoice="isOverVoice" />
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
        <b-carousel-item v-if="!isCoopedLine" class="has-text-centered">
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
import { Howl } from 'howler'
let src = null
export default {
  layout: 'fullScreenWithHeader',
  components: {
    IconButton,
    Character,
    MessageWindow
  },
  async mounted() {
    const girlId = this.$store.getters['girl/currentGirl'].id
    if(this.$store.getters['application/greetingCount'] <= 1) {
      this.serifus = await this.$store.dispatch('girl/getSerifuSet', { girlId: girlId, situations: 'greeting,touch' })
      this.girlCurrentEmote = this.serifus.greeting.emotion
      this.serifu = this.serifus.greeting.text
      if(this.$store.getters['option/isPlayVoice']) {
        this.confirmOverVoice()
      }
    } else {
      this.serifus = await this.$store.dispatch('girl/getSerifuSet', { girlId: girlId, situations: 'greeting,touch'})
    }
  },
  created() {
    this.$store.dispatch('api/startLoad')
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
      girlCurrentEmote: 'normal',
      serifus: [],
      serifu: '',
      isOverVoice: false,
      interval: {}
    }
  },
  methods: {
    changeEmote() {
        this.resetVoiceStatus()
        this.serifu = this.serifus.touch.text
        this.girlCurrentEmote = this.serifus.touch.emotion
        if(this.$store.getters['option/isPlayVoice']) {
          const lipMoveBorder = 2000
          this.playVoice('/voices/akane/akane_greeting.wav', lipMoveBorder)
        }
        setTimeout(() => {
          this.serifu = ''
          this.girlCurrentEmote = this.serifus.greeting.emotion
        }, 5000)
    },
    confirmOverVoice() {
      this.$buefy.dialog.confirm({
        message: '音声が出ます',
        onConfirm: () => {
          this.playVoice("/voices/akane/akane_greeting.wav", 2000)
        }
      })
    },
    async playVoice(voicePath, lipMoveBorder) {
        if(src != null) {
          src.stop()
        }
        const audioContext = new AudioContext()
        const soundBuffer = await this.loadVoice(audioContext, voicePath)
        const analyser = new AnalyserNode(audioContext)
        analyser.fftSize = 32
        const spectrums = new Uint8Array(analyser.frequencyBinCount)
        src = new AudioBufferSourceNode(audioContext, {buffer: soundBuffer})
        src.connect(analyser).connect(audioContext.destination)
        src.start()
        this.interval = setInterval((event) => {
            analyser.getByteFrequencyData(spectrums)
            this.isOverVoice = this.isLetOpenLip(spectrums, lipMoveBorder)
        }, 0.25)
    },
    resetVoiceStatus() {
      clearInterval(this.interval)
      this.isOverVoice = false
    },
    isLetOpenLip(spectrums, lipMoveBorder) {
      const openJudgeLine = lipMoveBorder
      const totalSpectrum = spectrums.reduce(function(a, x) { return a + x })
      return totalSpectrum >= openJudgeLine
    },
    loadVoice(context, url) {
      return new Promise((resolv) => {
        fetch(url).then((response) => {
          return response.arrayBuffer()
        }).then((arrayBuf) => {
          return context.decodeAudioData(arrayBuf)
        }).then((buf) => {
          resolv(buf)
        })
      })
    }
  },
  computed: {
    ...mapGetters('user', ['isCoopedLine']),
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