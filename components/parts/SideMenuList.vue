<template lang="html">
    <div>
        <p class="menu-label has-text-white">{{ label }}</p>
        <ul :class="{ 'decoration-list': activable }">
            <slot />
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: false
        },
        activable: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-label {
    margin-bottom: 0.5rem;
}
.decoration-list {
    li {
        &.selected {
            background: #1AAAD4;
        }
        &:hover {
            cursor: pointer;
            transition: .3s;
            background: #1AAAD4;
        }
    }
}
</style>