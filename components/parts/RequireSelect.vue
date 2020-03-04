<template>
<ValidationProvider rules="required" v-slot="{ errors }">
  <b-field :label="label" :type="{ 'is-danger': errors[0] }" :messsage="applyErrorMessage(errors[0])">
      <b-select v-model="updateValue">
        <option v-for="o in options" :key="o.name" :value="o.value">{{ o.name }}</option>
      </b-select>
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
        value: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        }
    },
    components: {
        ValidationProvider
    },
    methods: {
        applyErrorMessage(error) {
            if(error) {
                return `${this.label}は必須です`
            } else {
                return ''
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
    }
}
</script>

<style lang="scss" scoped>
.field {
    margin-bottom: 0.75rem;
}
</style>