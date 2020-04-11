<template lang="html">
<div class="column is-6 is-offset-3 has-background-light">
    <ValidationObserver v-slot="{ invalid }">
        <form>
            <Vinput label="タイトル" type="text" rules="required|max:50" v-model="title" />
            <b-field label="グループ">
                <ValidationProvider rules="min:1" v-slot="{ error }">
                    <b-select v-model="projectId">
                        <option v-for="project in projects" :value="project.id">{{ project.name }}</option>
                    </b-select>
                </ValidationProvider>
            </b-field>
            <b-field>
                <b-radio-button type="is-danger" v-model="level" native-value="1">Lv.3</b-radio-button>
                <b-radio-button type="is-success" v-model="level" native-value="2">Lv.2</b-radio-button>
                <b-radio-button type="is-info" v-model="level" native-value="3">Lv.1</b-radio-button>
            </b-field>
            <b-field label="通知日" label-position="on-border">
                <b-datepicker :minDate="minDate" v-model="notifyAt" :month-names="$store.getters['master/monthNames']" />
                <b-clockpicker v-if="notifyAt"
                    v-model="notifyAt"
                    hour-format="24"
                    :auto-switch="false">
                    <p>※時間は1時間ごとに通知します</p>
                </b-clockpicker>
            </b-field>
            <b-field v-if="notifyAt" label-position="on-border" label="通知時間">
                <b-field label-position="on-border" label="繰り返し設定" class="remind-setting">
                    <b-select v-model="notifyInterval">
                        <option :value="null">一回のみ</option>
                        <option value="day">毎日</option>
                        <option value="week">毎週</option>
                        <option value="month">毎月</option>
                    </b-select>
                </b-field>
            </b-field>
            
            <Vinput label="メモ" type="textarea" rules="max:150" v-model="detail" />
            <b-field class="has-text-centered">
                <b-button type="is-success" size="is-medium" :disabled="invalid" @click="registTask()">作成</b-button>
            </b-field>
        </form>
    </ValidationObserver>
</div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vinput from '~/components/parts/ValidateInput.vue'
import { mapActions } from 'vuex'
export default {
    components: {
        ValidationObserver,
        Vinput,
        ValidationProvider
    },
    async asyncData({store}) {
      const projects = await store.dispatch('project/getAll')
      return { projects: projects } 
    },
    mounted() {
        const today = new Date()
        this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        this.projectId = this.$store.getters['project/currentGroupId'] === 0 ? this.projects[0].id : this.$store.getters['project/currentGroupId']
    },
    data() {
        return {
            title: '',
            minDate: null,
            notifyAt: null,
            level: "2",
            detail: '',
            projectId: 0,
            notifyInterval: null,
            notify_time: new Date()
        }
    },
    methods: {
        ...mapActions({ 'insertTask': 'task/insertTask' }),
        registTask:function() {
            const taskInfo = {
                title: this.title,
                notify_at: this.notifyAt,
                priority_id: this.level,
                detail: this.detail,
                project_id: this.projectId,
                notify_interval: this.notifyInterval
            }
            this.insertTask(taskInfo).then(registedTask => {
                this.$router.push(`/task/`)
            })
        }
    },
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