<template>
<div class="field">
    <Vinput v-if="isEditting"
        :label="label"
        :type="editType"
        :rules="validateRules"
        v-model="updateValue" />
    <span v-else>
        {{ defaultValue }}
        <IconButton v-if="!isBundleEdit" type="is-info" iconName="edit" />
    </span>
</div>
</template>

<script>
import IconButton from '@/components/parts/IconButton.vue'
import Vinput from '@/components/parts/ValidateInput.vue'
export default {
    props: {
        isBundleEdit: {
            type: Boolean,
            requried: false,
            default: false
        },
        defaultValue: {
            type: String,
            requried: true
        },
        editType: {
            type: String,
            requried: true
        },
        label: {
            type: String,
            requried: false,
            default: ''
        },
        validateRules: {
            type: String,
            requried: true
        },
        value: {
            type: String,
            requried: false
        },
        isEditting: {
            type: Boolean,
            requried: false,
            default: false
        }
    },
    components: {
        IconButton,
        Vinput
    },
    computed: {
        updateValue: {
            get() { return this.defaultValue },
            set(value) { this.$emit('input', value) }
        }
    }
}
</script>