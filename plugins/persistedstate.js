import createPersistedState from 'vuex-persistedstate'
export default({store}) => {
    onNuxtReady(() => {
        createPersistedState({
            key: 'comcon',
            paths: [
                'auth',
                'girl',
                'option.isPlayBgm', 'option.isPlayVoice', 'option.isToastTask', 'option.toastWay', 'topApplySeason',
                'project',
                'user'
            ]
        })(store)
    })
}