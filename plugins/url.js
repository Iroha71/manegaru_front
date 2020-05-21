import pathBuilder from './dynamicPathBuilder.js'
export default({ app }, inject) => {
    const dynamic = pathBuilder
    const urls = {
        login: '/login/',
        root: '/',
        girlSelect: '/girl/select',
        task: '/task/',
        newTask: '/task/new/',
        taskChild: dynamic('/task/'),
        userConfirmed: '/user/confirmed',
        tempRegist: '/user/finished-temp-regist/',
        coopedLine: '/user/cooped-line/',
        resetPassword: '/user/reset-password/',
        newUser: '/user/new',
        room: '/girl/room/',
        roomChild: dynamic('/girl/room/'),
        category: '/category/',
        editCategory: '/category/edit/',
        option: '/option/'
    }

    inject('url', urls)
}