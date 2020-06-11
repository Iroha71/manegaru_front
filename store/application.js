export const state = () => ({
    greetingCount: 0,
    topVisitedAt: 0,
    isFinishedTask: false,
    isAllowedSound: false
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
    },
    setIsAllowedSound(state, isAllowedSound) {
        state.isAllowedSound = isAllowedSound
    },
    clear(state) {
        state.greetingCount = 0
        state.topVisitedAt = 0
        state.isFinishedTask = false
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
    },
    setIsAllowedSound(context, isAllowedSound) {
        context.commit('setIsAllowedSound', isAllowedSound)
    },
    clearSession(context) {
        context.commit('clear')
    }
}

export const getters = {
    greetingCount: (state) => state.greetingCount,
    topVisitedAt: (state) => state.topVisitedAt,
    isFinishedTask: (state) => state.isFinishedTask,
    isAllowedSound: (state) => state.isAllowedSound
}