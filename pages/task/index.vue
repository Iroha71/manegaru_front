<template lang="html">
<div class="container">
    <transition-group tag="div" name="list" class="mobile-btn-area" mode="out-in">
        <b-button v-if="!isBundleMode"
            key="task_create"
            type="is-primary"
            class="create-button"
            @click="$router.push('/task/new/')">＋</b-button>
        <IconButton v-if="!isBundleMode"
            key="bundle_mode"
            type="is-info"
            class="create-button"
            iconName="bundle_task"
            iconSize="2rem"
            @click="isBundleMode=true" />
        <IconButton v-else-if="isBundleMode"
            key="save_bundle"
            type="is-success"
            class="create-button"
            iconName="check"
            iconSize="2rem"
            @click="showBundleEditModal=true"
            :disabled="selectedTasks.length<=0" />
        <IconButton v-if="isBundleMode"
            key="bundle_cancel"
            type="is-danger"
            class="create-button"
            iconName="cancel"
            iconSize="2rem"
            @click="isBundleMode=false" />
    </transition-group>
    <transition-group name="list" tag="div" class="columns is-multiline">
        <Card v-for="task in tasks" :key="task.id" :title="task.title" size="is-3" @click="selectTask(task.id, task.title)">
            <template lang="html" v-slot:content>
                <table class="table">
                    <tr>
                        <td>
                            <img src="/icons/clock.png" class="symbol-image">
                        </td>
                        <th :class="{ 'disabled-line': task.is_notified }">
                            <div class="with-image-area">
                                {{ task.notify_at_short }}
                            </div>
                        </th>
                        <td v-if="isBundleMode"><b-checkbox v-model="selectedTasks" type="is-primary" :native-value="task.id" disabled /></td>
                    </tr>
                    <tr v-if="task.notify_interval">
                        <td><img src="/icons/reload.png" class="symbol-image" /></td>
                        <td>{{ task.notify_interval }}</td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="with-image-area has-centered">
                                <img :src="`/characters/${task.girl.code}/icon.png`" class="symbol-image girl-image" />が管理中
                            </div>
                        </td>
                    </tr>
                </table>
            </template>
            <template lang="html" v-slot:footer>
                <b-tag size="is-medium" :type="getStatusColor(task.status)">{{ task.status }}</b-tag>
            </template>
        </Card>
    </transition-group>
    <b-modal :active.sync="showBundleEditModal" has-modal-card>
        <div class="modal-card">
            <header class="modal-card-head">選択したタスクをどうしますか?</header>
            <section class="modal-card-body has-text-centered">
                <b-button type="is-success" @click="updateTasks()">完了にする</b-button>
                <b-button type="is-danger" @click="deleteTaskMulti()">削除する</b-button>
                <b-button type="is-info" @click="">カテゴリを変更</b-button>
            </section>
            <section class="modal-card-body content">
                <ul>
                    <li v-for="selectedTaskTitle in selectedTasksTitle">{{ selectedTaskTitle }}</li>
                </ul>
            </section>
        </div>
    </b-modal>
</div>
</template>

<script>
import Card from '@/components/Card.vue'
import { mapActions, mapGetters } from 'vuex'
import IconButton from '@/components/parts/IconButton.vue'

const GROUP_NOT_SELECTED = 0
export default {
    components: {
        Card,
        IconButton
    },
    async asyncData({app, store}) {
        let tasks = null
        if(store.getters['user/selectingGroupId'] === GROUP_NOT_SELECTED) {
            tasks = await app.$api.task.index(null)
        } else {
            const paramsGroupId = { group_id: store.getters['user/selectingGroupId'] }
            tasks = await app.$api.task.index(paramsGroupId)
        }
        return { tasks: tasks.data }
    },
    mounted() {
        this.$nuxt.$on('changeTask', this.changeTask)
        this.$nuxt.$on('customTask', this.customTask)
        if(this.$route.query.status === 'finishedTask') {
            this.$buefy.toast.open({ type: 'is-success', message: 'タスクが完了になりました' })
        }
    },
    beforeDestroy() {
        this.$nuxt.$off('changeTask')
        this.$nuxt.$off('customTask')
    },
    data() {
        return {
            filterColumn: '',
            filterSign: '',
            filterValue: '',
            orderColumn: 'updated_at',
            orderSign: 'DESC',
            isBundleMode: false,
            selectedTasks: [],
            selectedTasksTitle: [],
            showBundleEditModal: false
        }
    },
    methods: {
        getStatusColor(statusName) {
            switch(statusName) {
                case this.STATUS_LABEL.YET:
                    return 'is-danger'
                case this.STATUS_LABEL.WORKING:
                    return 'is-info'
                case this.STATUS_LABEL.FINISHED:
                    return 'is-success'
            }
        },
        async changeTask(groupId) {
            const tasks = await this.$api.task.index({ group_id: groupId })
            this.tasks = tasks.data
        },
        async customTask({type, groupId, columnName, sign, value}) {
            if(type === 'filter') {
                this.filterColumn = columnName
                this.filterSign = sign
                this.filterValue = value
            } else if(type === 'order') {
                this.orderColumn = columnName
                this.orderSign = sign
            }
            const filteredTasks = 
               await this.$api.exTask.custom(groupId, this.filterColumn, this.filterSign, 
                    this.filterValue, this.orderColumn, this.orderSign)
            this.tasks = filteredTasks.data
        },
        selectTask(task_id, task_title) {
            if(this.isBundleMode) {
                const selectedTaskIndex = this.selectedTasks.indexOf(task_id)
                if(selectedTaskIndex >= 0) {
                    this.selectedTasks.splice(selectedTaskIndex, 1)
                    this.selectedTasksTitle.splice(selectedTaskIndex, 1)
                } else {
                    this.selectedTasks.push(task_id)
                    this.selectedTasksTitle.push(task_title)
                }
            } else {
                this.$router.push(`/task/${task_id}/`)
            }
        },
        async updateTasks() {
            const updatedTasks = await this.$api.exTask.updateStatusMulti(this.selectedTasks, this.STATUS_LABEL.FINISHED, this.selectingGroupId)
            this.$store.dispatch('application/setIsFinishedTask', true)
            this.$buefy.toast.open({
                type: 'is-success',
                message: `資金 ＋${updatedTasks.data.gold}<br>${updatedTasks.data.like_rate}`,
                duration: 4000
            })
            this.resetBundleMode()
            this.showBundleEditModal = false
            this.tasks = updatedTasks.data.tasks
        },
        resetBundleMode() {
            this.selectedTasks = []
            this.selectedTasksTitle = []
            this.isBundleMode = false
        },
        async deleteTaskMulti() {
            const tasks = await this.$api.exTask.deleteTaskMulti(this.selectedTasks, this.selectingGroupId)
            this.$buefy.toast.open({
                type: 'is-danger',
                message: 'タスクを削除しました'
            })
            this.tasks = tasks.data
            this.showBundleEditModal = false
            this.resetBundleMode()
        }
    },
    computed: {
        ...mapGetters('master', ['STATUS_LABEL']),
        ...mapGetters('user', ['selectingGroupId'])
    }
}
</script>

<style lang="scss" scoped>
.mobile-btn-area {
    position: fixed;
    z-index: 2;
    bottom: 0.75rem;
    right: 0.75rem;
    display: flex;
    flex-direction: column;
    button {
        margin-bottom: 0.75rem;
    }
}
.create-button {
    height: 4rem;
    width: 4rem;
    font-size: 2rem;
    padding: 0;
    border-radius: 50%;
}
th, td {
    text-align: center;
    vertical-align: middle !important;
    img.disabled-image {
        filter: brightness(0%);
    }
    .with-image-area {
        display: flex;
        align-items: center;
        &.has-centered {
            justify-content: center;
        }
        img {
            margin: 0 0.25rem;
            &.girl-image {
                width: 2rem;
                border: solid 2px #1AAAD4;
                border-radius: 50%;
            }
        }
    }
}
.list {
    &-enter-active, &-leave-active, &-move {
        transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
        transition-property: opacity, transform;
    }
    &-enter {
        opacity: 0;
        transform: translateY(50px);
    }
    &-enter-to {
        opacity: 1;
        transform: translateY(0);
    }
    &-leave-to {
        opacity: 0;
        transform: translateY(50px);
    }
}
</style>