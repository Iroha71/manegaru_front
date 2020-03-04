<template>
    <div class="section content has-text-centered">
        <h2>{{ $route.query.confirmingEmail }} へ認証メールを送信しました</h2>
        <h3>メール内のリンクにアクセスして登録を完了してください</h3>
        <p>このページは閉じても問題ありません</p>
    </div>
</template>

<script>
export default {
    layout: 'fullScreenWithHeader'
}
</script>