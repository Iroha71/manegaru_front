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
        createPersistedState({
            key: 'comcon',
            paths: [ 'application' ],
            storage: window.sessionStorage
        })(store)
    })
}