export default ({app, store, redirect, $axios, route}) => {
    $axios.onRequest(config => {
        store.dispatch('api/startLoad')
        config.headers.common['access-token'] = store.getters['auth/access_token']
        config.headers.common['client'] = store.getters['auth/client']
        config.headers.common['uid'] = store.getters['auth/uid']
    })

    $axios.onResponse(response => {
        setTimeout(() => {
            store.dispatch('api/stopLoad')
        }, 300)
    })

    $axios.onError(error => {
        store.dispatch('api/stopLoad')
        console.log(error.response)
        if(error.response.status == 401 || error.response.status == 403) {
            if(app.context.route.path == app.$url.login && app.context.route.query.error == 401) {
                redirect(301, `${app.$url.login}`)
                return
            }
            redirect(301, `${app.$url.login}?error=${error.response.status}`)
        } else if(error.response.status != 422) {
            $nuxt.error({
                statusCode: error.response.status,
                message: 'サーバでエラーが発生しました'
            })
        }
    })
}