export default $axios => ({
    signIn(email, password) {
        const loginInfo = { email: email, password: password }
        return $axios.post(process.env.BASE_URL + 'auth/sign_in', loginInfo)
    },
    signOut() {
        return $axios.delete(process.env.BASE_URL + 'auth/sign_out')
    },
    sendResetPasswordMail(email) {
        return $axios.post(process.env.BASE_URL + 'auth/password', { email: email })
    },
    updatePassword(newPassword, confirmPassword) {
        const password = { password: newPassword, password_confirmation: confirmPassword }
        return $axios.put(process.env.BASE_URL + 'auth/password', password)
    }
})