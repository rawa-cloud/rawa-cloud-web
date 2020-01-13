<template>
    <div :class="[$style.container]" class="border-right">
        <div :class="[$style.toolbar]" class="text-right pr-3">
            <!-- <span class="mx-2 icon-btn" @click="onRefresh"><v-icon type="sync"></v-icon></span> -->
            <span class="mx-2 icon-btn" @click="onExpand"><v-icon type="plus-square-o"></v-icon></span>
            <span class="mx-2 icon-btn" @click="onCollapse"><v-icon type="switcher"></v-icon></span>
        </div>
        <v-tree node-key="id" :data-source="dataSource" lazy :load-fn="loadFn" :props="props" ref="tree" :class="[$style.tree]">
            <span slot="content"  slot-scope="{node}" @click="onSelect(node)">
                <file-icon v-bind="iconProps(node)"></file-icon> <span class="ml-2">{{node.data.name}}</span>
            </span>
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
    label: 'name',
    isLeaf: 'leaf'
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
    let personal = !!node.data.user
    let root = !(node.parent && node.parent.parent)
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
        root.name = '全部文件'
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
        if (this.id === root.id) {
          const $e = (this.$refs as any).tree
          if ($e) {
            $e.currentNodeKey = root.id
            $e.$children[0].onExpand()
          }
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

  onExpand () {
    const $e = this.$refs.tree as any
    $e.expandAll(true)
  }

  onCollapse () {
    const $e = this.$refs.tree as any
    $e.expandAll(false)
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
    height: calc(100vh - 160px);
    overflow: auto;
}

.toolbar {
    background-color: var(--primary-lighten-4);
    line-height: 2rem;
    height: 2rem;
}

.tree {
    width: 100%;
    height: calc(100% - 48px);
    overflow: auto;

    :global{
        .v-tree-node {
            white-space: nowrap;
        }
    }
}
</style>
