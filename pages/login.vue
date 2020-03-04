<template lang="html">
<div class="columns" :style="{ backgroundImage: `url(${'/images/bg-title.jpg'})` }">
    <div class="form-area column is-3">
        <form class="section">
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
                <b-button v-if="!lineId" type="is-info" size="is-medium" @click="signInUser()" :loading="$store.getters['api/isLoading']">サインイン</b-button>
                <b-button v-else type="is-success" size="is-medium" :isloading="$store.getters['api/isLoading']" @click="signInUser()">LINEを登録する</b-button>
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
                <b-button type="is-success" :loading="$store.getters['api/isLoading']" @click="$router.push('/user/new')">新規登録</b-button>
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
        liff.init({ liffId: process.env.LIFF_ID })
            .then(() => {
                if(liff.isInClient()) {
                    this.lineId = liff.getContext().userId
                }
            })
    },
    methods: {
        ...mapActions({ 'signIn': 'user/signIn', 'registLineId': 'user/registLineId', 'resetPassword': 'user/resetPassword' }),
        signInUser() {
            this.signIn({email: this.email, password: this.password})
                .then(res => {
                    if(this.lineId === '') {
                        let destination = this.$route.query.opened === 'line' ? '/task' : '/'
                        this.$router.push(destination)
                    } else {
                        this.updateLineId()
                        this.$router.push('/user/cooped-line/')
                    }
                })
        },
        updateLineId() {
            if(this.lineId !== null) {
                const lineId = this.registLineId(this.lineId)
            } else {
                this.$route.query.error = 405
            }
        },
        applyInputEmailDialog() {
            this.$buefy.dialog.prompt({
                message: 'アカウントのメールアドレスを入力してください',
                trapFocus: true,
                confirmText: 'パスワードリセット',
                cancelText: 'やめる',
                onConfirm: (value) => {
                    this.resetPassword(value)
                        .then(() => {
                            this.$buefy.dialog.alert(value + 'へパスワードリセット用のメールを送信しました')
                        })
                }
            })
        }
    },
    computed: {
        isAuthError(){
            return this.$route.query.error
        }
    },
}
</script>

<style lang="scss" scoped>
.form-area {
    margin: auto;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    form {
        h1 {
            font-size: 1.5rem;
        }
        width: 100%;
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