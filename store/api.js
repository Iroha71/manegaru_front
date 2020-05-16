export const state = () => ({
    isLoading: false
})

export const mutations = {
    setIsLoading(state, isLoading){
        state.isLoading = isLoading
    }
}

export const actions = {
    stopLoad(context){
        context.commit('setIsLoading', false)
    },

    startLoad(context) {
        context.commit('setIsLoading', true)
    }
}

export const getters = {
    isLoading: (state) => state.isLoading
}