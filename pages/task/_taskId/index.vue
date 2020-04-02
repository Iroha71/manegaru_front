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
            <table class="table">
                <tr @click="isEdittingDate=true">
                    <th class="has-background-link has-text-centered" rowspan="2">
                        通知日
                        <br>
                        <b-tag type="is-success" v-if="!task.is_notified">通知予定</b-tag>
                        <b-tag type="is-danger" v-else>通知済み</b-tag>
                    </th>
                    <td>
                        <b-tooltip always position="is-top"　type="is-dark" label="タップして編集">
                            {{ task.notify_at }}
                        </b-tooltip>
                    </td>
                </tr>
                <tr>
                    <td>
                        <img v-if="task.notify_at!='なし'"
                            :src="`/icons/${task.notify_timing}.png`"
                            class="embedded-image"
                            style="margin: auto;">
                    </td>
                </tr>
                <tr>
                    <th rowspan="2" class="has-background-primary">リワード</th>
                    <td><img src="/icons/heart.png" class="embedded-image">+50</td>
                </tr>
                <tr>
                    <td><img src="/icons/coin_dark.png" class="embedded-image">+100</td>
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
        <IconButton class="delete-btn"
            type="is-danger"
            iconName="delete"
            message="このタスクを削除する"
            @click="applyDeleteDialog()" />
    </div>
    <b-modal has-modal-card :active.sync="isEdittingDate">
        <div class="modal-card">
            <section class="modal-card-body">
                <b-field label="通知を設定しなおす">
                    <b-datepicker inline v-model="form.limitDate" />
                </b-field>
                <b-field>
                    <b-checkbox-button v-model="form.notifyTiming" native-value="morning" type="is-warning" size="is-medium">
                                <img src="/icons/morning.png" class="embedded-image">朝に通知
                    </b-checkbox-button>
                    <b-checkbox-button v-model="form.notifyTiming" native-value="night" type="is-info" size="is-medium">
                        <img src="/icons/night.png" class="embedded-image">夜に通知
                    </b-checkbox-button>
                </b-field>
            </section>
            <div class="modal-card-body has-text-centered">
                <b-button type="is-success" @click="saveEditedInfo('limitDate')">リマインダーを設定する</b-button>
            </div>
            <footer class="modal-card-foot">
                <b-button type="is-danger" @click="clearLimitDate()">通知しない</b-button>
            </footer>
        </div>
    </b-modal>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
    mounted() {
        this.form.limitDate = this.task.notify_at !== 'なし' ? new Date(this.task.notify_at_en) : null
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
        ...mapActions('application', ['setIsFinishedTask']),
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
        async changeStatus() {
            const reward = await this.updateStatus({taskId: this.task.id, status: this.statuses[this.statusIndex]})
            if(reward.status === '完了') {
                this.$buefy.toast.open({
                    type: 'is-success',
                    message: `資金 ＋${reward.gold}<br>${reward.like_rate}`,
                    duration: 4000
                })
                this.setIsFinishedTask(true)
                const nextPath = this.isMoveTopAfterTaskComplete ? '/?status=finishedTask' : '/task/?status=finishedTask'
                this.$router.push(nextPath)
            } else {
                this.task.status = reward.status
                this.defautIndex = this.statuses.indexOf(reward.status)
                this.statusIndex = this.defautIndex
            }
        },
        applyDeleteDialog() {
            this.$buefy.dialog.confirm({
                message: 'このタスクを削除しますか?',
                confirmText: '削除する',
                cancelText: 'やめる',
                type: 'is-danger',
                onConfirm: () => { this.deleteTask() }
            })
        },
        async deleteTask() {
            const deleted = await this.destroy(this.task.id)
            if(deleted.result === 'success') {
                this.$buefy.toast.open({ type: 'is-danger', message: 'タスクを削除しました' })
                this.$router.push('/task/')
            }
        },
        changeEditModeIs(formName) {
            if(formName === 'memo') {
                this.form.detail = this.task.detail
                this.isEdittingMemo = true
            }
        },
        clearLimitDate() {
            this.form.limitDate=null
            this.form.notifyTiming = []
            this.isEdittingDate = false
            this.saveEditedInfo('limitDate')
        },
        saveEditedInfo(formName) {
            let changeContent = {}
            if(formName === 'limitDate') {
                this.closeEditModeIs('limitDate')
                changeContent = { notify_at: this.arrangeDate(this.form.limitDate), notify_timing: this.form.notifyTiming }
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
        ...mapGetters('option', ['isMoveTopAfterTaskComplete']),
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
    table {
        width: auto;
        margin: auto;
        th {
            border-radius: 4px;
        }
        td {
            display: flex;
            align-items: center;
            img {
                margin-right: 0.25rem;
            }
        }
    }
}
.memo-area {
    padding: 0.75rem;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.delete-btn {
    margin-top: 0.5rem;
}
</style>