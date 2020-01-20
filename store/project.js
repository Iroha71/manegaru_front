const getAllPath = 'project/'
export const actions = {
    async getAll({dispatch}) {
        const project = await dispatch('api/request', {method: 'get', endpoint: getAllPath, params: null}, {root: true})
        return project.data
    }
}