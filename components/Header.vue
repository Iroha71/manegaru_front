<template lang="html">
<div>
    <b-navbar type="is-primary">
        <template slot="start" v-if="access_token">
            <b-navbar-item tag="router-link" to="/">トップ</b-navbar-item>
            <b-navbar-dropdown label="タスク">
                <b-navbar-item tag="router-link" to="/task/">
                    一覧
                </b-navbar-item>
                <b-navbar-item tag="router-link" to="/task/new/">
                    作成
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown label="秘書">
                <b-navbar-item tag="router-link" to="/girl/select/">
                    交代
                </b-navbar-item>
                <b-navbar-item>
                    部屋
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>
        <template lang="html" slot="end" v-if="access_token">
            <b-navbar-item @click="showUserModal=true" >
                <img class="user-icon" :src="`/characters/${currentGirl.code}/icon.png`" />
                <span class="user-name">{{ currentUser.name }}</span>
            </b-navbar-item>
            <b-navbar-item>
                <img class="is-hidden-touch" src="/icons/coin.png" />
                <img class="is-hidden-desktop" src="/icons/coin_dark.png" />
                <span>{{ currentUser.gold }}</span>
            </b-navbar-item>
            <b-navbar-item>
                <IconButton type="is-danger" @click="signOutUser()" iconName="sign_out" />
            </b-navbar-item>
        </template>
    </b-navbar>

    <b-modal v-if="access_token&&currentGirl.id" :active.sync="showUserModal" has-modal-card>
        <div class="modal-card" style="width: auto;">
            <header class="modal-card-head">{{ currentUser.name }}</header>
            <section class="modal-card-body">
                <table class="table">
                    <tr>
                        <th>秘書</th>
                        <td>{{ currentGirl.name }}</td>
                    </tr>
                    <tr>
                        <th>一人称</th>
                        <td>{{ currentUser.personal_pronoun }}</td>
                    </tr>
                    <tr>
                        <th>呼び名</th>
                        <td>{{ currentUser.nickname }}</td>
                    </tr>
                </table>
            </section>
            <footer class="modal-card-foot has-text-centered">
                <IconButton type="is-info" iconName="setting" message="ユーザ情報編集" @click="goOption()" />
            </footer>
        </div>
    </b-modal>
    <audio></audio>
</div>
</template>

<script>
import IconButton from './parts/IconButton.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    components: {
        IconButton
    },
    data() {
        return {
            showUserModal: false
        }
    },
    methods: {
        ...mapActions({ 'signOut': 'user/signOut' }),
        signOutUser() {
            this.signOut().then(res => {
                this.showUserModal = false
                this.$router.push('/login/')
            })
        },
        goOption() {
            this.showUserModal = false
            this.$router.push('/option/')
        }
    },
    computed: {
        ...mapGetters('girl', ['currentGirl']),
        ...mapGetters('user', ['currentUser']),
        ...mapGetters('auth', ['access_token'])
    }
}
</script>

<style lang="scss" scoped>
div {
    font-family: 'LightNovel';
    .user-name {
        font-family: 'Gulim';
        font-weight: bold;
    }
}
</style>