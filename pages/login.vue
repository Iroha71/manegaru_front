<template lang="html">
<div class="columns">
    <div class="form-area column is-offset-4 is-4">
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
                <p>パスワードを忘れた</p>
                <b-button type="is-danger" :loading="$store.getters['api/isLoading']">パスワードリセットメール送信</b-button>
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
        ...mapActions({ 'signIn': 'user/signIn', 'registLineId': 'user/registLineId' }),
        signInUser() {
            this.signIn({email: this.email, password: this.password})
                .then(res => {
                    if(this.lineId === '') {
                        this.$router.push('/')
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
    display: flex;
    align-items: center;
    form {
        h1 {
            font-size: 1.5rem;
        }
        width: 100%;
        &.section {
            padding: 1.5rem;
        }
        .password-reset-area {
            margin-bottom: 0.75rem;
        }
    }
}
</style>