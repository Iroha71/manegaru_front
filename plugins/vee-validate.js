import { extend, localize } from 'vee-validate'
import { required, max, min, confirmed } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja'

extend('required', required)
extend('max', max)
extend('min', min)
extend('confirmed', confirmed)

localize('ja', ja)