export default $axios => resource => ({
    index(params) {
        return $axios.get(`${resource}`, { params: params })
    },
    show(id, params) {
        return $axios.get(`${resource}/${id}`, { params: params })
    },
    create(params) {
        return $axios.post(`${resource}`, params)
    },
    update(id, params) {
        return $axios.put(`${resource}/${id}`, params)
    },
    delete(id, params) {
        return $axios.delete(`${resource}/${id}`, { data: params })
    }
})