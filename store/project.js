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
    },
    add(state, newGroup) {
        state.groups.push(newGroup)
    }
}

const getAllPath = 'project'
export const actions = {
    async getAll({commit, dispatch}) {
        const project = await dispatch('api/request', {method: 'get', endpoint: getAllPath, params: null}, {root: true})
        commit('setGroups', project.data)
        return project.data
    },

    setCurrentGroupId(context, groupId) {
        context.commit('set', groupId)
    },

    async create({dispatch, commit}, name) {
        const nameParam = { name: name }
        const newProject = await dispatch('api/request', {method: 'post', endpoint: getAllPath, params: nameParam}, {root: true})
        commit('add', newProject.data)
        return newProject.data
    } 
}

export const getters = {
    groups: (state) => state.groups,
    currentGroupId: (state) => state.currentGroupId
}