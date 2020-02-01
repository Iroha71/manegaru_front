<template lang="html">
<b-button class="root" :type="type" :size="size" @click="executeParentMethod()">
    <div>
        <img :src="`/icons/${iconName}.png`" />
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
    padding: 5px;
    div {
        display: flex;
        align-items: center;
        img {
            height: 2rem;
            width: auto;
        }
    }
}
</style>

