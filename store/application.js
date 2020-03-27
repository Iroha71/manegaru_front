export const state = () => ({
    greetingCount: 0,
    topVisitedAt: 0
})

export const mutations = {
    incrementGreetingCount(state) {
        state.greetingCount++
    },
    fetchTopVisitedAt(state, visitedAt) {
        state.topVisitedAt = visitedAt
    }
}

export const actions = {
    incrementGreetingCount(context) {
        context.commit('incrementGreetingCount')
    },
    fetchTopVisitedAt(context) {
        context.commit('fetchTopVisitedAt', new Date())
    }
}

export const getters = {
    greetingCount: (state) => state.greetingCount,
    topVisitedAt: (state) => state.topVisitedAt
}