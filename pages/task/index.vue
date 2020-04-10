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
                                <img v-if="task.notify_at!='なし'" class="embedded-image" :class="{'disabled-image': task.is_notified}" :src="`/icons/${task.notify_timing}.png`">
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
export default {
    components: {
        Card,
        IconButton
    },
    async asyncData({store}) {
        let tasks = null
        if(store.getters['project/currentGroupId'] === 0) {
            tasks = await store.dispatch('task/indexAll')
        } else {
            const paramsGroupId = { group_id: store.getters['project/currentGroupId'] }
            tasks = await store.dispatch('task/index', paramsGroupId)
        }
        return { tasks: tasks }
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
         ...mapActions({ 'index': 'task/index', 'custom': 'task/custom' }),
         ...mapActions('task', ['updateStatusMulti', 'destroyMulti']),
         ...mapActions('project', ['setCurrentGroupId']),
        getStatusColor(statusName) {
            switch(statusName) {
                case '未着手':
                    return 'is-danger'
                case '作業中':
                    return 'is-info'
                case '完了':
                    return 'is-success'
            }
        },
        changeTask(groupId) {
            const paramGroupId = { group_id: groupId }
            this.index(paramGroupId).then(tasks => {
                this.tasks = tasks
            })
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
            const customParam = {
                groupId: groupId,
                column: this.filterColumn,
                sign: this.filterSign,
                value: this.filterValue,
                orderColumn: this.orderColumn,
                orderSign: this.orderSign
            }
            this.tasks = await this.custom(customParam)
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
            const result = await this.updateStatusMulti({taskIds: this.selectedTasks, status: '完了'})
            this.$store.dispatch('application/setIsFinishedTask', true)
            this.$buefy.toast.open({
                type: 'is-success',
                message: `資金 ＋${result.gold}<br>${result.like_rate}`,
                duration: 4000
            })
            this.resetBundleMode()
            this.showBundleEditModal = false
            this.tasks = result.tasks
            this.setCurrentGroupId(0)
        },
        resetBundleMode() {
            this.selectedTasks = []
            this.selectedTasksTitle = []
            this.isBundleMode = false
        },
        async deleteTaskMulti() {
            const tasks = await this.destroyMulti(this.selectedTasks)
            this.$buefy.toast.open({
                type: 'is-danger',
                message: 'タスクを削除しました'
            })
            this.tasks = tasks
            this.showBundleEditModal = false
            this.resetBundleMode()
        }
    },
    computed: {
        ...mapGetters({ 'currentGroupId': 'project/currentGroupId' })
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