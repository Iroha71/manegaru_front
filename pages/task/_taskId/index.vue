<template lang="html">
<div class="section column is-12-tablet">
    <div class="content">
        <h1 :class="getStatusColor()">{{ task.title }}</h1>
        <b-tag size="is-medium" :type="getPriorityColor()">Lv.{{ task.priority.like_rate }}</b-tag>
        <b-tag size="is-medium">{{ task.status }}</b-tag>
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
        <div class="column content">
            <table>
                <tr class="has-background-grey-lighter">
                    <th class="has-text-centered">期限</th>
                    <td :class="`limit-date has-background-${getStatusColor()}`" @click="changeEditModeIs('limitDate')" v-if="!isEdittingDate">
                        <b-tooltip type="is-dark" label="タップで期限日変更">
                            {{ task.limit_date }}
                        </b-tooltip>
                    </td>
                    <td v-else>
                        <b-datepicker :minDate="form.limitDate" v-model="form.limitDate" />
                        <b-button type="is-success" @click="saveEditedInfo('limitDate')">保存する</b-button>
                        <b-button type="is-danger" @click="closeEditModeIs('limitDate')">×</b-button>
                    </td>
                </tr>
                <tr class="has-background-grey-light">
                    <td colspan="2" class="has-text-centered">
                        {{ task.updated_at }}
                        <b-tag type="is-info" size="is-medium" v-if="task.is_updated">更新</b-tag>
                        <b-tag type="is-light" size="is-medium" v-else>作成</b-tag>
                    </td>
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
                limitDate: null
            }
        }
    },
    created() {
        this.statusIndex = this.statuses.indexOf(this.task.status)
        this.defautIndex = this.statusIndex
    },
    methods: {
        ...mapActions({ 'updateStatus': 'task/updateStatus', 'update': 'task/update' }),
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
            this.updateStatus({taskId: this.task.id, status: this.statuses[this.statusIndex]})
            .then(updatedStatus => {
                this.task.status = updatedStatus
                this.defautIndex = this.statuses.indexOf(updatedStatus)
                this.statusIndex = this.defautIndex
            })
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
                changeContent = { limit_date: this.arrangeDate(this.form.limitDate) }
            } else {
                this.closeEditModeIs('memo')
                changeContent = { detail: this.form.detail }
            }
            this.update({taskId: this.task.id, changeContent: changeContent})
            .then(task => {
                this.task = task.data
                console.log(task.data)
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
            switch(this.task.priority.like_rate) {
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
        border-color: #167df0;
    }
    &.success {
        border-color: #23d160;
    }
}
table {
    width: auto;
    margin-left: auto;
    margin-right: auto;
    border-collapse: separate;
    border-spacing: 0.75rem;
    th {
        text-align: center;
        border-radius: 10px;
    }
    td {
        border-radius: 10px;
        &.limit-date {
            cursor: pointer;
        }
    }
}
.memo-area {
    padding: 0.75rem;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>