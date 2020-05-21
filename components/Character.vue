<template>
    <span class="has-text-centered">
        <img :style="{ backgroundImage: `url(/characters/${code}/body.webp)` }" 
            :src="`/characters/${code}/${getCurrentEmote()}.png`"
            @click="touchEvent()" />
    </span>
</template>

<script>
let src = null
export default {
    props: {
        code: {
            type: String,
            required: true
        },
        emote: {
            type: String,
            required: true
        },
        voice: {
            type: String,
            required: false,
            default: ''
        }
    },
    data() {
        return {
            currentEmote: this.emote,
            lipMoveInterVal: {},
            currentVoice: this.voice
        }
    },
    methods: {
        touchEvent() {
            this.$emit('click')
        },
        getCurrentEmote() {
            return this.$store.getters['option/isPlayVoice'] ? this.currentEmote : this.emote
        },
        async playVoice() {
            if(src != null) {
                src.stop()
            }
            if(this.voice == '' || !this.$store.getters['option/isPlayVoice']) return
            const audioContext = new AudioContext()
            const soundBuffer = await this.loadVoice(audioContext)
            const analyser = new AnalyserNode(audioContext)
            analyser.fftSize = 32
            const spectrums = new Uint8Array(analyser.frequencyBinCount)
            src = new AudioBufferSourceNode(audioContext, {buffer: soundBuffer})
            src.connect(analyser).connect(audioContext.destination)
            src.start()
            this.lipMoveInterVal = setInterval(() => {
                analyser.getByteFrequencyData(spectrums)
                this.syncLip(spectrums)
            }, 0.25)
            src.onended = () => {
                this.currentVoice = ''
                this.voiceEnded()
            }
        },
        syncLip(spectrums) {
            const lipOpenBorder = { akane: 1900, aoi: 2000, yukari: 2000, itako: 1500, hiyori: 1500 }
            let openJudgeLine = lipOpenBorder[this.code]
            const totalSpectrum = spectrums.reduce(function(a, x) { return a + x })
            if(totalSpectrum >= openJudgeLine) {
                this.currentEmote = this.emote + '_open'
            } else {
                this.currentEmote = this.emote
            }
        },
        loadVoice(context) {
            return new Promise((resolv) => {
                const url = `/voices/${this.code}/${this.code + '_' + this.voice}.mp3`
                fetch(url).then((response) => {
                    return response.arrayBuffer()
                }).then((arrayBuf) => {
                    return context.decodeAudioData(arrayBuf)
                }).then((buf) => {
                    resolv(buf)
                })
            })
        },
        voiceEnded() {
            this.$emit('voiceEnded')
        }
    },
    beforeDestroy() {
        if(src != null) {
            src.stop()
            src = null
        }
        clearInterval(this.lipMoveInterVal)
    },
    watch: {
        voice() {
            this.currentVoice = this.voice
        },
        emote() {
            this.currentEmote = this.emote
        },
        currentVoice() {
            if(src != null) {
                src.stop()
                clearInterval(this.lipMoveInterVal)
            }
            if(this.currentVoice != '') {
                this.playVoice()
            } else {
                clearInterval(this.lipMoveInterVal)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    background-position: center center;
    background-size: contain;
    height: 100%;
    max-width: initial;
}
</style>