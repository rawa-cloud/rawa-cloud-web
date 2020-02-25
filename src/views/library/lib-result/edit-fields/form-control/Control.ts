import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Control extends Vue {
  @Prop() form!: any

  @Prop() name!: any

  @Prop() options!: any[]
}
