<template>
    <div>
        <span v-for="(text, index) in animatedText"
            class="item"
            :key="index"
            :style="{animationDelay: index * 70 + 'ms'}">
            <span v-if="text==' '">&nbsp;</span>
            <span v-else>{{ text }}</span>
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        message: {
            type: String,
            required: true
        }
    },
    data() {
        return { animatedText: this.message }
    },
    watch: {
        message() {
            this.animatedText = ''
            setTimeout(() => {
                this.animatedText = this.message
            }, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes text-in {
    0% { opacity: 0; }
}
.item {
    display: inline-block;
    animation: text-in backwards;
}
</style>