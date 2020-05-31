<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import TextControl from './controls/TextControl.vue'
import RadioControl from './controls/RadioControl.vue'
import CheckboxControl from './controls/CheckboxControl.vue'
import MultiTextControl from './controls/MultiTextControl.vue'
import BoolControl from './controls/BoolControl.vue'
import DateControl from './controls/DateControl.vue'
import DatetimeControl from './controls/DatetimeControl.vue'
import DateRangeControl from './controls/DateRangeControl.vue'
import DatetimeRangeControl from './controls/DatetimeRangeControl.vue'
import { CreateElement } from 'vue'

@Component({
  components: { TextControl,
    RadioControl,
    CheckboxControl,
    MultiTextControl,
    BoolControl,
    DateControl,
    DatetimeControl,
    DateRangeControl,
    DatetimeRangeControl }
})
export default class FormControl extends Vue {
  @Prop() form!: any

  @Prop() name!: any

  @Prop(Boolean) disabled!: boolean

  @Prop(String) type!: string

  @Prop() options!: any[]

  render (h: CreateElement) {
    let type = (this.type || '').replace(/_/g, '-')
    let tag = `${type}-control`
    return h(tag, {
      props: {
        form: this.form,
        name: this.name,
        disabled: this.disabled,
        options: this.options
      }
    })
  }
}
</script>
