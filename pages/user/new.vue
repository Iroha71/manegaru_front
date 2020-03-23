<template>
    <div class="column is-4 is-offset-4-desktop">
        <ValidationObserver v-slot="{ invalid }">
            <form class="section">
                <p class="has-text-danger" v-if="hasEmailError">{{ hasEmailError }}</p>
                <Vinput label="メールアドレス" type="text" rules="required|max:50" v-model="email" />
                <Vinput label="パスワード(6~20文字)"
                    type="password"
                    rules="required|min:6|max:20|confirmed:confirmPassword"
                    v-model="password" />
                <Vinput label="パスワード(確認)" type="password" rules="" v-model="confirmPassword" vid="confirmPassword" />
                <Vinput label="ユーザ名" type="text" rules="required|max:20" v-model="name" />
                <Vinput label="ニックネーム(秘書たちからの呼ばれ方)" type="text" rules="required|max:10" v-model="nickname" />
                <RequireSelect label="一人称" :options="personalPronouns" v-model="pronoun" />
                <b-field class="has-text-centered">
                    <b-button type="is-success" :disabled="invalid" size="is-medium" @click="registUser()">登録</b-button>
                </b-field>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import Vinput from '@/components/parts/ValidateInput.vue'
import RequireSelect from '@/components/parts/RequireSelect.vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapActions, mapGetters } from 'vuex'
export default {
    layout: 'fullScreenWithHeader',
    components: {
        Vinput,
        RequireSelect,
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            nickname: '',
            pronoun: ''
        }
    },
    methods: {
        ...mapActions({ 'signUp': 'user/signUp' }),
        registUser() {
            const userParam = {
                email: this.email,
                password: this.password,
                name: this.name,
                nickname: this.nickname,
                personal_pronoun: this.pronoun
            }
            this.signUp({email: this.email, password: this.password, name: this.name, nickname: this.nickname, pronoun: this.pronoun})
            .then(confirmingEmail => {
                this.$router.push(`/user/finished-temp-regist/?confirmingEmail=${confirmingEmail}`)
            })
            .catch(error => {
                
            })
        }
    },
    computed: {
        ...mapGetters('master', ['personalPronouns']),
        hasEmailError() {
            if(this.$route.query.error == '422')
                return 'このメールアドレスは既に登録されています'
            else
                return false
        }
    }
}
</script>