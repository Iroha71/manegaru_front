export const state = () => ({
    currentGirl: {
        id: '',
        code: ''
    }
})

export const mutations = {
    setCurrentGirl(state, girl){
        if(girl){
            state.currentGirl.id = girl.id
            state.currentGirl.code = girl.code
        }
    },
    clearCurrentGirl(state) {
        state.currentGirl.id = '',
        state.currentGirl.code = ''
    }
}

export const actions = {
    setCurrentGirl(context, girl){
        context.commit('setCurrentGirl', girl)
    },
    clearCurrentGirl(context) {
        context.commit('clearCurrentGirl')
    },
    async index({dispatch}, isFirst) {
        const girls = await dispatch('api/request', {method: 'get', endpoint: 'girl', params: isFirst}, {root: true})
        return girls.data
    }
}

export const getters = {
    currentGirlId: (state) => state.currentGirl.id,
    currentGirlCode: (state) => state.currentGirl.code
}