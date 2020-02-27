<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getType } from '@/common/content-type'
import ImagePreview from './image-preview/index.vue'
import OfficePreview from './office-preview/index.vue'
import VideoPreview from './video-preview/index.vue'
import TextPreview from './text-preview/index.vue'

@Component({
  components: { ImagePreview, OfficePreview, VideoPreview, TextPreview }
})
export default class FilePreview extends Vue {
  visible: boolean = false

  row: any = null

  rows: any[] = []

  linkId: any = null

  password: any = null

  get type (): 'image' | 'video' | 'audio' | 'office' | 'text' | string {
    if (!this.row) return ''
    return getType(this.row.contentType || '')
  }

  preview (row: any, rows: any = []) {
    this.row = row || null
    this.rows = rows
    this.linkId = null
    this.password = null
    this.visible = true
  }

  previewForShare (row: any, linkId: any, password: any, rows: any = []) {
    this.row = row || null
    this.rows = rows
    this.linkId = linkId
    this.password = password
    this.visible = true
  }

  render (h: any) {
    if (!this.visible || !this.type) return h('div')
    let props = { row: this.row, rows: this.rows, type: this.type, linkId: this.linkId, password: this.password }
    let on = {
      close: () => { this.visible = false }
    }
    let type = this.type === 'audio' ? 'video' : this.type
    return h(`${type}-preview`, { props, on })
  }

  @Watch('visible') visibleChange () {
    if (this.visible) {
      if (!this.type) {
        this.$message.warning('该文件类型不支持预览')
        this.visible = false
      }
    }
  }
}
</script>
