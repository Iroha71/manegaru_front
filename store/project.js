export const state = () => ({
    groups: [],
    currentGroupId: 0
})

export const mutations = {
    setGroups(state, groups) {
        state.groups = groups
    },
    set(state, groupId) {
        state.currentGroupId = groupId
    }
}

const getAllPath = 'project'
export const actions = {
    async getAll({commit, dispatch}) {
        const project = await dispatch('api/request', {method: 'get', endpoint: getAllPath, params: null}, {root: true})
        commit('setGroups', project.data)
    },

    setCurrentGroupId(context, groupId) {
        context.commit('set', groupId)
    }
}

export const getters = {
    groups: (state) => state.groups,
    currentGroupId: (state) => state.currentGroupId
}