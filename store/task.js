export const actions = {
    async insertTask({dispatch}, taskInfo) {
        const task = await dispatch('api/request', {method: 'post', endpoint: 'task', params: taskInfo}, {root: true})
        return task
    },

    async show({dispatch}, taskId) {
        const task = await dispatch('api/request', {method: 'get', endpoint: `task/${taskId}`, params: null}, {root: true})
        return task
    },

    async countNotFinishTasks({dispatch}) {
        const taskCount = await dispatch('api/request', {method: 'get', endpoint: 'task/count_not_finish_tasks', params: null}, {root: true})
        return taskCount
    },

    async update({dispatch}, {taskId, changeContent}) {
        const task = await dispatch('api/request', {method: 'put', endpoint: `task/${taskId}`, params: changeContent}, {root: true})
        return task
    },

    async updateStatus({dispatch}, {taskId, status}) {
        const statusInfo = { status: status }
        const updatedStatus = await dispatch('api/request', {method: 'put', endpoint: `task/${taskId}/update_status`, params: statusInfo}, {root: true})
        return updatedStatus.data
    }
}