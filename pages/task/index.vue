<template lang="html">
<div class="container">
    <transition-group name="list" tag="div" class="columns is-multiline">
        
        <Card key="create-task" title="タスクを作成" size="is-3" @click="$router.push('/task/new/')">
            <template v-slot:content>
                <b-button type="is-primary" class="create-button">＋</b-button>
            </template>
            <template v-slot:footer>
                <b-tag size="is-medium" type="is-primary">現在： {{ tasks.length }}タスク</b-tag>
            </template>
        </Card>
            <Card v-for="task in tasks" :key="task.id" :title="task.title" size="is-3" @click="$router.push(`/task/${task.id}`)">
                <template lang="html" v-slot:content>
                    <table class="table">
                        <tr>
                            <th>期限</th>
                            <td>{{ task.limit_date }}</td>
                        </tr>
                    </table>
                </template>
                <template lang="html" v-slot:footer>
                    <b-tag size="is-medium" :type="getStatusColor(task.status)">{{ task.status }}</b-tag>
                </template>
            </Card>
    </transition-group>
</div>
</template>

<script>
import Card from '@/components/Card.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    components: {
        Card
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
            orderSign: 'DESC'
        }
    },
    methods: {
         ...mapActions({ 'index': 'task/index', 'custom': 'task/custom' }),
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
        }
    },
    computed: {
        ...mapGetters({ 'currentGroupId': 'project/currentGroupId' })
    }
}
</script>

<style lang="scss" scoped>
.create-button {
    height: 4rem;
    width: 4rem;
    font-size: 2rem;
    padding: 0;
    border-radius: 50%;
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