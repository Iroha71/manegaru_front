<template lang="html">
<aside class="menu" v-if="$route.path=='/task'||$route.path=='/task/'">
    <MenuList label="ソートと絞り込み">
        <li>
            ソート
        </li>
        <li>
            <b-select v-model="applingSort" @change.native="orderTasks()">
                <option :value="{ column: 'created_at', sign: 'DESC' }">新着順</option>
                <option :value="{ column: 'created_at', sign: 'ASC' }">作成順</option>
            </b-select>
        </li>
        <li>
            絞り込み
        </li>
        <li>
            <b-select v-model="applingFilter" @change.native="filterTasks()">
                <option :value="{ column: 'user_id', sign: 'IS NOT', value: 'NULL' }">すべて</option>
                <option :value="{ column: 'status', sign: '<>', value: '\'完了\'' }">完了以外</option>
                <option :value="{ column: 'limit_date', sign: 'IS NOT', value: 'NULL' }">期限日あり</option>
            </b-select>
        </li>
    </MenuList>
    <hr>
    <MenuList label="グループ" :activable="true">
        <li v-for="group in groups"
            :key="group.id"
            @click="changeGroup(group.id)"
            :class="{ 'selected': group.id==currentGroupId }">
            {{ group.name }}
        </li>
    </MenuList>
</aside>
<aside class="menu" v-else-if="$route.path=='/option/'">
    <MenuList label="オプション" :activable="true">
        <li v-model="optionTab" :class="{ 'selected': optionTab=='userInfo' }">ユーザ情報</li>
        <li v-model="optionTab" value="appSetting">アプリ設定</li>
    </MenuList>
</aside>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MenuList from '@/components/parts/SideMenuList.vue'
export default {
    components: {
        MenuList
    },
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
        ...mapGetters({ 'groups': 'project/groups', 'currentGroupId': 'project/currentGroupId', 'optionTab': 'option/currentTab' })
    }
}
</script>