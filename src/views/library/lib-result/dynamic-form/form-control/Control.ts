import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Control extends Vue {
  @Prop() form!: any

  @Prop() label!: any

  @Prop() prop!: any

  @Prop() type!: string

  @Prop() options!: any[]

  get value () {
    const multiple = this.type.startsWith('date')
    if (!this.form[this.prop]) return multiple ? [] : ''
    return this.form[this.prop]
  }

  set value (v: any) {
    this.$set(this.form, this.prop, v)
  }
}
