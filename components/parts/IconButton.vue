<template lang="html">
<b-button class="root" :type="type" :size="size" @click="executeParentMethod()">
    <div>
        <img :src="`/icons/${iconName}.png`" :style="{ 'height': iconSize }" />
        <span v-if="message">{{ message }}</span>
    </div>
</b-button>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: false,
            default: ''
        },
        iconName: {
            type: String,
            required: true
        },
        iconSize: {
            type: String,
            required: false,
            default: '1.2rem'
        },
        message: {
            type: String,
            required: false
        }
    },
    methods: {
        executeParentMethod:function() {
            this.$emit('click')
        }
    },
}
</script>

<style lang="scss" scoped>
button {
    align-items: center;
    div {
        display: flex;
        align-items: center;
        img {
            width: auto;
            margin-right: 0.375rem;
        }
    }
}
</style>

