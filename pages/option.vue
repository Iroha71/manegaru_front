<template lang="html">
    <div class="content section">
        <h2 v-if="currentTab!=='lineCoop'">
            {{ currentTabName }}を変更する
            <IconButton v-if="!isEditting"
                type="is-info"
                iconName="edit"
                message="編集しなおす"
                @click="isEditting=true" />
        </h2>
        <ValidationObserver tag="div" v-if="currentTab=='userInfo'" class="column is-4" v-slot="{ invalid }">
            <div v-for="(user, key) in userForm" :key="`user${key}`" class="form-area">
                <RequireSelect v-if="key=='personalPronoun'" label="一人称" :options="personalPronouns" v-model="user.value" />
                <span v-else-if="key=='password'">
                    <b-field v-if="!isEdittingPassword">
                        <b-button type="is-danger" @click="isEdittingPassword=true">パスワードを変更する</b-button>
                    </b-field>
                    <Vinput v-else label="パスワード" type="password" rules="required|max:20|min:6" v-model="user.value" />
                </span>
                <span v-else>
                    <p class="has-text-weight-bold">{{ user.label }}</p>
                    <EditableText :defaultValue="user.value"
                        :editType="user.type"
                        :validateRules="user.rules"
                        v-model="user.value"
                        isBundleEdit
                        :isEditting="isEditting" />
                </span>
            </div>
            <b-button type="is-success" :disabled="invalid" @click="changeUserInfo()">変更を反映する</b-button>
        </ValidationObserver>
        <ValidationObserver tag="div" v-if="currentTab=='appSetting'" class="column is-6" v-slot="{ invalid }">
            <b-field v-for="(setting, key) in settingForm" :key="`setting${setting.label}`" :label="setting.label">
                <b-switch v-if="isSwitchableField(key)" v-model="setting.value">
                    {{ setting.value == true ? setting.trueMessage : setting.falseMessage }}
                </b-switch>
                <b-field v-if="key=='toastWay' && settingForm.isToastTask.value" label="通知方法">
                    <b-select v-model="setting.value">
                        <option value="mail">メールで通知</option>
                        <option value="line">LINEで通知</option>
                    </b-select>
                </b-field>
                <b-field v-if="key=='topApplySeason'">
                    <b-select v-model="setting.value">
                        <option v-for="season in choisableSeasons" :value="season.value">{{ season.name }}</option>
                    </b-select>
                </b-field>
            </b-field>
            <b-button type="is-success" :disabled="invalid" @click="saveAppSetting()">変更を反映する</b-button>
        </ValidationObserver>
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
            isEdittingPassword: false,
            password: '',
            userForm: {
                email: { label: 'メールアドレス', value: this.$store.getters['user/email'], type: 'text', rules: "required" },
                name: { label: '名前', value: this.$store.getters['user/name'], type: "text", rules: "required|max:20" },
                nickname: { label: 'ニックネーム', value: this.$store.getters['user/nickname'], type: "text", rules: "required|max:10" },
                password: { value: '' },
                personalPronoun: { value: this.$store.getters['user/personalPronoun'] }
            },
            settingForm: {
                isPlayBgm: { label: 'BGM', value: this.$store.getters['option/isPlayBgm'], trueMessage: 'BGMを再生中', falseMessage: 'BGMを停止中' },
                isPlayVoice: { label: 'VOICEROIDの声', value: this.$store.getters['option/isPlayVoice'], trueMessage: '声を再生中', falseMessage: '声を停止中' },
                isToastTask: { label: '通知', value: this.$store.getters['option/isToastTask'], trueMessage: '期限が近いタスクを通知する', false: '期限が近いタスクを通知しない' },
                toastWay: { value: this.$store.getters['option/toastWay']},
                topApplySeason: { label: 'トップ画面の季節', value: this.$store.getters['option/topApplySeason'] }
            },
            isEditting: true
        }
    },
    methods: {
        ...mapActions('user', ['updateUser', 'updatePassword']),
        ...mapActions('option', ['setAppSetting']),
        async changeUserInfo() {
            if(this.password !== '') {
                await Promise.all([
                    this.updateUser({email: this.userForm.email.value, name: this.userForm.name.value, nickname: this.userForm.nickname.value, personalPronoun: this.userForm.personalPronoun.value}),
                    this.updatePassword({newPassword: this.userForm.password.value, confirmPassword: this.userForm.password.value})
                ])
                this.isEdittingPassword = false
            } else {
               await this.updateUser({email: this.userForm.email.value, name: this.userForm.name.value, nickname: this.userForm.nickname.value, personalPronoun: this.userForm.personalPronoun.value})
            }
            this.isEditting = false
            this.$buefy.toast.open({
                type: 'is-success',
                message: 'あなたの情報を更新しました'
            })
        },
        saveAppSetting() {
            this.setAppSetting(this.settingForm)
            //railsに通知方法（meil or line or nothing)を送信

            this.$buefy.toast.open({
                type: 'is-success',
                message: 'アプリの設定を更新しました'
            })
        },
        isSwitchableField(key) {
            const noSwichableKey = ['toastWay', 'topApplySeason']
            return !noSwichableKey.includes(key)
        }
    },
    computed: {
        ...mapGetters('user', ['email', 'name', 'nickname', 'personalPronouns']),
        ...mapGetters('option', ['currentTab', 'currentTabName', 'choisableSeasons'])
    }
}
</script>

<style lang="scss" scoped>
.column {
    font-size: 1.2rem;
    .form-area {
        margin-bottom: 1rem;
        .has-text-weight-bold {
            margin-bottom: 0.5rem;
        }
    }
}
</style>