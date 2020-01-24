<template lang="html">
<div class="section column is-12-tablet">
    <div class="content">
        <h1 :class="getStatusColor()">{{ task.title }}</h1>
        <b-tag size="is-medium">Lv.{{ task.priority.like_rate }}</b-tag>
        <b-tag size="is-medium">{{ task.status }}</b-tag>
    </div>
    <div class="columns">
        <div class="column is-4 has-text-centered">
            <b-steps class="has-text-centered" v-model="statusIndex" size="is-medium" type="is-danger" :has-navigation="false">
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
            <b-button type="is-success" v-if="isStatusUpdated">更新</b-button>
        </div>
        <div class="column content">
            <table >
                <tr class="has-background-grey-lighter">
                    <th class="has-text-centered">期限</th>
                    <td >{{ task.limit_date }}</td>
                </tr>
                <tr class="has-background-info">
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
        <b-tag type="is-info" size="is-large">メモ</b-tag>
        <div class="memo-area">
            <span v-if="task.detail">{{ task.detail }}</span>
            <span v-else>メモは書かれていません</span>
        </div>
    </div>
</div>
</template>

<script>
export default {
    async asyncData({store, route}) {
        const taskId = route.params.taskId
        const task = await store.dispatch('task/show', taskId)
        return { task: task.data }
    },
    data() {
        return {
            statusIndex: 0,
            defautIndex: 0,
            statuses: ['未着手', '作業中', '完了']
        }
    },
    mounted() {
        this.defaultIndex = this.statuses.indexOf(this.task.status)
        this.statusIndex = this.defautIndex
    },
    methods: {
        getStatusColor:function() {
            switch(this.task.status) {
                case this.statuses[0]:
                    return 'yet'
                case this.statuses[1]:
                    return 'working'
                case this.statuses[2]:
                    return 'done'
                default:
                    return ''
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
    &.yet {
        border-color: #ff3860;
    }
    &.working {
        border-color: #167df0;
    }
    &.done {
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
    }
}
.memo-area {
    padding: 0.75rem;
}
</style>