export default (parentPath) => ({
    build(params) {
        return parentPath + `${ params }/`
    }
})