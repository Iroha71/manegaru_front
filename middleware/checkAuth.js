export default({route, redirect, store}) => {
    if(isRequireAuthPage(route.path)) {
        try{
            const authInfo = JSON.parse(localStorage.getItem('comcon'))
            if(authInfo.auth.access_token){
                store.dispatch('user/setUser', authInfo.user)
                store.dispatch('auth/setAuth', authInfo.auth)
            }else{
               throw new Error('no authorized') 
            }
        }catch(error){
            console.log(error)
            redirect('/login/')
        }
    } else {
        if(localStorage.getItem('comcon')) {
            localStorage.removeItem('comcon')
        }
    }
    
}

const isRequireAuthPage = (pagePath) => {
    const noAuthPagePath = ['/login/']
    const currentPage = arrangePagePath(pagePath)
    if(noAuthPagePath.includes(currentPage)){
        return false
    }else{
        return true
    }
}

const arrangePagePath = (pagePath) => {
    const lastStr = pagePath.slice(-1)
    if(lastStr !== '/'){
        pagePath += '/'
    }
    return pagePath
}