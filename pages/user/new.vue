<template>
    <div class="column is-4 is-offset-4-desktop">
        <ValidationObserver v-slot="{ invalid }">
            <form class="section">
                <p class="has-text-danger" v-for="error in errors" :key="error">・{{ error }}</p>
                <Vinput label="メールアドレス" type="text" rules="required|max:50" v-model="form.email" />
                <Vinput label="パスワード(6~20文字)"
                    type="password"
                    rules="required|min:6|max:20|confirmed:confirmPassword"
                    v-model="form.password" />
                <Vinput label="パスワード(確認)" type="password" rules="" v-model="form.confirmed_password" vid="confirmPassword" />
                <Vinput label="ユーザ名" type="text" rules="required|max:20" v-model="form.name" />
                <Vinput label="ニックネーム(秘書たちからの呼ばれ方)" type="text" rules="required|max:10" v-model="form.nickname" />
                <RequireSelect label="一人称" :options="personalPronouns" v-model="form.personal_pronoun" />
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
            form: {
                email: '',
                password: '',
                confirmed_password: '',
                name: '',
                nickname: '',
                personal_pronoun: ''
            },
            errors: []
        }
    },
    methods: {
        async registUser() {
            try {
                const createdUser = await this.$api.auth.create({ registration: this.form })
                this.$router.push(`/user/finished-temp-regist/?confirmingEmail=${createdUser.data.data.email}`)
            } catch(e) {
                this.errors = e.response.data.errors.full_messages
            }
        }
    },
    computed: {
        ...mapGetters('master', ['personalPronouns'])
    }
}
</script>