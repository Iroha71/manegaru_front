<template>
    <span>
        <img :style="{ backgroundImage: `url(/characters/${code}/body.png)` }" 
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
            if(this.voice == '') return
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
                const isLipOpen = this.isOverSyncBorder(spectrums)
                this.syncLip(isLipOpen)
            }, 0.25)
            src.onended = () => {
                this.currentVoice = ''
                this.voiceEnded()
            }
        },
        syncLip(isOpen) {
            this.currentEmote = isOpen ? this.emote + '_open' : this.emote
        },
        isOverSyncBorder(spectrums) {
            const openJudgeLine = 2000
            const totalSpectrum = spectrums.reduce(function(a, x) { return a + x })
            return totalSpectrum >= openJudgeLine
        },
        loadVoice(context) {
            return new Promise((resolv) => {
                const url = `/voices/${this.code}/${this.code + '_' + this.voice}.wav`
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