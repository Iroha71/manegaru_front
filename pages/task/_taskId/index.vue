<template lang="html">
<div class="section column is-12-tablet">
    <div class="content">
        <h1 :class="getStatusColor()">{{ task.title }}</h1>
        <b-tag size="is-medium" :type="getPriorityColor()">Lv.{{ task.priority.level }}</b-tag>
        <b-tag size="is-medium" :type="'is-'+getStatusColor()">{{ task.status }}</b-tag>
    </div>
    <div class="columns">
        <div class="column is-4 has-text-centered">
            <b-steps class="has-text-centered is-hidden-touch" v-model="statusIndex" size="is-medium" type="is-danger" :has-navigation="false">
                <b-step-item clickable type="is-danger">
                    <h2 class="title has-text-centered has-text-danger">未着手</h2>
                </b-step-item>
                <b-step-item clickable type="is-info">
                    <h2 class="title has-text-centered has-text-info">作業中</h2>
                </b-step-item>
                <b-step-item clickable type="is-success">
                    <h2 class="title has-text-centered has-text-success">完了</h2>
                </b-step-item>
            </b-steps>
            <b-steps class="has-text-centered is-hidden-desktop" v-model="statusIndex" size="is-medium" type="is-danger">
                <b-step-item clickable type="is-danger">
                    <h2 class="title has-text-centered has-text-danger">未着手</h2>
                </b-step-item>
                <b-step-item clickable type="is-info">
                    <h2 class="title has-text-centered has-text-info">作業中</h2>
                </b-step-item>
                <b-step-item clickable type="is-success">
                    <h2 class="title has-text-centered has-text-success">完了</h2>
                </b-step-item>
            </b-steps>
            <b-button type="is-success" v-if="isStatusUpdated" @click="changeStatus()">更新</b-button>
        </div>
        <div class="column content info-area">
            <table>
                <tr>
                    <td class="has-background-light has-text-centered">通知日</td>
                </tr>
                <tr>
                    <td class="limit-date has-text-centered" v-if="!isEdittingDate" @click="changeEditModeIs('limitDate')">
                        <span :class="{ 'disabled-line': task.is_notified }">{{ task.toast_at }}</span>
                        <img v-if="task.toast_at!='なし'" :src="`/icons/${task.toast_timing}.png`" class="embedded-image">
                    </td>
                    <td v-else>
                        <b-datepicker :minDate="form.limitDate" v-model="form.limitDate" />
                        <b-field>
                                <b-checkbox v-model="form.notifyTiming" native-value="morning" type="is-warning">
                                <img src="/icons/morning.png" class="embedded-image">朝
                            </b-checkbox>
                            <b-checkbox v-model="form.notifyTiming" native-value="night" type="is-info">
                                <img src="/icons/night.png" class="embedded-image">夜
                            </b-checkbox>
                        </b-field>
                        <b-button type="is-success" @click="saveEditedInfo('limitDate')">保存する</b-button>
                        <b-button type="is-danger" @click="closeEditModeIs('limitDate')">×</b-button>
                    </td>
                </tr>
                <tr>
                    <td class="has-text-centered">
                        <b-tooltip always position="is-bottom"　type="is-dark" label="タップして編集">
                            <b-tag type="is-link" v-if="!task.is_notified">通知予定</b-tag>
                            <b-tag type="is-danger" v-else>通知済み</b-tag>
                        </b-tooltip>
                    </td>
                </tr>
            </table>
            <table class="table">
                <tr>
                    <th colspan="2" class="has-text-centered has-background-primary">報酬</th>
                </tr>
                <tr>
                    <td><img class="embedded-image" src="/icons/coin_dark.png"></td>
                    <td>＋{{ task.priority.point }}</td>
                </tr>
                <tr>
                    <td><img class="embedded-image" src="/icons/heart.png"></td>
                    <td>＋{{ task.priority.like_rate }}</td>
                </tr>
            </table>
        </div>
    </div>
    <hr>
    <div class="content">
        <b-tag :type="`is-${getStatusColor()}`" size="is-large">メモ</b-tag>
        <IconButton v-if="!isEdittingMemo" type="is-primary" iconName="edit" message="メモを追加・修正する" @click="changeEditModeIs('memo')" />
        <b-button v-else type="is-success" @click="saveEditedInfo('memo')">メモを保存する</b-button>
        <b-button v-if="isEdittingMemo" type="is-danger" @click="closeEditModeIs('memo')">×</b-button>
        <div class="memo-area">
            <span v-if="task.detail && !isEdittingMemo">{{ task.detail }}</span>
            <span v-else-if="!isEdittingMemo">メモは書かれていません</span>
            <Vinput v-else type="textarea" rules="max:150" :maxLength="150" label="" v-model="form.detail" />
        </div>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import IconButton from '@/components/parts/IconButton.vue'
import Vinput from '@/components/parts/ValidateInput.vue'
export default {
    async asyncData({store, route}) {
        const taskId = route.params.taskId
        const task = await store.dispatch('task/show', taskId)
        return { task: task.data }
    },
    components: {
        IconButton,
        Vinput
    },
    data() {
        return {
            statusIndex: 0,
            defautIndex: 0,
            statuses: ['未着手', '作業中', '完了'],
            isEdittingMemo: false,
            isEdittingDate: false,
            form: {
                detail: '',
                limitDate: null,
                notifyTiming: []
            }
        }
    },
    created() {
        this.statusIndex = this.statuses.indexOf(this.task.status)
        this.defautIndex = this.statusIndex
    },
    methods: {
        ...mapActions('task', ['updateStatus', 'update', 'destroy']),
        getStatusColor:function() {
            switch(this.task.status) {
                case this.statuses[0]:
                    return 'danger'
                case this.statuses[1]:
                    return 'info'
                case this.statuses[2]:
                    return 'success'
                default:
                    return ''
            }
        },
        changeStatus:function() {
            if(this.statuses[this.statusIndex] == '完了') {
                this.destroy(this.task.id)
                    .then((reward) => {
                        this.$buefy.toast.open({
                            type: 'is-success',
                            message: `資金 ＋${reward.gold}<br>${reward.like_rate}`,
                            duration: 3000
                        })
                        this.$router.push('/?status=finishedTask')
                    })
            } else {
                this.updateStatus({taskId: this.task.id, status: this.statuses[this.statusIndex]})
                    .then(updatedStatus => {
                        this.task.status = updatedStatus
                        this.defautIndex = this.statuses.indexOf(updatedStatus)
                        this.statusIndex = this.defautIndex
                    })
            }
        },
        changeEditModeIs(formName) {
            if(formName === 'limitDate') {
                this.form.limitDate = new Date()
                this.isEdittingDate = true
            } else if(formName === 'memo') {
                this.form.detail = this.task.detail
                this.isEdittingMemo = true
            }
        },
        saveEditedInfo(formName) {
            let changeContent = {}
            if(formName === 'limitDate') {
                this.closeEditModeIs('limitDate')
                changeContent = { toast_at: this.arrangeDate(this.form.limitDate), toast_timing: this.form.notifyTiming }
            } else {
                this.closeEditModeIs('memo')
                changeContent = { detail: this.form.detail }
            }
            this.update({taskId: this.task.id, changeContent: changeContent})
            .then(task => {
                this.task = task.data
            })
        },
        closeEditModeIs(formName) {
            if(formName === 'limitDate') {
                this.isEdittingDate = false
            } else {
                this.isEdittingMemo = false
            }
        },
        getPriorityColor:function() {
            switch(this.task.priority.level) {
                case 1:
                    return 'is-success'
                case 2:
                    return 'is-info'
                case 3:
                    return 'is-primary'
            }
        },
        arrangeDate:function(date) {
            if(date !== null) {
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDate()
                return `${year}/${month + 1}/${day}`
            } else {
                return null
            }
        }
    },
    computed: {
        isStatusUpdated() {
            if(this.statusIndex != this.defautIndex) {
                return true
            } else {
                return false
            }
        }
    },
}
</script>

<style lang="scss" scoped>
h1 {
    border-left: solid 5px;
    border-bottom: solid 1px;
    padding-left: 5px;
    &.danger {
        border-color: #ff3860;
    }
    &.info {
        border-color: #3B63AF;
    }
    &.success {
        border-color: #23d160;
    }
}
.info-area {
    display: flex;
    justify-content: center;
    table {
        width: 30%;
        border-collapse: separate;
        margin-right: 0.75rem;
        td {
            &.limit-date {
                cursor: pointer;
                display: flex;
                align-content: center;
            }
        }
    }
}
.memo-area {
    padding: 0.75rem;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>