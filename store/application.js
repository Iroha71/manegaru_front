export const state = () => ({
    greetingCount: 0
})

export const mutations = {
    incrementGreetingCount(state) {
        state.greetingCount++
    }
}

export const actions = {
    incrementGreetingCount(context) {
        context.commit('incrementGreetingCount')
    }
}

export const getters = {
    greetingCount: (state) => state.greetingCount
}