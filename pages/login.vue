<template lang="html">
<div class="columns">
    <div class="form-area column is-offset-4 is-4">
        <form class="section">
            <h1>サインイン</h1>
            <p v-if="isAuthError" class="has-text-danger">メールアドレスまたはパスワードが間違っています</p>
            <b-field label="メールアドレス">
                <b-input v-model="email"></b-input>
            </b-field>
            <b-field label="パスワード">
                <b-input type="password" v-model="password" password-reveal></b-input>
            </b-field>
            <b-field class="has-text-centered">
               <b-button type="is-info" size="is-medium" @click="signInUser()" :loading="$store.getters['api/isLoading']">サインイン</b-button> 
            </b-field>
            <hr>
            <div class="password-reset-area">
                <p>パスワードを忘れた</p>
                <b-button type="is-danger" :loading="$store.getters['api/isLoading']">パスワードリセットメール送信</b-button>
            </div>
            <div>
                <p>未登録の場合</p>
                <b-button type="is-success" :loading="$store.getters['api/isLoading']">新規登録</b-button>
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
            password: ''
        }
    },
    methods: {
        ...mapActions({ 'signIn': 'user/signIn' }),
        signInUser:function(){
            this.signIn({email: this.email, password: this.password}).then(res => {
                this.$router.push('/')
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