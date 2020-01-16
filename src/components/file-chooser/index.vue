<template>
 <v-modal :visible.sync="visible" :title="title">
    <v-tree node-key="id" :data-source="dataSource" lazy :load-fn="loadFn" :props="props" :class="[$style.tree]" ref="tree" v-if="visible">
      <div slot="content"  slot-scope="{node}" @click="onChoose(node)">
        <span><file-icon v-bind="iconProps(node.data)" class="mr-2"></file-icon>{{node.data.label}}</span>
      </div>
    </v-tree>
    <div slot="footer" class="text-right">
      <v-button @click="onCancel">取消</v-button>
      <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
    </div>
  </v-modal>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { queryFiles, getFile, getRootFile } from '@/api/file'
import { toCascade } from '@/helpers/data'
import { unique } from '@/helpers/lang'
import { Node } from 'vua'

@Component
export default class FileChooser extends Vue {
  visible: boolean = false

  title: string = '选择文件'

  onlyDir: boolean = false

  dataSource: any[] = []

  id: number | null = null

  resolve: any = null

  reject: any = null

  props = {
    key: 'id',
    label: 'name',
    isLeaf: 'leaf'
  }

  iconProps (row: any) {
    let dir = row.dir
    let personal = row.personal
    let root = false
    let contentType = row.contentType
    return { dir, personal, root, contentType }
  }

  loadFn ({ node }: any, resovle: any) {
    let parentId = node.data.id
    let dir = this.onlyDir ? true : undefined
    queryFiles({ parentId, dir }).then(data => {
      resovle((data || []).map(v => Object.assign(v, { key: v.id, label: v.name })))
    })
  }

  loadData () {
    return getRootFile().then(data => {
      this.dataSource = (data ? [data] : []).map(v => {
        return Object.assign(v, { key: v.id, label: v.name })
      })
      this.$nextTick(() => {
        const $e = (this.$refs as any).tree
        if ($e && this.dataSource[0]) {
          $e.currentNodeKey = this.dataSource[0].id
          $e.$children[0].onExpand()
        }
      })
    })
  }

  choose (onlyDir: boolean = false, title: string = '选择文件') {
    return new Promise((resolve, reject) => {
      this.onlyDir = onlyDir
      this.title = title
      this.dataSource = []
      this.id = null

      this.loadData()

      this.resolve = resolve
      this.reject = reject
      this.visible = true
    })
  }

  onChoose (node: any) {
    this.id = node.data.id
  }

  onCancel () {
    this.visible = false
    if (this.reject) this.reject()
  }

  onConfirm () {
    if (!this.id) {
      this.$message.warning('请选择文件')
      return
    }
    this.visible = false
    if (this.resolve) this.resolve(this.id)
  }
}
</script>

<style lang="scss" module>
.tree {
  overflow: auto;
  height: 320px;
}

.tagBox {
  min-height: 36px;
  max-height: 64px;
  overflow: auto;
}
</style>
