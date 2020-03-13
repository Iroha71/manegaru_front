export default ({store, redirect, $axios, route}) => {
    $axios.onRequest(config => {
        store.dispatch('api/startLoad')
        config.headers.common['access-token'] = store.getters['auth/access_token']
        config.headers.common['client'] = store.getters['auth/client']
        config.headers.common['uid'] = store.getters['auth/uid']
    })

    $axios.onResponse(response => {
        setTimeout(() => {
            store.dispatch('api/stopLoad')
        }, 800)
    })

    $axios.onError(error => {
        store.dispatch('api/stopLoad')
        console.log(error.response)
        try{
            if(error.response.status == 401 || error.response.status == 403) {
                redirect(`/login/?error=${error.response.status}`)
            } else if(error.response.status == 422) {
                redirect(`${route.path}/?error=422`)
            } else {
                $nuxt.error({
                    statusCode: error.response.status,
                    message: 'サーバでエラーが発生しました'
                })
            }
        }catch(catchError){
            $nuxt.error({
                statusCode: 500,
                message: 'ネットワークエラーが発生しました' + error
            })
        }
    })
}