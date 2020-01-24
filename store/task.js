export const actions = {
    async insertTask({dispatch}, taskInfo) {
        const task = await dispatch('api/request', {method: 'post', endpoint: 'task', params: taskInfo}, {root: true})
        return task
    },

    async show({dispatch}, taskId) {
        const task = await dispatch('api/request', {method: 'get', endpoint: `task/${taskId}`, params: null}, {root: true})
        return task
    }
}