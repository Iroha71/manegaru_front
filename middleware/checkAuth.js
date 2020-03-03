export default({route, redirect, store}) => {
    if(isRequireAuthPage(route.path)) {
        try{
            const storeData = JSON.parse(localStorage.getItem('comcon'))
            if(storeData.auth.access_token){
                store.dispatch('user/setUser', storeData.user)
                store.dispatch('auth/setAuth', storeData.auth)
                store.dispatch('project/setCurrentGroupId', storeData.project.currentGroupId)
                store.dispatch('girl/setCurrentGirl', { id: storeData.girl.currentGirl.id, code: storeData.girl.currentGirl.code })
                if(isEmptyCurrentGirl(storeData) && arrangePagePath(route.path) !== '/girl/select/' && arrangePagePath(route.path) !== '/user/cooped-line/') {
                    redirect('/girl/select?isFirst=true')
                }
            }else{
               throw new Error('no authorized') 
            }
        }catch(error){
            console.log(error)
            let openedLINEParam = route.query.openExternalBrowser === '1' ? '?opened=line' : ''
            redirect('/login/' + openedLINEParam)
        }
    } else {
        if(localStorage.getItem('comcon')) {
            localStorage.removeItem('comcon')
        }
    }
    
}

const isRequireAuthPage = (pagePath) => {
    const noAuthPagePath = ['/login/', '/user/new/', '/user/finished-temp-regist/', '/user/confirmed/', '/cooped-line/', '/user/reset-password/']
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

const isEmptyCurrentGirl = (store) => {
    return store.girl.currentGirl.id === '' || store.girl.currentGirl.code === ''
}