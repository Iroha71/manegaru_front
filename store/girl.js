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
    }
}

export const actions = {
    setCurrentGirl(context, girl){
        context.commit('setCurrentGirl', girl)
    }
}