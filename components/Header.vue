<template lang="html">
<div>
    <b-navbar type="is-primary">
        <template slot="start" v-if="$store.getters['auth/access_token']">
            <b-navbar-dropdown label="タスク">
                <b-navbar-item tag="router-link" to="/task/">
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
        <template lang="html" slot="end" v-if="$store.getters['auth/access_token']">
            <b-navbar-item>
                <img class="user-icon" :src="`/characters/${$store.getters['girl/currentGirlCode']}/icon.png`" />
                <span @click="showUserModal=true" class="user-name">{{ $store.getters['user/name'] }}</span>
            </b-navbar-item>
            <b-navbar-item>
                <img class="is-hidden-touch" src="/icons/coin.png" />
                <img class="is-hidden-desktop" src="/icons/coin_dark.png" />
                <span>{{ $store.getters['user/gold'] }}</span>
            </b-navbar-item>
            <b-navbar-item>
                <IconButton type="is-danger" @click="signOutUser()" iconName="sign_out" />
            </b-navbar-item>
        </template>
    </b-navbar>

    <b-modal :active.sync="showUserModal" has-modal-card>
        <div class="modal-card" style="width: auto;">
            <header class="modal-card-head">{{ $store.getters['user/name'] }}</header>
            <section class="modal-card-body">
                <table class="table">
                    <tr>
                        <th>秘書</th>
                        <td>{{ $store.getters['girl/currentGirlName'] }}</td>
                    </tr>
                    <tr>
                        <th>一人称</th>
                        <td>{{ $store.getters['user/personalPronoun'] }}</td>
                    </tr>
                    <tr>
                        <th>呼び名</th>
                        <td>{{ $store.getters['user/nickname'] }}</td>
                    </tr>
                </table>
            </section>
            <footer class="modal-card-foot has-text-centered">
                <IconButton type="is-info" iconName="setting" @click="$router.push('/option/')" />
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
.user-name {
    font-weight: bold;
}
</style>