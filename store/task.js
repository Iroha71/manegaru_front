export const actions = {
    async insertTask({dispatch}, taskInfo) {
        const task = await dispatch('api/request', {method: 'post', endpoint: 'task', params: taskInfo}, {root: true})
        return task
    }
}