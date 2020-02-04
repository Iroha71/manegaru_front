export default({route, redirect, store}) => {
    if(isRequireAuthPage(route.path)) {
        try{
            const storeData = JSON.parse(localStorage.getItem('comcon'))
            if(storeData.auth.access_token){
                store.dispatch('user/setUser', storeData.user)
                store.dispatch('auth/setAuth', storeData.auth)
                setCurrentGroupToStore(store, storeData.project)
                setCurrentGirlToStore(store, storeData.girl)
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
    const noAuthPagePath = ['/login/', '/user/new/', '/user/finished-temp-regist/']
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

const setCurrentGroupToStore = (store, project) => {
    store.dispatch('project/setCurrentGroupId', project.currentGroupId)
}

const setCurrentGirlToStore = (store, girl) => {
    store.dispatch('girl/setCurrentGirl', { id: girl.currentGirl.id, code: girl.currentGirl.code })
}