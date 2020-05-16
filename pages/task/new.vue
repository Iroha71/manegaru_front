<template lang="html">
<div class="column is-6 is-offset-3 has-background-light">
    <ValidationObserver v-slot="{ invalid }">
        <form>
            <Vinput label="タイトル" type="text" rules="required|max:50" v-model="form.title" />
            <b-field label="カテゴリ" label-position="on-border">
                <b-select v-model="form.project_id">
                    <option v-for="project in currentUser.projects" :value="project.id">{{ project.name }}</option>
                </b-select>
                <p class="control">
                    <button type="button" class="button is-success" @click="isCreatingProject=true">＋</button>
                </p>
            </b-field>
            <b-field>
                <b-radio-button type="is-danger" v-model="form.priority_id" native-value="1">Lv.3</b-radio-button>
                <b-radio-button type="is-success" v-model="form.priority_id" native-value="2">Lv.2</b-radio-button>
                <b-radio-button type="is-info" v-model="form.priority_id" native-value="3">Lv.1</b-radio-button>
            </b-field>
            <b-field label="通知日" label-position="on-border">
                <b-datepicker :minDate="minDate" v-model="form.notify_at" :month-names="$store.getters['master/monthNames']" />
                <b-field v-if="form.notify_at" label-position="on-border" label="通知時間">
                    <b-clockpicker v-if="form.notify_at"
                        v-model="form.notify_at"
                        hour-format="24"
                        :auto-switch="false">
                        <p>※時間は1時間ごとに通知します</p>
                    </b-clockpicker>
                </b-field>  
            </b-field>
            <b-field label-position="on-border" label="繰り返し設定" class="remind-setting">
                <b-select v-model="form.notify_interval">
                    <option :value="null">一回のみ</option>
                    <option value="day">毎日</option>
                    <option value="week">毎週</option>
                    <option value="month">毎月</option>
                </b-select>
            </b-field>    
            <Vinput label="メモ" type="textarea" rules="max:150" v-model="form.detail" />
            <b-field class="has-text-centered">
                <b-button type="is-success" size="is-medium" :disabled="invalid" @click="createTask()">作成</b-button>
            </b-field>
        </form>
    </ValidationObserver>
    <b-modal has-modal-card :active.sync="isCreatingProject">
        <div class="modal-card" style="width:auto">
            <header class="modal-card-head">新しいカテゴリの作成</header>
            <section class="modal-card-body">
                <p v-if="projectCreateError" class="has-text-danger">{{ projectCreateError }}</p>
                <Vinput v-model="newProjectName" label="カテゴリ名" type="text" rules="required" />
            </section>
            <footer class="modal-card-foot">
                <b-button type="is-success" style="margin: auto" @click="createProject()">作成する</b-button>
            </footer>
        </div>
    </b-modal>
</div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vinput from '~/components/parts/ValidateInput.vue'
import { mapActions, mapGetters } from 'vuex'

const GROUP_NOT_SELECTED = 0
const DEFAULT_PRIORITY = '3'
export default {
    components: {
        ValidationObserver,
        Vinput,
        ValidationProvider
    },
    mounted() {
        const today = new Date()
        this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const selectingGroup = this.$store.getters['user/selectingGroupId']
        if(selectingGroup === GROUP_NOT_SELECTED) {
            this.form.project_id = this.$store.getters['user/currentUser'].projects[0].id
        } else {
            this.form.project_id = selectingGroup
        }
    },
    data() {
        return {
            minDate: null,
            isCreatingProject: false,
            form: {
                title: '',
                notify_at: null,
                priority_id: DEFAULT_PRIORITY,
                detail: '',
                project_id: 0,
                notify_interval: null
            },
            newProjectName: '',
            projectCreateError: ''
        }
    },
    methods: {
        ...mapActions('user', ['addGroup']),
        async createTask() {
            await this.$api.task.create(this.form)
            this.$router.push('/task/')
        },
        async createProject() {
            try {
                const project = await this.$api.project.create({ name: this.newProjectName })
                this.addGroup(project.data)
            } catch(e) {
                this.projectCreateError = e.response.data.message
                return
            }
            this.isCreatingProject = false
            const lastGroupIndex = this.currentUser.projects.length - 1
            const addedGroupName = this.currentUser.projects[lastGroupIndex].name
            this.$buefy.dialog.alert({
                type: 'is-success',
                message: `カテゴリ: ${addedGroupName}を作成しました`
            })
        }
    },
    computed: {
        ...mapGetters('user', ['currentUser']),
        isValidationError() {
            return this.$route.query.error
        }
    }
}
</script>

<style lang="scss" scoped>
.column {
    height: 100%;
    .b-checkbox {
        /deep/ .control-label {
            display: flex;
            align-items: center;
            img {
                height: 1.2rem;
                margin-right: 0.25rem;
            }
        }
    }
    .remind-setting {
        margin-left: 0.75rem;
    }
}
</style>