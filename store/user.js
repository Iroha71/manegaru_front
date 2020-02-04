export const state = () => ({
    id: '',
    email: '',
    name: '',
    nickname: '',
    personal_pronoun: '',
    gold: 0
})

export const mutations = {
    set(state, user){
        state.id = user.id
        state.email = user.email
        state.name = user.name
        state.nickname = user.nickname
        state.personal_pronoun = user.personal_pronoun
        state.gold = user.gold
    },

    clear(state) {
        state.id = ''
        state.email = ''
        state.name = ''
        state.nickname = ''
        state.personal_pronoun = ''
        state.gold = ''
    }
}

const signInPath = 'auth/sign_in'
const signOutPath = 'auth/sign_out'

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
    },

    async signOut({commit, dispatch}) {
        await dispatch('api/request', {method: 'delete', endpoint: signOutPath, params: null}, {root: true})
        await commit('clear')
        await dispatch('auth/clearAuth', null, {root: true})
        localStorage.removeItem('comcon')
    },

    async signUp({dispatch}, {email, password, name, nickname, pronoun}) {
        const userInfo = { email: email, password: password, name: name, nickname: nickname, personal_pronoun: pronoun }
        const user = await dispatch('api/request', {method: 'post', endpoint: 'auth', params: userInfo}, {root: true})
        return user.data.data.email
    }
}

export const getters = {
    name: (state) => state.name,
    email: (state) => state.email,
    nickname: (state) => state.nickname,
    personalPronoun: (state) => state.personal_pronoun,
    gold: (state) => state.gold
}