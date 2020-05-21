import buildApi from '~/api/rest.js'
import buildExAuth from '~/api/auth.js'
import buildExTask from '~/api/task.js'
export default(app, inject) => {
    const restApi = buildApi(app.$axios)
    const exAuth = buildExAuth(app.$axios)
    const exTask = buildExTask(app.$axios)
    const baseUrl = process.env.BASE_URL
    const apis = {
        user: restApi(baseUrl + 'user'),
        auth: restApi(baseUrl + 'auth'),
        exAuth: exAuth,
        task: restApi(baseUrl + 'task'),
        exTask: exTask,
        girl: restApi(baseUrl + 'girl'),
        userGirl: restApi(baseUrl + 'user_girl'),
        serifu: restApi(baseUrl + 'serifu'),
        project: restApi(baseUrl + 'project')
    }

    inject('api', apis)
}