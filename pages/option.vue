<template lang="html">
    <div class="content section">
        <h2>
            {{ currentTabName }}を変更する
            <IconButton v-if="!isEditting"
                type="is-info"
                iconName="edit"
                message="編集しなおす"
                @click="isEditting=true" />
        </h2>
        <div class="column is-4">
            <ValidationObserver v-if="currentTab=='userInfo'" v-slot="{ invalid }">
                <p class="has-text-weight-bold">メールアドレス</p>
                <EditableText :defaultValue="email"
                    editType="text"
                    validateRules="required"
                    v-model="userEmail"
                    isBundleEdit
                    :isEditting="isEditting" />
                <b-field v-if="!isEdittingPassword">
                    <b-button type="is-danger" @click="isEdittingPassword=true">パスワードを変更する</b-button>
                </b-field>
                <Vinput v-else label="パスワード" type="password" rules="required|max:20|min:6" v-model="password" />
                <p class="has-text-weight-bold">名前</p>
                <EditableText :defaultValue="name"
                    editType="text"
                    validateRules="required|max:20"
                    v-model="userName"
                    isBundleEdit
                    :isEditting="isEditting" />
                <p class="has-text-weight-bold">ニックネーム</p>
                <EditableText :defaultValue="nickname"
                    editType="text"
                    validateRules="required|max:10"
                    v-model="userNickname"
                    isBundleEdit
                    :isEditting="isEditting" />
                <RequireSelect label="一人称" :options="personalPronouns" v-model="personalPronoun" />
                <b-button type="is-success" :disabled="invalid" @click="changeUserInfo()">変更を反映する</b-button>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
import Vinput from '@/components/parts/ValidateInput.vue'
import IconButton from '@/components/parts/IconButton.vue'
import EditableText from '@/components/parts/EditableText.vue'
import { ValidationObserver } from 'vee-validate'
import { mapGetters, mapActions } from 'vuex'
import RequireSelect from '@/components/parts/RequireSelect.vue'
export default {
    components: {
        Vinput,
        IconButton,
        ValidationObserver,
        EditableText,
        RequireSelect
    },
    data() {
        return {
            userEmail: this.$store.getters['user/email'],
            isEdittingPassword: false,
            password: '',
            userName: this.$store.getters['user/name'],
            userNickname: this.$store.getters['user/nickname'],
            personalPronoun: this.$store.getters['user/personalPronoun'],
            isEditting: true
        }
    },
    methods: {
        ...mapActions('user', ['updateUser', 'updatePassword']),
        async changeUserInfo() {
            if(this.password !== '') {
                await Promise.all([
                    this.updateUser({email: this.userEmail, name: this.userName, nickname: this.userNickname, personalPronoun: this.personalPronoun}),
                    this.updatePassword({newPassword: this.password, confirmPassword: this.password})
                ])
                this.isEdittingPassword = false
            } else {
                this.updateUser({email: this.userEmail, name: this.userName, nickname: this.userNickname, personalPronoun: this.personalPronoun})
            }
            this.isEditting = false
        },
    },
    computed: {
        ...mapGetters('user', ['email', 'name', 'nickname', 'personalPronouns']),
        ...mapGetters('option', ['currentTab', 'currentTabName'])
    }
}
</script>

<style scoped>
.column {
    font-size: 1.2rem;
}
</style>