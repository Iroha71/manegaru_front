import createPersistedState from 'vuex-persistedstate'
export default({store}) => {
    onNuxtReady(() => {
        createPersistedState({
            key: 'comcon',
            paths: [
                'auth',
                'girl',
                'option',
                'project',
                'user'
            ]
        })(store)
    })
}