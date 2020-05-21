<template lang="html">
<div class="section column is-12-tablet">
    <div class="content">
        <h1 :class="getStatusColor()">{{ task.title }}</h1>
        <b-tag size="is-medium" :type="getPriorityColor()">Lv.{{ task.priority.level }}</b-tag>
        <b-tag size="is-medium" :type="'is-'+getStatusColor()">{{ task.status }}</b-tag>
    </div>
    <div class="columns">
        <div class="column is-4 has-text-centered">
            <b-steps class="has-text-centered" v-model="statusIndex" size="is-medium" type="is-danger" :has-navigation="$device.isMobile">
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
            <table class="table" @click="isEdittingDate=true">
                <tr v-if="task.notify_interval">
                    <th class="has-background-info">繰り返し間隔</th>
                    <th>{{ task.notify_interval }}</th>
                </tr>
                <tr>
                    <th class="has-background-link">
                        <span v-if="task.notify_interval">次回の</span>通知日
                        <br>
                        <b-tag type="is-danger" v-if="task.is_notified">通知済み</b-tag>
                    </th>
                    <td>
                        {{ task.notify_at }}
                    </td>
                </tr>
                <tr>
                    <th rowspan="2" class="has-background-primary">
                        リワード
                        <br>
                        <img :src="`/characters/${task.girl.code}/icon.png`" class="symbol-image" />
                        <img v-if="currentUser.girl.id!=task.girl.id" :src="`/characters/${currentUser.girl.code}/icon.png`" class="symbol-image" />
                    </th>
                    <td><img src="/icons/heart.png" class="embedded-image">{{ task.priority.like_rate }}</td>
                </tr>
                <tr>
                    <td><img src="/icons/coin_dark.png" class="embedded-image">{{ task.priority.point }}</td>
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
                    <b-datepicker inline v-model="form.notify_at" :month-names="$store.getters['master/monthNames']" />
                </b-field>
                <b-field>
                    <b-clockpicker inline hour-format="24"
                        :auto-switch="false"
                        size="is-small"
                        v-model="form.notify_at">
                        <p>※通知は1時間単位で設定できます</p>
                    </b-clockpicker>
                </b-field>
                <b-field>
                    <b-select v-model="form.notify_interval">
                        <option :value="null">1回のみ</option>
                        <option v-for="INTERVAL in NOTIFY_INTERVAL" :value="INTERVAL.VALUE">{{ INTERVAL.LABEL }}</option>
                    </b-select>
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
    async asyncData({app, store, route}) {
        const taskId = route.params.taskId
        const task = await app.$api.task.show(taskId)
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
            statuses: this.$store.getters['master/STATUS_LABELS'],
            isEdittingMemo: false,
            isEdittingDate: false,
            form: {
                detail: '',
                notify_at: null,
                notify_interval: null
            }
        }
    },
    mounted() {
        this.statusIndex = this.statuses.indexOf(this.task.status)
        this.defautIndex = this.statusIndex
        this.form.detail = this.task.detail
        this.notify_interval = this.task.notify_interval
        this.form.notify_at = this.task.notify_at !== 'なし' ? new Date(this.task.notify_at_en) : null
    },
    methods: {
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
            const reward = await this.$api.exTask.updateStatus(this.task.id, this.statuses[this.statusIndex])
            if(reward.data.status === '完了') {
                this.$buefy.toast.open({
                    type: 'is-success',
                    message: `資金 ＋${reward.data.gold}<br>${reward.data.like_rate}`,
                    duration: 4000
                })
                this.setIsFinishedTask(true)
                const nextPath = this.isMoveTopAfterTaskComplete ? '/?status=finishedTask' : `${this.$url.task}?status=finishedTask`
                this.$router.push(nextPath)
            } else {
                this.task.status = reward.data.status
                this.defautIndex = this.statuses.indexOf(reward.data.status)
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
            const deletedResult = await this.$api.task.delete(this.task.id)
            this.$buefy.toast.open({ type: 'is-danger', message: 'タスクを削除しました' })
            this.$router.push(this.$url.task)
        },
        changeEditModeIs(formName) {
            if(formName === 'memo') {
                this.form.detail = this.task.detail
                this.isEdittingMemo = true
            }
        },
        clearLimitDate() {
            this.form.notify = null
            this.isEdittingDate = false
            this.saveEditedInfo('limitDate')
        },
        async saveEditedInfo(formName) {
            this.closeEditModeIs(formName)

            const updatedTask = await this.$api.task.update(this.task.id, this.form)
            this.task = updatedTask.data
            this.defaultIndex = this.statuses.indexOf(updatedTask.data.status)
            this.statusIndex = this.defautIndex
        },
        closeEditModeIs(formName) {
            if(formName === 'limitDate') {
                this.isEdittingDate = false
            } else {
                this.isEdittingMemo = false
            }
        },
        getPriorityColor() {
            switch(this.task.priority.level) {
                case 1:
                    return 'is-success'
                case 2:
                    return 'is-info'
                case 3:
                    return 'is-primary'
            }
        }
    },
    computed: {
        ...mapGetters('option', ['isMoveTopAfterTaskComplete']),
        ...mapGetters('user', ['currentUser']),
        ...mapGetters('master', ['NOTIFY_INTERVAL']),
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
            text-align: center;
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
.girl-image {
    margin: 0 0.25rem;
}
</style>