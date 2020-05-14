<template>
<div :class="[$style.container]">
<div :class="[$style.column, $style.left]">
  <v-tree node-key="id" :data-source="dataSource" lazy :load-fn="loadFn" :props="props" :class="[$style.tree]" ref="tree" class="primary-tree">
      <div slot="content"  slot-scope="{node}" @click="onSelect(node)">
        <span><file-icon v-bind="iconProps(node.data)" class="mr-2"></file-icon>{{node.data.label}}</span>
      </div>
  </v-tree>
</div>
<div :class="[$style.middle]">
  <div class="mb-2"><v-button type="primary" icon="right" size="sm" :disabled="!current" @click="onTransfer"></v-button></div>
</div>
<div :class="[$style.column, $style.right]">
  <ul :class="[$style.list]" v-if="value.length > 0">
    <li :class="[$style.item]" v-for="row in value" :key="row.id">
      <span><file-icon v-bind="iconProps(row)" class="mr-2"></file-icon>{{row.name}}</span>
      <div :class="[$style.close]" @click="onRemove(row)"><a><v-icon type="close"></v-icon></a></div>
    </li>
  </ul>
  <no-data v-else></no-data>
</div>
 </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { queryFiles, getFile, getRootFile } from '@/api/file'
import { toCascade } from '@/helpers/data'
import { unique } from '@/helpers/lang'
import { Node } from 'vua'

@Component
export default class FileTransfer extends Vue {
  @Prop(Boolean) onlyDir!: boolean

  @Prop(Boolean) peer!: boolean

  @Prop() value!: any[]

  @Emit() input (value: any[]) {}

  dataSource: any[] = []

  current: any = null

  props = {
    key: 'id',
    label: 'name',
    isLeaf: 'leaf'
  }

  onTransfer () {
    if (!this.current) return
    if (this.value.some((v: any) => v.id === this.current.id)) {
      this.$message.info('该文件已在选择列表內')
      return
    }
    if (this.value.length > 0 && this.peer && this.value[0].parentId !== this.current.parentId) {
      this.$message.info('只能选择同级目录')
      return
    }
    this.input([...this.value, this.current])
  }

  onSelect (node: any) {
    this.current = node.data
  }

  onRemove (row: any) {
    this.input(this.value.filter(v => v.id !== row.id))
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

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  justify-items: center;
}

.column {
  height: 100%;
  overflow: auto;
}

.left {
  flex: 1 1 auto;
  width: 50%;
}

.right {
  width: 50%;
  flex: 1 1 auto;
}

.middle {
  flex: 0 0 auto;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  line-height: 24px;
  padding: 4px 32px 4px 8px;
  margin: 2px;
  border-radius: 4px;
  transition: all .25s ease-in-out;
  overflow: hidden;
  position: relative;
  &:hover {
    background-color: var(--bg-color-2);

    &>.close {
      visibility: visible;
    }
  }
}

.close {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  visibility: hidden;
}

.itemActive {
  background-color: var(--primary-lighten-5);
}
</style>
