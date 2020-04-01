export const state = () => ({
    greetingCount: 0,
    topVisitedAt: 0,
    isFinishedTask: false
})

export const mutations = {
    incrementGreetingCount(state) {
        state.greetingCount++
    },
    fetchTopVisitedAt(state, visitedAt) {
        state.topVisitedAt = visitedAt
    },
    setIsFinishedTask(state, isFinishedTask) {
        state.isFinishedTask = isFinishedTask
    }
}

export const actions = {
    incrementGreetingCount(context) {
        context.commit('incrementGreetingCount')
    },
    fetchTopVisitedAt(context) {
        context.commit('fetchTopVisitedAt', new Date())
    },
    setIsFinishedTask(context, isFinishedTask) {
        context.commit('setIsFinishedTask', isFinishedTask)
    }
}

export const getters = {
    greetingCount: (state) => state.greetingCount,
    topVisitedAt: (state) => state.topVisitedAt,
    isFinishedTask: (state) => state.isFinishedTask
}