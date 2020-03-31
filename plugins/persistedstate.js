import createPersistedState from 'vuex-persistedstate'
export default({store}) => {
    onNuxtReady(() => {
        createPersistedState({
            key: 'manegaru',
            paths: [
                'auth',
                'girl',
                'project',
                'user'
            ]
        })(store)
        createPersistedState({ key: 'manegaru_option', paths: [ 'option' ] })(store)
        createPersistedState({
            key: 'manegaru',
            paths: [ 'application' ],
            storage: window.sessionStorage
        })(store)
    })
}