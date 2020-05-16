export const state = () => ({
    currentTab: 'userInfo',
    isPlayBgm: false,
    isPlayVoice: false,
    isToastTask: true,
    toastWay: 'line',
    topApplySeason: 'match',
    isMoveTopAfterTaskComplete: true
})

export const mutations = {
    setTab(state, tabName) {
        state.currentTab = tabName
    },
    set(state, { key, value }) {
        state[key] = value
    },
    setAppSettingFromStore(state, setting) {
        Object.keys(setting).forEach((key) => {
            state[key] = setting[key]
        })
    }
}

export const actions = {
    setOptionTab(context, tabName) {
        context.commit('setTab', tabName)
    },
    setAppSetting(context, { key, value }) {
        context.commit('set', { key, value })
    },
    setAppSettingFromStore(context, setting) {
        context.commit('setAppSettingFromStore', setting)
    },
}

export const getters = {
    currentTab: (state) => state.currentTab,
    currentTabName: (state) => {
        switch(state.currentTab) {
            case 'userInfo':
                return 'ユーザ情報'
            case 'appSetting':
                return 'アプリ設定'
        }
    },
    isPlayBgm: (state) => state.isPlayBgm,
    isPlayVoice: (state) => state.isPlayVoice,
    isToastTask: (state) => state.isToastTask,
    toastWay: (state) => state.toastWay,
    topApplySeason: (state) => state.topApplySeason,
    isMoveTopAfterTaskComplete: (state) => state.isMoveTopAfterTaskComplete
}