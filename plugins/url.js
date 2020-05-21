import pathBuilder from './dynamicPathBuilder.js'
export default({ app }, inject) => {
    const dynamic = pathBuilder
    const urls = {
        login: '/login/',
        root: '/',
        room: '/girl/room/',
        roomChild: dynamic('/girl/room/')
    }

    inject('url', urls)
}