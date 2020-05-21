<template>
    <div class="section">
        <h1 v-if="!isEditting" class="title">
            {{ category.name }} &nbsp;
            <IconButton type="is-info" iconName="edit" @click="changeEdittingMode()" />
        </h1>
        <b-field v-else label="カテゴリ名を入力" label-position="on-border">
            <b-input type="text" v-model="form.name" />
            <b-button type="is-success" @click="updateCategory()">変更する</b-button>
        </b-field>
        <b-field>
            <b-button type="is-danger" @click="deleteCategory()">このカテゴリを削除する</b-button>
        </b-field>
        <hr>
        <b-button type="is-info" @click="showTask()">タスクを見る</b-button>
        <div class="columns is-multiline">
            <Card v-for="task in categoryTask" :key="task.id" :title="task.title" size="is-3" @click="selectTask(task.id)">
                <template lang="html" v-slot:content>
                    <p>{{ task.updated_at }}<b-tag type="is-primary">更新</b-tag></p>
                    <p>{{ task.status }}</p>
                </template>
                <template lang="html" v-slot:footer>
                    <b-checkbox disabled v-model="selectedTasks" :native-value="task.id" type="is-primary" />
                </template>
            </Card>
        </div>
        <b-button v-if="selectedTasks.length!=0" type="is-info" class="category-move-btn" @click="isMoveSelect=true">移動</b-button>

        <b-modal :active.sync="isMoveSelect" has-modal-card>
            <div class="modal-card">
                <p class="has-text-danger" v-if="errors">{{ errors[0] }}</p>
                <header class="modal-card-head">移動先を選択してください</header>
                <section class="modal-card-body">
                    <b-field>
                        <b-select v-model="moveToCategoryId">
                            <option v-for="project in exclusionCurrentGroup"
                                :key="`option-${project.id}`"
                                :value="project.id">
                                {{ project.name }}
                            </option>
                        </b-select>
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <b-button type="is-info" @click="moveTask">タスクを移動する</b-button>
                </footer>
            </div>
        </b-modal>
    </div>
</template>

<script>
import Card from '@/components/Card.vue'
import { mapGetters, mapActions } from 'vuex'
import IconButton from '@/components/parts/IconButton.vue'
const CATEGORY_NOT_SELECTED = 0
export default {
    components: {
        Card,
        IconButton
    },
    data() {
        return {
            tasks: [],
            selectedTasks: [],
            moveToCategoryId: '',
            isEditting: false,
            isMoveSelect: false,
            showProjectId: this.$store.getters['user/selectingGroupId'],
            form: {
                name: ''
            },
            errors: []
        }
    },
    methods: {
        ...mapActions('user', ['setSelectingGroupId', 'setLoggedUser', 'updateGroup', 'fetchGroup']),
        async showTask() {
            this.showProjectId = this.selectingGroupId
            const tasks = await this.$api.project.show(this.selectingGroupId, { is_with_tasks: true })
            this.tasks = tasks.data.tasks
        },
        changeEdittingMode() {
            this.isEditting = true
            this.form.name = this.category.name
        },
        async updateCategory() {
            this.isEditting = false
            const updatedCategory = await this.$api.project.update(this.category.id, { project: this.form })
            this.updateGroup(updatedCategory.data)
        },
        deleteCategory() {
            this.$buefy.dialog.confirm({
                type: 'is-danger',
                message: `【${this.category.name}】を削除しますか?<br>(カテゴリ内のタスクも削除されます)`,
                confirmText: '削除する',
                cancelText: 'キャンセル',
                onConfirm: () => {
                    this.$api.project.delete(this.category.id, null)
                        .then(response => {
                            this.fetchGroup(response.data)
                            this.setSelectingGroupId(CATEGORY_NOT_SELECTED)
                            this.$router.push(this.$url.category)
                        })
                }
            })
        },
        selectTask(taskId) {
            const selectedIndex = this.selectedTasks.indexOf(taskId)
            if(selectedIndex >= 0) {
                this.selectedTasks.splice(selectedIndex, 1)
            } else {
                this.selectedTasks.push(taskId)
            }
        },
        async moveTask() {
            try {
                const params = { ids: this.selectedTasks, project_id: this.moveToCategoryId }
                await this.$api.exTask.bulkUpdate(params)
                this.isMoveSelect = false
                this.tasks = []
                this.selectedTasks = []
            } catch(e) {
                this.errors = e.response.data.message
            } finally {
                this.moveToCategoryId = ''
            }
        }
    },
    computed: {
        ...mapGetters('user', ['selectingGroupId', 'currentUser']),
        category() {
            const categories = this.currentUser.projects
            const FIRST_INDEX = 0
            if(this.selectingGroupId === 0) {
                this.setSelectingGroupId(categories[FIRST_INDEX].id)
            }
            const categoryObject = categories.find((category) => category.id === this.selectingGroupId)
            return categoryObject
        },
        categoryTask() {
            if(this.selectingGroupId == this.showProjectId) {
                return this.tasks
            } else {
                return []
            }
        },
        exclusionCurrentGroup() {
            let arrangedArray = []
            this.currentUser.projects.forEach(project => {
                if(project.id != this.selectingGroupId) {
                    arrangedArray.push(project)
                }
            });
            return arrangedArray
        }
    }
}
</script>

<style lang="scss" scoped>
.category-move-btn {
    height: 4rem;
    width: 4rem;
    font-size: 2rem;
    padding: 0;
    border-radius: 50%;
    position: fixed;
    z-index: 2;
    right: 0.75rem;
    bottom: 10%;
}
</style>