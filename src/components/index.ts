import Vue from 'vue'
import SectionHeader from './section-header/index.vue'
import FileIcon from './file-icon/index.vue'
import FilePreview from './file-preview/index.vue'
import FileSelector from './file-selector/index.vue'
import NoData from './no-data/index.vue'
import FileChooser from './file-chooser/index.vue'
import FileTransfer from './file-transfer/index.vue'
import { hyphenate } from '@/helpers/lang'

const components: any = {
  SectionHeader,
  FileIcon,
  FilePreview,
  FileSelector,
  NoData,
  FileChooser,
  FileTransfer
}

Object.keys(components).forEach((key: string) => {
  Vue.component(hyphenate(key), components[key])
})
