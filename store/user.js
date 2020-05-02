export const state = () => ({
    currentUser: ''
})

export const mutations = {
    set(state, user){
        state.currentUser = user
    },

    clear(state) {
        state.currentUser = ''
    }
}

const signInPath = 'auth/sign_in'
const signOutPath = 'auth/sign_out'

export const actions = {
    setUser(context, user){
        context.commit('set', user)
    },

    clearUser(context) {
        context.commit('clear')
    },

    async signIn({commit, dispatch}, {email, password}){
        const userInfo = { email: email, password: password }
        const user = await dispatch('api/request', {method: 'post', endpoint: signInPath, params: userInfo}, {root: true})
        commit('set', user.data.data)
        const headers = { access_token: user.headers['access-token'], client: user.headers['client'], uid: user.headers['uid'] }
        dispatch('auth/setAuth', headers, {root: true})
        dispatch('girl/setCurrentGirl', user.data.data.girl, {root: true})
        dispatch('option/setAppSettingFromStore', {toastWay: user.data.data.notify_method}, {root: true})
    },

    async signOut({commit, dispatch}) {
        await dispatch('api/request', {method: 'delete', endpoint: signOutPath, params: null}, {root: true})
        await commit('clear')
        await dispatch('auth/clearAuth', null, {root: true})
    },

    async signUp({dispatch}, {email, password, name, nickname, pronoun}) {
        const userInfo = { email: email, password: password, name: name, nickname: nickname, personal_pronoun: pronoun }
        const user = await dispatch('api/request', {method: 'post', endpoint: 'auth', params: userInfo}, {root: true})
        return user.data.data.email
    },

    async get({dispatch, commit}, userId) {
        const user = await dispatch('api/request', {method: 'get', endpoint: `user/${userId}`, params: null}, {root: true})
        commit('set', user.data)
        return user.data
    },

    async registLineId({dispatch}, lineId) {
        const lineParam = { line_id: lineId }
        const lineInfo = await dispatch('api/request', {method: 'put', endpoint: 'user/1', params: lineParam}, {root: true})
        return lineInfo.data
    },

    async updateUser({dispatch, commit}, user) {
        const userInfo = { email: user.email, name: user.name, nickname: user.nickname, personal_pronoun: user.personalPronoun, notify_method: user.notify_method }
        const result = await dispatch('api/request', {method: 'put', endpoint: 'user/1', params: userInfo}, {root: true})
        dispatch('auth/setAuth', result.headers, {root: true})
        commit('set', result.data)
    },

    async resetPassword({dispatch}, email) {
        const param = { email: email }
        await dispatch('api/request', {method: 'post', endpoint: 'auth/password', params: param}, {root: true})
    },

    async updatePassword({dispatch}, {newPassword, confirmPassword}) {
        const passwordInfo = { password: newPassword, password_confirmation: confirmPassword }
        const result = await dispatch('api/request', {method: 'put', endpoint: 'auth/password', params: passwordInfo}, {root: true})
        if(result.data.success) {
            await dispatch('user/signIn', {email: result.data.data.email, password: newPassword}, {root: true})
        }
    },

    async fetchGold({commit, dispatch}) {
        const gold = await dispatch('api/request', {method: 'get', endpoint: 'user/get_gold', params: null}, {root: true})
        commit('set', {gold: gold.data})
        return gold.data
    }
}

export const getters = {
    currentUser: (state) => state.currentUser
}