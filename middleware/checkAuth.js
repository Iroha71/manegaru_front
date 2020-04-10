export default({route, redirect, store}) => {
    redirectAccurateRoute(route, redirect)
    if(isRequireAuthPage(route.path)) {
        try{
            const storeData = JSON.parse(localStorage.getItem('manegaru'))
            const optionStoreData = JSON.parse(localStorage.getItem('manegaru_option'))
            if(storeData.auth.access_token == '') {
                throw new Error('no authorized')
            }
            store.dispatch('user/setUser', storeData.user.currentUser)
            store.dispatch('auth/setAuth', storeData.auth)
            store.dispatch('project/setCurrentGroupId', storeData.project.currentGroupId)
            store.dispatch('girl/setCurrentGirl', storeData.girl.currentGirl)
            store.dispatch('option/setAppSettingFromStore', optionStoreData.option)
            if(isEmptyCurrentGirl(storeData) && !isMatchPath(route.path, '/girl/select/') && !isMatchPath(route.path, '/user/cooped-line/')) {
                redirect('/girl/select?isFirst=true')
            }
            if(route.path === '/') {
                if(store.getters['application/isFinishedTask'] === true) {
                    store.dispatch('application/setIsFinishedTask', false)
                    if(!route.path.query) {
                        redirect('/?status=finishedTask')
                    }
                }
                store.dispatch('application/incrementGreetingCount')
            }
        }catch(error){
            console.log(error)
            let openedLINEParam = route.query.openExternalBrowser === '1' ? '&opened=line' : ''
            redirect('/login/?error=401' + openedLINEParam)
        }
    } else {
        localStorage.removeItem('manegaru')
    }
}

const redirectAccurateRoute = (route, redirect) => {
    const lastPathStr = route.path.slice(-1)
    if(lastPathStr !== '/') {
        redirect(301, route.path + '/', route.query)
    }
}

const isRequireAuthPage = (pagePath) => {
    const noAuthPagePath = ['/login/', '/user/new/', '/user/finished-temp-regist/', '/user/confirmed/', '/cooped-line/', '/user/reset-password/']
    return !noAuthPagePath.includes(pagePath)
}

const isMatchPath = (pagePath, targetPath) => {
    return pagePath === targetPath
}

const isEmptyCurrentGirl = (store) => {
    return store.girl.currentGirl == null || store.girl.currentGirl == ''
}