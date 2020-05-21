<template lang="html">
<aside class="menu" v-if="$route.path==$url.task || $route.path==$url.category || $route.path==$url.editCategory">
    
    <a v-if="$device.isMobile" 
        role="button" 
        aria-label="menu" 
        class="navbar-burger burger has-text-white-bis"
        :class="{ 'is-active': isOpenedMenu }"
        @click="isOpenedMenu=!isOpenedMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
    </a>
    <MenuList v-if="(!$device.isMobile || isOpenedMenu) && $route.path==$url.task">
        <li class="title-text">
            ソート
        </li>
        <li>
            <b-select v-model="applingSort" @change.native="orderTasks()">
                <option :value="{ column: 'created_at', sign: 'DESC' }">新着順</option>
                <option :value="{ column: 'created_at', sign: 'ASC' }">作成順</option>
            </b-select>
        </li>
        <li class="title-text">
            絞り込み
        </li>
        <li>
            <b-select v-model="applingFilter" @change.native="filterTasks()">
                <option :value="{ column: 'user_id', sign: 'IS NOT', value: 'NULL' }">すべて</option>
                <option :value="{ column: 'status', sign: '<>', value: '\'完了\'' }">完了以外</option>
                <option :value="{ column: 'notify_at', sign: 'IS NOT', value: 'NULL' }">通知設定済み</option>
            </b-select>
        </li>
    </MenuList>
    <hr v-if="(!$device.isMobile || isOpenedMenu) && $route.path==$url.task || $route.path==$url.editCategory">
    <MenuList v-if="!$device.isMobile || isOpenedMenu" label="グループ" :activable="true">
        <li v-for="group in currentUser.projects"
            :key="group.id"
            @click="changeGroup(group.id)"
            :class="{ 'selected': group.id==selectingGroupId }">
            {{ group.name }}
        </li>
    </MenuList>
</aside>
<aside class="menu" v-else-if="$route.path==$url.option">
    <MenuList label="オプション" :activable="true">
        <li :class="{ 'selected': currentTab==TAB.USER }" @click="setOptionTab(TAB.USER)">ユーザ情報</li>
        <li :class="{ 'selected': currentTab==TAB.APP }" @click="setOptionTab(TAB.APP)">アプリ設定</li>
        <li :class="{ 'selected': currentTab==TAB.LINE }" @click="setOptionTab(TAB.LINE)">LINEと連携</li>
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
            },
            isOpenedMenu: false
        }
    },
    methods: {
        ...mapActions('user', ['setSelectingGroupId']),
        ...mapActions('option', ['setOptionTab']),
        changeGroup(groupId) {
            if(this.$route.path == $url.task) {
                this.$nuxt.$emit('changeTask', groupId)
                this.clearFilterAndSort()
            }
            this.$route.query.projectId = groupId
            this.setSelectingGroupId(groupId)
        },
        filterTasks() {
            const groupId = this.selectingGroupId > 0 ? this.selectingGroupId : null
            this.$nuxt.$emit('customTask',
                { type: 'filter', groupId: groupId, columnName: this.applingFilter.column, sign: this.applingFilter.sign, value: this.applingFilter.value }
            )
        },
        orderTasks() {
            const groupId = this.selectingGroupId > 0 ? this.selectingGroupId : null
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
        ...mapGetters('user', ['currentUser', 'selectingGroupId']),
        ...mapGetters('master', ['TAB']),
        ...mapGetters('option', ['currentTab'])
    }
}
</script>

<style lang="scss" scoped>
.navbar-burger {
    height: 2rem;
    width: 2rem;
}
</style>