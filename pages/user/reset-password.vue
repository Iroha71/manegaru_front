<template>
    <div class="columns content section">
        <div class="has-text-centered"><p>新しいパスワードを入力してください</p></div>
        <ValidationObserver v-slot="{ invalid }">
            <form class="column is-3">
                <Vinput label="パスワード"
                    type="password"
                    rules="required|max:20|min:6|confirmed:confirmPassword"
                    :maxLength="20"
                    v-model="password" />
                <Vinput label="パスワード(再入力)"
                    type="password"
                    rules=""
                    v-model="confirmPassword"
                    vid="confirmPassword" />
                <b-field>
                    <b-button type="is-success" :disabled="invalid" @click="changePassword()">パスワードを変更</b-button>
                </b-field>
            </form>
        </ValidationObserver>
    </div>
</template>

<script>
import Vinput from '@/components/parts/ValidateInput.vue'
import { ValidationObserver } from 'vee-validate'
import { mapActions } from 'vuex'
export default {
    layout: 'fullScreenWithHeader',
    components: {
        Vinput,
        ValidationObserver
    },
    created() {
        if(!this.$route.query['access-token']) {
            this.$router.replace('/login/')
        }
    },
    data() {
        return {
            password: '',
            confirmPassword: ''
        }
    },
    methods: {
        ...mapActions({ 'updatePassword': 'user/updatePassword', 'setAuth': 'auth/setAuth' }),
        async changePassword() {
            this.setAuth(this.$route.query)
            const result = await this.updatePassword({newPassword: this.password, confirmPassword: this.confirmPassword})
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
.columns {
    display: flex;
    flex-direction: column;
    form {
        margin-left: auto;
        margin-right: auto;
    }
}
</style>