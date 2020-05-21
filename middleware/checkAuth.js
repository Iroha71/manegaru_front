export default({app, route, redirect, store}) => {
    redirectAccurateRoute(app, route, redirect)
    if(isRequireAuthPage(app, route.path)) {
        try{
            const storeData = JSON.parse(localStorage.getItem('manegaru'))
            const optionStoreData = JSON.parse(localStorage.getItem('manegaru_option'))
            if(storeData.auth.access_token == '') {
                throw new Error('no authorized')
            }
            store.dispatch('user/setLoggedUser', storeData.user.currentUser)
            store.dispatch('auth/setAuth', storeData.auth)
            store.dispatch('user/setSelectingGroupId', storeData.user.selectingGroupId)
            store.dispatch('option/setAppSettingFromStore', optionStoreData.option)
            if(isEmptyCurrentGirl(storeData) && !isMatchPath(route.path, app.$url.girlSelect) && !isMatchPath(route.path, app.$url.coopedLine)) {
                redirect('/girl/select?isFirst=true')
            }
            if(route.path === app.$url.root) {
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
            redirect( app.$url.login + '?error=401' + openedLINEParam)
        }
    } else {
        localStorage.removeItem('manegaru')
    }
}

const redirectAccurateRoute = (app, route, redirect) => {
    const lastPathStr = route.path.slice(-1)
    if(lastPathStr !== app.$url.root) {
        redirect(301, route.path + app.$url.root, route.query)
    }
}

const isRequireAuthPage = (app, pagePath) => {
    const noAuthPagePath = [app.$url.root, app.$url.newUser, app.$url.tempRegist, app.$url.userConfimed, app.$url.coopedLine, app.$url.resetPassword]
    return !noAuthPagePath.includes(pagePath)
}

const isMatchPath = (pagePath, targetPath) => {
    return pagePath === targetPath
}

const isEmptyCurrentGirl = (store) => {
    return store.user.currentUser.girl == null || store.user.currentUser.girl == ''
}