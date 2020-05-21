<template lang="html">
<div class="columns" :style="{ backgroundImage: getLoginBackground() }">
    <div class="form-area column is-3">
        <form class="section content">
            <h1 v-if="lineId">「こんこん」とLINEを連携します</h1>
            <h1 v-else>サインイン</h1>
            <p v-if="isAuthError==401" class="has-text-danger">メールアドレスまたはパスワードが間違っています</p>
            <p v-else-if="isAuthError==403" class="has-text-danger">認証情報が間違っています。再ログインしてください</p>
            <p v-else-if="isAuthError==405" class="has-text-danger">LINE登録はLINEアプリ内で行ってください</p>
            <b-field label="メールアドレス">
                <b-input v-model="email"></b-input>
            </b-field>
            <b-field label="パスワード">
                <b-input type="password" v-model="password" password-reveal></b-input>
            </b-field>
            <b-field class="has-text-centered">
                <b-button v-if="!lineId" type="is-info" size="is-medium" @click="signIn()" :loading="$store.getters['api/isLoading']">サインイン</b-button>
                <b-button v-else type="is-success" size="is-medium" :isloading="$store.getters['api/isLoading']" @click="signIn()">LINEを登録する</b-button>
            </b-field>
            <hr>
            <div class="password-reset-area">
                <b-button type="is-text"
                    class="has-text-info"
                    :loading="$store.getters['api/isLoading']"
                    @click="applyInputEmailDialog()">パスワードをリセット</b-button>
            </div>
            <div>
                <p>未登録の場合</p>
                <b-button type="is-success" :loading="$store.getters['api/isLoading']" @click="$router.push($url.newUser)">新規登録</b-button>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    layout: 'fullScreenWithHeader',
    data() {
        return{
            email: '',
            password: '',
            lineId: ''
        }
    },
    mounted() {
        try {
            liff.init({ liffId: process.env.LIFF_ID })
            .then(() => {
                if(liff.isInClient()) {
                    this.lineId = liff.getContext().userId
                }
                if(this.lineId === '' && this.$route.query.opened === 'line') {
                    this.$router.replace(`${this.$url.login}?error=405`)
                }
            })
        } catch(error) { }
        if(this.$route.query.resetPassword == 'true') {
            this.$buefy.toast.open({
                type: 'is-success',
                message: 'パスワードを変更しました'
            })
        }
    },
    methods: {
        ...mapActions('user', ['setLoggedUser']),
        ...mapActions('auth', ['setAuth']),
        async signIn() {
            let loggedUser = await this.$api.exAuth.signIn(this.email, this.password)
            let nextPath = this.$url.root
            this.setAuth(loggedUser.headers)
            if(this.lineId !== '') {
                this.$api.user.update(loggedUser.data.data.id, { user: { line_id: this.lineId } })
                nextPath = this.$url.coopedLine
            }
            this.setLoggedUser(loggedUser.data)
            this.$router.push(nextPath)
        },
        applyInputEmailDialog() {
            this.$buefy.dialog.prompt({
                message: 'アカウントのメールアドレスを入力してください',
                trapFocus: true,
                confirmText: 'パスワードリセット',
                cancelText: 'やめる',
                onConfirm: (value) => {
                    this.$api.exAuth.sendResetPasswordMail(value)
                        .then(() => {
                            this.$buefydialog.alert(value + 'へパスワードリセットメールを送信しました')
                        })
                }
            })
        },
        getLoginBackground() {
            let backgroundImageName = 'bg-login'
            if(this.$device.isMobile) {
                backgroundImageName += '-mobile'
            }
            return `url('/images/${backgroundImageName}.webp')`
        }
    },
    computed: {
        isAuthError(){
            return this.$route.query.error
        },
        isResetPassword() {
            return this.$route.query.isResetPassword
        }
    },
}
</script>

<style lang="scss" scoped>
.columns {
    background-size: cover;
    background-position: center 80%;
    display: flex;
}
.form-area {
    margin: auto;
    background-color: rgba(255, 255, 255, 0.8);
    form {
        &.section {
            padding: 1.5rem;
        }
        .password-reset-area {
            button {
                padding-left: 0;
            }
        }
    }
}
</style>