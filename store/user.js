export const state = () => ({
    id: '',
    name: '',
    nickname: '',
    personalPronoun: '',
    gold: 0
})

export const mutations = {
    set(state, user){
        state.id = user.id
        state.name = user.name
        state.nickname = user.nickname
        state.personalPronoun = user.personalPronoun
        state.gold = user.gold
    }
}

const signInPath = 'auth/sign_in'

export const actions = {
    setUser(context, user){
        context.commit('set', user)
    },

    async signIn({commit, dispatch}, {email, password}){
        const userInfo = { email: email, password: password }
        const user = await dispatch('api/request', {method: 'post', endpoint: signInPath, params: userInfo}, {root: true})
        await commit('set', user.data.data)
        const headers = { access_token: user.headers['access-token'], client: user.headers['client'], uid: user.headers['uid'] }
        await dispatch('auth/setAuth', headers, {root: true})
        await dispatch('girl/setCurrentGirl', user.data.data.girl, {root: true})
    }
}