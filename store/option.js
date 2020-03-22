export const state = () => ({
    currentTab: 'userInfo',
    isPlayBgm: false,
    isPlayVoice: false,
    isToastTask: true,
    toastWay: 'line',
    topApplySeason: 'match'
})

export const mutations = {
    setTab(state, tabName) {
        state.currentTab = tabName
    },
    setAppSetting(state, setting) {
        state.isPlayBgm = setting.isPlayBgm.value
        state.isPlayVoice = setting.isPlayVoice.value
        state.isToastTask = setting.isToastTask.value
        state.toastWay = setting.toastWay.value
        state.topApplySeason = setting.topApplySeason.value
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
    setAppSetting(context, setting) {
        context.commit('setAppSetting', setting)
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
    topApplySeason: (state) => state.topApplySeason
}