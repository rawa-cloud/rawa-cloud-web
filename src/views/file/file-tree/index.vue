<template>
    <div :class="[$style.container]">
        <v-tree node-key="id" :data-source="dataSource" lazy :load-fn="loadFn" :props="props" ref="tree" :class="[$style.tree]" class="primary-tree">
            <div slot="content"  slot-scope="{node}" @click="onSelect(node)">
                <file-icon v-bind="iconProps(node)"></file-icon>
                <span class="ml-2">{{node.data.name}}</span>
                <span class="ml-2 text-secondary" v-if="node.data.admin && !node.data.userId && !$auth.hasRole('SUPER')"><v-icon type="pushpin"></v-icon></span>
            </div>
        </v-tree>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { TreeNodeLoadFn, VTree } from 'vua'
import { queryFiles, getUserRootFile, getRootFile } from '@/api/file'

@Component
export default class FileTree extends Vue {
  @Prop(Number) id!: number

  @Emit('update:id') updateId (id: number) {}

  props = {
    key: 'id',
    label: 'name'
    // isLeaf: 'leaf'
  }

  dataSource: any = [
    // {
    //   id: -2,
    //   name: '全部文件',
    //   dir: true,
    //   personal: false
    // },
    // {
    //   id: -3,
    //   name: '个人文件',
    //   dir: true,
    //   personal: true
    // }
  ]

  iconProps (node: any) {
    let dir = node.data.dir
    let personal = false
    let root = false
    let contentType = node.data.contentType
    return { dir, personal, root, contentType }
  }

  loadFn: TreeNodeLoadFn = ({ node }, resovle) => {
    let parentId = node.data.id
    let dir = true
    queryFiles({ parentId, dir }).then((data) => {
      resovle(data)
    })
  }

  loadData () {
    const all = [getRootFile(), getUserRootFile()]
    Promise.all(all).then(([root, userRoot]) => {
      let ret = []
      if (root) {
        root.name = '公司文档'
        ret.push(root)
      }
      if (userRoot) {
        userRoot.name = '个人目录'
        ret.push(userRoot)
      }
      this.dataSource = ret
      this.$nextTick(() => {
        if (!this.id) {
          this.$router.push(`/file?id=${root.id}`)
        }
        const $e = (this.$refs as any).tree
        if ($e) {
          $e.currentNodeKey = root.id
          $e.$children[0].onExpand()
        }
      })
    })
  }

  reload (id: number) {
    const $e = this.$refs.tree as VTree
    const node = $e.nodeMap.get(id)
    if (!node) {
      throw new Error(`can not reload tree node [${id}], not found in nodeMap`)
    }
    let parentId = id
    let dir = true
    node.loading = true
    queryFiles({ parentId, dir }).then((data) => {
      let oldData = (node.children || []).map((v: any) => v.data)
      let newData = data || []
      let mergedData = merge(newData, oldData)
      // node.data = mergedData
      node.children = node.normalizeNode(mergedData)
      node.expandNode(false)
      this.$nextTick(() => {
        node.expandNode(true)
      })
    }).finally(() => {
      node.loading = false
    })

    function merge (newData: any[], oldData: any[]): any[] {
      let map = new Map()
      oldData.forEach((v: any) => {
        map.set(v.id, v)
      })
      return newData.map(v => {
        if (map.has(v.id)) {
          let item = map.get(v.id)
          return Object.assign(item, { name: v.name })
        }
        return v
      })
    }
  }

  onRefresh () {
  //   this.loadDepts()
  }

  onSelect (node: any) {
    this.updateId(node.data.id)
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.container {
  background-color: #fff;
  padding: 0 12px 16px 12px;
  box-shadow: 2px 0 4px var(--bg-color-1);
}

.tree {
  width: 100%;

  :global {
    .v-tree-node__text {
      height: 32px;
      line-height: 32px;
      width: 100%;
    }
  }
}
</style>
