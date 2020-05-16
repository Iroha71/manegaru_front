export const state = () => ({
    access_token: '',
    client: '',
    uid: ''
})

export const mutations = {
    set(state, authInfo){
        if(authInfo['access-token']) {
            state.access_token = authInfo['access-token']
        } else {
            state.access_token = authInfo.access_token
        }
        state.client = authInfo.client
        state.uid = authInfo.uid
    }
}

export const actions = {
    setAuth(context, authHeaders){
        context.commit('set', authHeaders)
    },
    clearAuth(context){
        context.commit('set', {
            access_token: '',
            client: '',
            uid: ''
        })
    }
}

export const getters = {
    access_token: (state) => state.access_token,
    client: (state) => state.client,
    uid: (state) => state.uid
}