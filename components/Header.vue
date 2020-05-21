<template lang="html">
<div>
    <b-navbar type="is-primary">
        <template slot="brand" lang="html" v-if="access_token && currentUser.name">
            <b-navbar-item tag="router-link" to="/">
                <img src="/icons/home.png" />
            </b-navbar-item>
        </template>
        <template slot="start" v-if="access_token && currentUser.name" lang="html">
            <b-navbar-dropdown label="タスク">
                <b-navbar-item tag="router-link" :to="$url.task">
                    一覧
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="$url.newTask">
                    作成
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="getSelectingCategory(selectingGroupId).route">
                    {{ getSelectingCategory(selectingGroupId).name }}
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown label="秘書">
                <b-navbar-item tag="router-link" :to="$url.girlSelect">
                    交代
                </b-navbar-item>
                <b-navbar-item @click="$router.push($url.room)">
                    部屋
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>
        <template lang="html" slot="end" v-if="access_token && currentUser.name">
            <b-navbar-item @click="$router.push($url.option)">
                <div class="item-area">
                    <img class="user-icon" :src="`/characters/${currentUser.girl.code}/icon.png`" />
                    <span class="user-name">{{ currentUser.name }}</span>
                </div>
            </b-navbar-item>
            <b-navbar-item>
                <div class="item-area">
                    <img class="is-hidden-touch coin-icon" src="/icons/coin.png" />
                    <img class="is-hidden-desktop coin-icon" src="/icons/coin_dark.png" />
                    <span>{{ currentUser.gold }}</span>
                </div>
            </b-navbar-item>
            <b-navbar-item>
                <IconButton type="is-danger" @click="signOut()" iconName="sign_out" />
            </b-navbar-item>
        </template>
    </b-navbar>
    <audio></audio>
</div>
</template>

<script>
import IconButton from './parts/IconButton.vue'
import { mapActions, mapGetters } from 'vuex'

const CATEGORY_NOT_SELECTED = 0
export default {
    components: {
        IconButton
    },
    methods: {
        ...mapActions('user', ['clearLoggedUser']),
        ...mapActions('auth', ['clearAuth']),
        async signOut() {
            await this.$api.exAuth.signOut()
            this.clearLoggedUser()
            this.clearAuth()
            this.$router.push(this.$url.login)
        },
        getSelectingCategory(projectId) {
            if(projectId == CATEGORY_NOT_SELECTED) {
                return { name: 'カテゴリ', route: this.$url.category }
            } else {
                const currentProject = this.currentUser.projects.find((project) => project.id === projectId)
                return { name: 'カテゴリ -' + currentProject.name, route: `${this.$url.editCategory}?projectId=${projectId}` }
            }
        }
    },
    computed: {
        ...mapGetters('user', ['currentUser', 'selectingGroupId']),
        ...mapGetters('auth', ['access_token'])
    }
}
</script>

<style lang="scss" scoped>
div {
    font-family: 'LightNovel';
    .item-area {
        display: flex;
        align-items: center;
    }
    .user-icon, .coin-icon {
        margin-right: 0.5rem;
    }
    .user-name {
        font-family: 'Gulim';
        font-weight: bold;
    }
}
</style>