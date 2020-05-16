<template lang="html">
    <div class="content section">
        <h2 v-if="currentTab!==TAB.LINE">{{ currentTabName }}を変更する</h2>
        <span v-else>
            <h2>
                「こんこん」専用LINEアカウントと連携する
                <b-tag v-if="currentUser.is_cooped_line" type="is-info">連携済み</b-tag>
                <b-tag v-else type="is-danger">未連携</b-tag>
            </h2>
            <p>アカウントを連携することで、タスクの期限が近づくとLINEを通じて秘書から連絡してくれます</p>
            <p>QRコードを読み取るか<span class="has-text-success">「友だち追加」</span>ボタンをクリックしてLINEアカウントを追加してください</p>
            <p class="has-text-danger">※LINEの友達追加は必ずスマホから行ってください※</p>
        </span>
        <UserProfile v-if="currentTab==TAB.USER" :user="currentUser" />
        <AppSetting v-else-if="currentTab==TAB.APP" />

        <div v-if="currentTab==TAB.LINE"  class="columns">
            <div class="column is-3 line-desc-area">
                <img src="/images/LINE_profile.png">
                <p>アカウント名: <span class="has-text-weight-bold">秘書</span></p>
            </div>
            <div class="column is-6 has-text-centered">
                <div class="line-image-area">
                    <img src="/images/line_bot_qr.png">
                    <a href="https://line.me/R/ti/p/%40315yrnul"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height="36" border="0"></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserProfile from '@/components/options/UserProfile.vue'
import AppSetting from '@/components/options/AppSetting.vue'
import { mapGetters, mapActions } from 'vuex'
import RequireSelect from '@/components/parts/RequireSelect.vue'
export default {
    components: {
        UserProfile,
        AppSetting,
    },
    async mounted() {
        const currentUser = this.$store.getters['user/currentUser']
        const user = await this.$api.user.show(currentUser.id)
        this.$store.dispatch('user/setLoggedUser', user.data)
    },
    computed: {
        ...mapGetters('user', ['currentUser']),
        ...mapGetters('option', ['currentTab', 'currentTabName']),
        ...mapGetters('master', ['TAB'])
    }
}
</script>

<style lang="scss" scoped>
.column {
    font-size: 1.2rem;
    .form-area {
        margin-bottom: 1rem;
        .has-text-weight-bold {
            margin-bottom: 0.5rem;
        }
    }
    .line-desc-area {
        margin-top: 1rem;
    }
    .line-image-area {
        text-align: center;
        img {
            max-width: 80%;
        }
    }
}
</style>