export const state = () => ({
    access_token: '',
    client: '',
    uid: ''
})

export const mutations = {
    setAuth(state, {access_token, client, uid}){
        state.access_token = access_token
        state.client = client
        state.uid = uid
    }
}

export const actions = {
    setAuth(context, {access_token, client, uid}){
        context.commit('setAuth', {
            access_token: access_token,
            client: client,
            uid: uid
        })
    },
    clearAuth(context){
        context.commit('setAuth', {
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