export const state = () => ({
    isLoading: false
})

export const mutations = {
    setIsLoading(state, isLoading){
        state.isLoading = isLoading
    }
}

export const actions = {
    stopLoad(context){
        context.commit('setIsLoading', false)
    },
    
    request(context, {method, endpoint, params}){
        const requestUrl = process.env.BASE_URL + endpoint
        context.commit('setIsLoading', true)
        switch(method){
            case 'get':
                return this.$axios.get(requestUrl, { params: params })
            case 'post':
                return this.$axios.post(requestUrl, params)
            case 'put':
                return this.$axios.put(requestUrl, params)
            case 'delete':
                return this.$axios.delete(requestUrl, params)
        }
    }
}