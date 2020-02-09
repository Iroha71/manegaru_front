<template lang="html">
<div>
    <b-navbar type="is-primary" fixed-top>
        <template slot="start" v-if="$store.getters['auth/access_token']">
            <b-navbar-dropdown label="タスク">
                <b-navbar-item>
                    一覧
                </b-navbar-item>
                <b-navbar-item tag="router-link" to="/task/new/">
                    作成
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-dropdown label="秘書">
                <b-navbar-item>
                    交代
                </b-navbar-item>
                <b-navbar-item>
                    部屋
                </b-navbar-item>
            </b-navbar-dropdown>
            <b-navbar-item>
                オプション
            </b-navbar-item>
        </template>
        <template slot="end" v-if="$store.getters['auth/access_token']">
            <b-navbar-item tag="div">
                <div class="user-info-area">
                    <img class="user-icon" :src="`/characters/${$store.getters['girl/currentGirlCode']}/icon.png`" />
                    <span @click="showUserModal=true">{{ $store.getters['user/name'] }}</span>
                </div>
                <div class="user-info-area">
                    <img class="is-hidden-touch" src="/icons/coin.png" />
                    <img class="is-hidden-desktop" src="/icons/coin_dark.png" />
                    <span>{{ $store.getters['user/gold'] }}</span>
                </div>
                <div class="user-info-area">
                    <img class="is-hidden-touch" src="/icons/setting.png" />
                    <img class="is-hidden-desktop" src="/icons/setting_dark.png" />
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>

    <b-modal :active.sync="showUserModal" has-modal-card>
        <div class="modal-card" style="width: auto;">
            <header class="modal-card-head">{{ $store.getters['user/name'] }}</header>
            <section class="modal-card-body">
                <table class="table">
                    <tr>
                        <th>メールアドレス</th>
                        <td>{{ $store.getters['user/email'] }}</td>
                        <td><IconButton type="is-primary" iconName="edit" /></td>
                    </tr>
                    <tr>
                        <th>一人称</th>
                        <td>{{ $store.getters['user/personalPronoun'] }}</td>
                        <td><IconButton type="is-primary" iconName="edit" /></td>
                    </tr>
                    <tr>
                        <th>秘書</th>
                        <td colspan="2">{{ $store.getters['girl/currentGirlCode'] }}</td>
                    </tr>
                </table>
            </section>
            <footer class="modal-card-foot has-text-centered">
                <b-button type="is-danger" @click="signOutUser()">サインアウト</b-button>
            </footer>
        </div>
    </b-modal>
</div>
</template>

<script>
import IconButton from './parts/IconButton.vue'
import { mapActions } from 'vuex'
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
                this.$router.push('/login/')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.user-info-area {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    cursor: pointer;
    img {
        max-height: 2rem;
        max-width: 2rem;
        margin-right: 0.75rem;
    }
    span {
        font-weight: bold;
    }
}
</style>