<template lang="html">
<ValidationProvider :rules="rules" v-slot="{ errors }" :name="label">
    <b-field :label="label" :type="getFieldType(errors[0])" :message="errors[0]">
        <b-input :type="type" v-model="updateValue" :maxlength="maxLength" />
    </b-field>
</ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        rules: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        maxLength: {
            type: Number,
            required: false
        }
    },
    methods: {
        getFieldType:function(hasError){
            if(hasError){
                return 'is-danger'
            }else{
                return 'is-default'
            }
        }
    },
    computed: {
        updateValue: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
            }
        }
    },
    components: {
        ValidationProvider
    }
}
</script>

<style lang="scss" scoped>
.field {
    margin-bottom: 0.75rem;
}
</style>