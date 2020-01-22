import { Component, Prop, Vue, Emit } from 'vue-property-decorator'

@Component
export default class BasePreview extends Vue {
  @Prop() row!: any

  @Prop() rows!: any[]

  @Prop() type!: string

  @Prop() linkId!: any

  @Prop() password!: string

  @Emit() close () {}
}
