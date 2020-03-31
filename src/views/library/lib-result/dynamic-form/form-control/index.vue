<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import TextControl from './controls/TextControl.vue'
import SelectControl from './controls/SelectControl.vue'
import DateRangeControl from './controls/DateRangeControl.vue'
import DatetimeRangeControl from './controls/DatetimeRangeControl.vue'
import { CreateElement } from 'vue'

@Component({
  components: {
    TextControl,
    SelectControl,
    DateRangeControl,
    DatetimeRangeControl
  }
})
export default class FormControl extends Vue {
  @Prop() form!: any

  @Prop() label!: any

  @Prop() prop!: any

  @Prop(String) type!: string

  @Prop() options!: any[]

  render (h: CreateElement) {
    let type = (this.type || '').replace(/_/g, '-')
    let tag = `${type}-control`
    return h(tag, {
      props: {
        form: this.form,
        label: this.label,
        prop: this.prop,
        type: this.type,
        options: this.options
      }
    })
  }
}
</script>
