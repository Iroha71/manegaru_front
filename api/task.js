const GROUP_NOT_SELECTED = 0
export default $axios => ({
    custom(groupId, columnName, sign, value, orderColumn, orderSign) {
        const params = {
            group_id: groupId,
            column: columnName,
            sign: sign,
            value: value,
            order_column: orderColumn,
            order_sign: orderSign
        }
        return $axios.get(process.env.BASE_URL + 'task/custom', { params: params })
    },
    updateStatus(taskId, status) {
        return $axios.put(process.env.BASE_URL + `task/${taskId}/update_status`, { status: status})
    },
    updateStatusMulti(taskIds, status, projectId) {
        projectId = projectId == GROUP_NOT_SELECTED ? '' : projectId
        const params = { ids: taskIds, status: status, project_id: projectId }
        return $axios.put(process.env.BASE_URL + `task/update_status_multi`, params)
    },
    deleteTaskMulti(taskIds, projectId) {
        projectId = projectId == GROUP_NOT_SELECTED ? '' : projectId
        const params = { ids: taskIds, project_id: projectId }
        return $axios.delete(process.env.BASE_URL + 'task/destroy_multi', { data: params })
    },
    bulkUpdate(params) {
        return $axios.put(process.env.BASE_URL + 'task', params)
    }
})