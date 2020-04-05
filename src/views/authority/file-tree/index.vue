<template>
  <v-tree node-key="id" :data-source="dataSource" lazy :load-fn="loadFn" :props="props" ref="tree" :class="[$style.tree]">
    <div slot="content"  slot-scope="{node}" @click="onSelect(node)">
      <div><file-icon v-bind="iconProps(node.data)" class="mr-2"></file-icon>{{resolveFileName(node.data.label)}}</div>
    </div>
  </v-tree>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { queryFiles, getAdminRootFiles } from '@/api/file'
import { resolveFileName } from '@/helpers/context'

@Component
export default class FileTree extends Vue {
  @Emit() select (file: any) {}

  dataSource: any[] = []

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

  resolveFileName (name: string) {
    return resolveFileName(name)
  }

  loadFn ({ node }: any, resovle: any) {
    let parentId = node.data.id
    queryFiles({ parentId }).then(data => {
      resovle((data || []).map(v => Object.assign(v, { key: v.id, label: v.name })))
    })
  }

  loadData () {
    return getAdminRootFiles().then(data => {
      this.dataSource = (data || []).map(v => {
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

  onSelect (node: any) {
    this.select(node.data)
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.tree {
  :global {
    .v-tree-node {
      white-space: nowrap;
    }
  }
}
</style>
