<template>
    <div class="column is-4">
        <b-field label="音声">
            <b-switch type="is-primary" v-model="voiceSetting">ボイスを再生する</b-switch>
        </b-field>
        <b-field label="音声">
            <b-switch type="is-primary" v-model="bgmSetting">BGMを再生する</b-switch>
        </b-field>
        <b-field label="タスクを完了した際の遷移先">
            <b-select v-model="afterTaskCompleteSetting">
                <option :value="true">トップに戻る</option>
                <option :value="false">タスク一覧に戻る</option>
            </b-select>
        </b-field>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    methods: {
        ...mapActions('option', ['setAppSetting'])
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters('option', ['isPlayBgm', 'isPlayVoice', 'isToastTask', 'topApplySeason', 'isMoveTopAfterTaskComplete']),
        voiceSetting: {
            get() { return this.isPlayVoice },
            set(isPlay) { this.setAppSetting({ key: 'isPlayVoice', value: isPlay }) }
        },
        bgmSetting: {
            get() { return this.isPlayBgm },
            set(isPlay) { this.setAppSetting({ key: 'isPlayBgm', value: isPlay }) }
        },
        afterTaskCompleteSetting: {
            get() { return this.isMoveTopAfterTaskComplete },
            set(isMoveTop) { this.setAppSetting({ key: 'isMoveTopAfterTaskComplete', value: isMoveTop }) } 
        }
    },
    watch: {

    }
}
</script>