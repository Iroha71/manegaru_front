export const state = () => ({
    currentTab: 'userInfo'
})

export const mutations = {
    setTab(state, tabName) {
        state.currentTab = tabName
    }
}

export const actions = {
    setOptionTab(context, tabName) {
        context.commit('setTab', tabName)
    }
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
    }
}