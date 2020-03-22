<template lang="html">
<div class="column is-6 is-offset-3 has-background-light">
    <ValidationObserver v-slot="{ invalid }">
        <form>
            <Vinput label="タイトル" type="text" rules="required|max:50" v-model="title" />
            <b-field label="プロジェクト">
                <ValidationProvider rules="min:1" v-slot="{ error }">
                    <b-select v-model="projectId">
                        <option v-for="project in projects" :value="project.id">{{ project.name }}</option>
                    </b-select>
                </ValidationProvider>
            </b-field>
            <b-field>
                <b-radio-button type="is-danger" v-model="level" native-value="3">Lv.3</b-radio-button>
                <b-radio-button type="is-success" v-model="level" native-value="2">Lv.2</b-radio-button>
                <b-radio-button type="is-info" v-model="level" native-value="1">Lv.1</b-radio-button>
            </b-field>
            <b-field label="期限">
                <b-datepicker :minDate="minDate" v-model="limitDate" />
            </b-field>
            <Vinput label="詳細" type="textarea" rules="max:150" v-model="detail" />
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
            limitDate: null,
            level: "2",
            detail: '',
            projectId: 0
        }
    },
    methods: {
        ...mapActions({ 'insertTask': 'task/insertTask' }),
        registTask:function() {
            const taskInfo = {
                title: this.title,
                toast_at: this.arrangeDate(this.limitDate),
                priority_id: this.level,
                detail: this.detail,
                project_id: this.projectId
            }
            this.insertTask(taskInfo).then(registedTask => {
                this.$router.push(`/task/${registedTask.data.id}/`)
            })
        },
        
        arrangeDate:function(date) {
            if(date !== null) {
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDate()
                return `${year}/${month + 1}/${day}`
            } else {
                return null
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.column {
    height: 100%;
}
</style>