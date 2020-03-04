import createPersistedState from 'vuex-persistedstate'
export default({store}) => {
    onNuxtReady(() => {
        createPersistedState({ key: 'comcon' })(store)
    })
}