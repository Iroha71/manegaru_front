<template>
<div class="root">
    <div class="section">
        <div class="column is-2 content">
            <p>秘書をタッチして選択してください</p>
            <section>
                <b-button type="is-danger" @click="sendGirlPosition('prev')">戻る</b-button>
                <b-button type="is-primary" @click="sendGirlPosition('next')">次へ</b-button>
            </section>
        </div>
        <div v-for="(girl, index) in girls"
            :key="girl.id"
            :style="getPosition(index)"
            class="column is-4-desktop is-4-tablet is-12-mobile">
            <transition name="fade" mode="out-in">
                <img v-if="(centeredIndex-index)<=0 && index<=visibleLastIndex"
                    :src="`/characters/${girl.code}/all.png`"
                    :style="getImageEffect(index)"
                    @click="choiceGirl(girl.id)" />
            </transition>
        </div>
        <MessageWindow :name="selectedGirl.name" :text="selectedGirl.detail" />
    </div>
</div>
</template>
<script>
import MessageWindow from '@/components/MessageWindow.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    layout: 'fullScreen',
    components: {
        MessageWindow
    },
    async asyncData({store, route}) {
        const girls = await store.dispatch('girl/index', route.query.isFirst)
        return { girls: girls }
    },
    data() {
        return {
            moveDistance: 100,
            currentDistance: 100,
            centeredIndex: 0,
            visibleLastIndex: 2
        }
    },
    methods: {
        ...mapActions({ 'updateGirl': 'girl/updateCurrentGirl', 'unlockGirl': 'girl/unlock' }),
        getPosition(index) {
            const layer = this.centeredIndex - index
            const zIndex = `z-index: ${layer};`
            const position = `transform: translate3d(${this.currentDistance}%, 0, ${layer * 50}px);`
            return zIndex + position
        },
        sendGirlPosition(sendType) {
            if(sendType === 'next' && this.centeredIndex < this.girls.length -1) {
                this.currentDistance -= this.moveDistance
                this.centeredIndex += 1
                this.visibleLastIndex += 1
            } else if(sendType === 'prev' && this.centeredIndex > 0) {
                this.currentDistance += this.moveDistance
                this.centeredIndex -= 1
                this.visibleLastIndex -= 1
            }
        },
        getImageEffect(index) {
            let attachEffect = ''
            if(this.girls[index].is_lock && this.$route.query.isFirst !== 'true') {
                attachEffect = 'filter: brightness(0.1);'
            } else if(this.centeredIndex < index) {
                attachEffect = 'filter: blur(5px);'
            }
            return attachEffect
        },
        choiceGirl(girlId) {
            if(girlId === this.selectedGirl.id) {
                let dialogMessage = this.selectedGirl.name + ' を秘書にしますか?'
                let confirmMessage = '秘書にする'
                if(this.selectedGirl.is_lock) {
                    dialogMessage = this.selectedGirl.name + ` を解放しますか?<br>【資金】${this.hasGold} >> ${this.hasGold - 100}`
                    confirmMessage = '解放する'
                }
                this.$buefy.dialog.confirm({
                    message: dialogMessage,
                    confirmText: confirmMessage,
                    cancelText: 'やめる',
                    onConfirm: () => this.requestSelectedGirl()
                })
            }
        },
        async requestSelectedGirl() {
            if(this.selectedGirl.is_lock){
                try {
                    this.girls = await this.unlockGirl(this.selectedGirl.id)        
                    if(this.$route.query.isFirst === 'true') {
                        this.choiceGirl(this.selectedGirl.id)
                    }
                }catch(error) {
                    this.$buefy.dialog.alert('資金が足りません')
                }
            } else {
                await this.updateGirl(this.selectedGirl.id)
                await this.$router.push('/')
            }
        }
    },
    computed: {
        ...mapGetters({ 'hasGold': 'user/gold' }),
        selectedGirl() {
            return this.girls[this.centeredIndex]
        }
    }
}
</script>

<style lang="scss" scoped>
.root {
    background-image: url('/images/bg-ichimatsu.jpg');
}
.section {
    height: 100vh;
    padding-bottom: 0;
    display: flex;
    perspective: 150px;
    .content {
        background: #fff;
        border-radius: 15px 200px 15px 185px / 240px 15px 100px 15px;
        position: absolute;
        z-index: 10;
        top: 40%;
        left: 10%;
        section {
            display: flex;
            justify-content: space-around;
        }
    }
    .column {
        overflow: visible;
        transition: .5s;
        padding-bottom: 0;
        img {
            position: absolute;
            bottom: 0;
            height: 90vh;
            max-width: initial;
            filter: drop-shadow(5px 0 0 #000);
            cursor: pointer;
        }
    }
}
.fade {
    &-enter-active, &-leave-active {
        transition: .3s;
    }
    &-enter, &-leave-to {
        opacity: 0;
    }
}
</style>