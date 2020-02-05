<template>
    <div class="section content has-text-centered" v-if="!$route.query.error">
        <div class="has-background-success icon-area"><img src="/icons/checkbox.png" class="has-background-success"></div>
        <h3>アカウントの認証が完了しました</h3>
        <h4>パスワードを入力して秘書を選びに行きましょう</h4>
        <validation-observer v-slot="{ invalid }" tag="div" class="column is-3">
            <Vinput type="text" label="メールアドレス" rules="required" v-model="email" />
            <Vinput type="password" label="パスワード" rules="required" v-model="password" />
            <b-button size="is-large" type="is-success" :disabled="invalid" @click="goToGirlPage()">秘書を選択する</b-button>
        </validation-observer>
    </div>
    <div class="section content has-text-centered" v-else>
        <h3>このメールアドレスは既に認証されています</h3>
        <b-button type="is-success" size="is-large" @click="$router.push('/login')">サインインする</b-button>
    </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Vinput from '@/components/parts/ValidateInput.vue'
import { mapActions } from 'vuex'
export default {
    layout: 'fullScreenWithHeader',
    components: {
        Vinput,
        ValidationObserver
    },
    data() {
        return {
            inputedEmail: '',
            password: ''
        }
    },
    methods: {
        ...mapActions({ 'signIn': 'user/signIn' }),
        goToGirlPage() {
            const sendEmail = this.inputedEmail === '' ? this.email : this.inputedEmail
            this.signIn({ email: sendEmail, password: this.password })
            .then(res => {
                this.$router.push('/girl/select?isFirst=true')
            })
        }
    },
    computed: {
        email: {
            get() {
                return this.$route.query.confirmedEmail
            },
            set(value) {
                this.inputedEmail = value
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-area {
    margin: auto;
    height: 10vh;
    width: 10vh;
    padding: 0.25rem;
    img {
        height: 90%;
    }
}
.column {
    margin: auto;
}
</style>