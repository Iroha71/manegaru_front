import createPersistedState from 'vuex-persistedstate'
export default({store}) => {
    onNuxtReady(() => {
        createPersistedState({
            key: 'comcon',
            paths: [
                'auth',
                'girl',
                'project',
                'user'
            ]
        })(store)
        createPersistedState({ key: 'comcon_option', paths: [ 'option' ] })(store)
        createPersistedState({
            key: 'comcon',
            paths: [ 'application' ],
            storage: window.sessionStorage
        })(store)
    })
}