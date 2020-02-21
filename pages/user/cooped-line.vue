<template>
    <div class="section content has-text-centered">
        <h2>LINEのリンクが完了しました</h2>
        <h3>LINEを通してタスクの通知が行われます</h3>
        <b-button type="is-success" @click="$router.push('/')">TOPへ移動</b-button>
        <b-button type="is-danger" @click="closeLiff()">このページを閉じる</b-button>
    </div>
</template>

<script>
export default {
    layout: 'fullScreenWithHeader',
    methods: {
        closeLiff() {
            liff.closeWindow()
        }
    }
}
</script>