export const state = () => ({
    currentUser: '',
    selectingGroupId: 0
})

export const mutations = {
    set(state, user){
        state.currentUser = user
    },
    clear(state) {
        state.currentUser = ''
    },
    setSelectingGroupId(state, selectingGroupId) {
        state.selectingGroupId = selectingGroupId
    },
    addGroup(state, newGroup) {
        state.currentUser.projects.push(newGroup)
    },
    updateGroup(state, updatedGroup) {
        const targetIndex = state.currentUser.projects.findIndex((p) => p.id == updatedGroup.id)
        state.currentUser.projects.splice(targetIndex, 1, updatedGroup)
    },
    fetchGroup(state, groups) {
        state.currentUser.projects = []
        state.currentUser.projects = groups
    }
}

export const actions = {
    clearLoggedUser(context) {
        context.commit('clear')
    },
    
    setLoggedUser(context, loggedUser) {
        loggedUser = loggedUser.data ? loggedUser.data : loggedUser
        context.commit('set', loggedUser)
    },

    setSelectingGroupId(context, selectingGroupId) {
        context.commit('setSelectingGroupId', selectingGroupId)
    },

    addGroup(context, newGroup) {
        context.commit('addGroup', newGroup)
    },

    updateGroup(context, updatedGroup) {
        context.commit('updateGroup', updatedGroup)
    },

    fetchGroup(context, groups) {
        context.commit('fetchGroup', groups)
    }
}

export const getters = {
    currentUser: (state) => state.currentUser,
    selectingGroupId: (state) => state.selectingGroupId
}