import Vue from 'vue'
import SectionHeader from './section-header/index.vue'
import FileIcon from './file-icon/index.vue'
import FilePreview from './file-preview/index.vue'
import FileSelector from './file-selector/index.vue'
import NoData from './no-data/index.vue'
import FileChooser from './file-chooser/index.vue'
import FileTransfer from './file-transfer/index.vue'
import TileTree from './tile-tree/index.vue'
import TileTreeColumn from './tile-tree/tile-tree-column/index.vue'
import DictOption from './dict-option/index.vue'
import ConfigTable from './config-table/index.vue'
import { hyphenate } from '@/helpers/lang'

const components: any = {
  SectionHeader,
  FileIcon,
  FilePreview,
  FileSelector,
  NoData,
  FileChooser,
  FileTransfer,
  TileTree,
  TileTreeColumn,
  DictOption,
  ConfigTable
}

Object.keys(components).forEach((key: string) => {
  Vue.component(hyphenate(key), components[key])
})
