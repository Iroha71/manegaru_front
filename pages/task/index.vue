<template lang="html">
<div class="container">
    <div class="columns is-multiline">
        <Card v-for="task in tasks" :key="task.id" :title="task.title" size="is-4" @click="$router.push(`/task/${task.id}`)">
            <template v-slot:content>
                <table class="table">
                    <tr>
                        <th>期限</th>
                        <td>{{ task.limit_date }}</td>
                    </tr>
                    <tr v-if="currentGroupId==0">
                        <th></th>
                    </tr>
                </table>
            </template>
            <template v-slot:footer>
                <b-tag size="is-medium" :type="getStatusColor(task.status)">{{ task.status }}</b-tag>
            </template>
        </Card>
    </div>
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
            console.log(store.getters['project/currentGroupId'])
            tasks = await store.dispatch('task/indexAll')
        } else {
            const paramsGroupId = { group_id: store.getters['project/currentGroupId'] }
            tasks = await store.dispatch('task/index', paramsGroupId)
        }
        return { tasks: tasks }
    },
    mounted() {
        this.$nuxt.$on('changeTask', this.changeTask)
        this.$nuxt.$on('filterTask', this.filterTask)
        this.$nuxt.$on('orderTask', this.orderTask)
    },
    beforeDestroy() {
        this.$nuxt.$off('changeTask')
        this.$nuxt.$off('filterTask')
        this.$nuxt.$off('orderTask')
    },
    methods: {
         ...mapActions({ 'index': 'task/index', 'filteredIndex': 'task/filteredIndex', 'orderedIndex': 'task/orderedIndex' }),
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
        filterTask(query) {
            const filterQuery = {
                group_id: query.groupId,
                filter_column: query.columnName,
                filter_sign: query.sign,
                filter_value: query.value
            }
            this.filteredIndex(filterQuery).then(tasks => {
                this.tasks = tasks
            })
        },
        orderTask(query) {
            const orderQuery = {
                group_id: query.groupId,
                order_column: query.column,
                order_sign: query.sign
            }
            this.orderedIndex(orderQuery).then(tasks => {
                this.tasks = tasks
            })
        }
    },
    computed: {
        ...mapGetters({ 'currentGroupId': 'project/currentGroupId' })
    }
}
</script>