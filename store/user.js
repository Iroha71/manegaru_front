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
    }
}

export const getters = {
    currentUser: (state) => state.currentUser,
    selectingGroupId: (state) => state.selectingGroupId
}