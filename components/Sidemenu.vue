<template lang="html">
<aside class="menu">
    <div v-if="$route.path=='/task' || $route.path=='/task/'">
        <p class="menu-label">
            ソート
        </p>
        <ul>
            <li>
                <select v-model="applingSort" @change="orderTasks()">
                    <option :value="{ column: 'created_at', sign: 'DESC' }">新着順</option>
                    <option :value="{ column: 'created_at', sign: 'ASC' }">作成順</option>
                </select>
            </li>
        </ul>
        <p class="menu-label">
            絞り込み
        </p>
        <ul>
            <li>
                <select v-model="applingFilter" @change="filterTasks()">
                    <option :value="{ column: 'user_id', sign: 'IS NOT', value: 'NULL' }">すべて</option>
                    <option :value="{ column: 'status', sign: '<>', value: '\'完了\'' }">完了以外</option>
                    <option :value="{ column: 'limit_date', sign: 'IS NOT', value: 'NULL' }">期限日あり</option>
                </select>
            </li>
        </ul>
    </div>
    <p class="menu-label">
        <span v-if="$route.path=='/task'|| $route.path=='/task/'">グループ</span>
        <span v-else>メニュー</span>
    </p>
    <ul v-if="$route.path=='/task' || $route.path=='/task/'" class="group-list">
        <li v-for="group in groups"
            :key="group.id"
            @click="changeGroup(group.id)"
            :class="{ 'selected': group.id==currentGroupId }">
            {{ group.name }}
        </li>
    </ul>
</aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    async created() {
        if(this.$route.path === "/task" || this.$route.path === '/task/') {
            if(Object.keys(this.groups).length === 0) {
                this.getGroups()   
            }
        }
    },
    data() {
        return {
            applingFilter: {
                column: 'user_id',
                sign: 'IS NOT',
                value: 'NULL'
            },
            applingSort: {
                column: 'created_at',
                sign: 'DESC'
            }
        }
    },
    methods: {
        ...mapActions({ 'getGroups': 'project/getAll', 'setCurrentGroupId': 'project/setCurrentGroupId' }),
        changeGroup(groupId) {
            this.$nuxt.$emit('changeTask', groupId)
            this.setCurrentGroupId(groupId)
            this.clearFilterAndSort()
        },
        filterTasks() {
            const groupId = this.currentGroupId > 0 ? this.currentGroupId : null
            this.$nuxt.$emit('customTask',
                { type: 'filter', groupId: groupId, columnName: this.applingFilter.column, sign: this.applingFilter.sign, value: this.applingFilter.value }
            )
        },
        orderTasks() {
            const groupId = this.currentGroupId > 0 ? this.currentGroupId : null
            this.$nuxt.$emit('customTask',
                { type: 'order', groupId: groupId, columnName: this.applingSort.column, sign: this.applingSort.sign, value: null }
            )
        },
        clearFilterAndSort() {
            this.applingFilter = {
                column: 'user_id',
                sign: 'IS NOT',
                value: 'NULL'
            }
            this.applingSort = {
                column: 'updated_at',
                sign: 'DESC'
            }
        }
    },
    computed: {
        ...mapGetters({ 'groups': 'project/groups', 'currentGroupId': 'project/currentGroupId' })
    }
}
</script>

<style lang="scss" scoped>
.group-list {
    font-size: 1.25rem;
    li {
        &.selected {
            background: #1AAAD4;
        }
        &:hover {
            cursor: pointer;
            transition: .3s;
            background: #1AAAD4;
        }
    }
}
</style>