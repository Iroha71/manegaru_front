export default ({store, redirect, $axios}) => {
    $axios.onRequest(config => {
        config.headers.common['access-token'] = store.getters['auth/access_token']
        config.headers.common['client'] = store.getters['auth/client']
        config.headers.common['uid'] = store.getters['auth/uid']
    })

    $axios.onResponse(response => {
        store.dispatch('api/stopLoad')
    })

    $axios.onError(error => {
        store.dispatch('api/stopLoad')
        try{
            if(error.response.status == 401){
                redirect('/login?error=401')
            }else{
                $nuxt.error({
                    statusCode: error.response.status,
                    message: 'エラーが発生しました'
                })
            }
        }catch(catchError){
            $nuxt.error({
                statusCode: 500,
                message: 'サーバでエラーが発生しました'
            })
        }
    })
}