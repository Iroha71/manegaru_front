<template lang="html">
<div class="columns">
    <div class="form-area column is-offset-4 is-4">
        <form class="section">
            <h1>サインイン</h1>
            <b-field label="メールアドレス">
                <b-input></b-input>
            </b-field>
            <b-field label="パスワード">
                <b-input password-reaval></b-input>
            </b-field>
            <b-field class="has-text-centered">
               <b-button type="is-info" size="is-medium">サインイン</b-button> 
            </b-field>
            <hr>
            <div class="password-reset-area">
                <p>パスワードを忘れた</p>
                <b-button type="is-danger">パスワードリセットメール送信</b-button>
            </div>
            <div>
                <p>未登録の場合</p>
                <b-button type="is-success">新規登録</b-button>
            </div>
        </form>
    </div>
</div>
</template>

<script>
export default {
    layout: 'fullScreenWithHeader'
}
</script>

<style lang="scss" scoped>
.form-area {
    display: flex;
    align-items: center;
    form {
        h1 {
            font-size: 1.5rem;
        }
        width: 100%;
        &.section {
            padding: 1.5rem;
        }
        .password-reset-area {
            margin-bottom: 0.75rem;
        }
    }
}
</style>