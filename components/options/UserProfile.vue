<template>
    <validation-observer tag="div" class="column is-4" v-slot="{ invalid }">
        <p v-for="error in errors" :key="error" class="has-text-danger over-message">{{ error }}</p>
        <EditableText label="メールアドレス"
            :defaultValue="user.email"
            editType="text"
            validateRules="required"
            v-model="form.email"
            isBundleEdit
            :isEditting="true" />
        <b-field v-if="!isEdittingPassword">
            <b-button type="is-danger" @click="isEdittingPassword=true">パスワードを変更する</b-button>
        </b-field>
        <Vinput v-else label="パスワード (6 ~ 20文字)" type="password" rules="required|max:20|min:6" v-model="form.password" />
        <EditableText label="名前 (20文字以内)"
            :defaultValue="user.name"
            editType="text"
            validateRules="required|max:20"
            v-model="form.name"
            isBundleEdit
            :isEditting="true" />
        <EditableText label="ニックネーム (10文字以内)"
            :defaultValue="user.nickname"
            editType="text"
            validateRules="required|max:10"
            v-model="form.nickname"
            isBundleEdit
            :isEditting="true" />
        <RequireSelect label="一人称" :options="personalPronouns" v-model="form.personal_pronoun" />
        <b-field label="通知方法">
            <b-select v-model="form.notify_method">
                <option value="nothing">通知しない</option>
                <option value="mail">メールで通知</option>
                <option value="line">LINEで通知</option>
            </b-select>
        </b-field>
    
        <b-button type="is-success" :disabled="invalid" @click="updateUserInfo()">変更を反映する</b-button>
    </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ValidationObserver } from 'vee-validate'
import EditableText from '@/components/parts/EditableText.vue'
import RequireSelect from '@/components/parts/RequireSelect.vue'
import Vinput from '@/components/parts/ValidateInput.vue'
export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    components: {
        ValidationObserver,
        EditableText,
        RequireSelect,
        Vinput
    },
    data() {
        return {
            isEdittingPassword: false,
            form: {
                email: this.user.email,
                name: this.user.name,
                nickname: this.user.nickname,
                personal_pronoun: this.user.personal_pronoun,
                password: '',
                notify_method: this.user.notify_method
            },
            errors: []
        }
    },
    methods: {
        ...mapActions('option', ['setIsEditting']),
        ...mapActions('user', ['setLoggedUser']),
        async updateUserInfo() {
            try {
                if(this.form.password != '') {
                    const [updatedUser, changedPassword] = await Promise.all([
                        this.$api.user.update(this.user.id, { user: this.form }),
                        this.$api.exAuth.updatePassword(this.form.password, this.form.password)
                    ])
                    this.isEdittingPassword = false
                    this.form.password = ''
                    this.setLoggedUser(updatedUser.data)
                } else {
                    const updatedUser = await this.$api.user.update(this.user.id, { user: this.form })
                    this.setLoggedUser(updatedUser.data)
                }
            } catch(e) {
                this.errors = e.response.data.message
            }
            this.errors = ''
            this.$buefy.toast.open({
                type: 'is-success',
                message: 'あなたの情報を更新しました'
            })
        }
    },
    computed: {
        ...mapGetters('master', ['personalPronouns'])
    }
}
</script>