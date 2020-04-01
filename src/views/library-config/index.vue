<template>
<div>
  <tile-tree :data="data" row-key="key">
    <tile-tree-column title="表单名称" :level="1" v-on="handler">
      <template slot="action" slot-scope="{node}">
        <span class="icon-btn mr-2" @click.stop="onInviteUser(node)" v-if="node.data.visibility === 'assign'"> <v-icon type="usergroup-add"></v-icon></span>
      </template>
    </tile-tree-column>
    <tile-tree-column title="字段" :level="2" v-on="handler">
      <div slot-scope="{node}"><span>{{node.data.name}}</span> <span class="ml-3 ft-sm text-info">{{node.data.type | transcode('libraryFieldType')}}</span></div>
    </tile-tree-column>
    <tile-tree-column title="字段选项" :level="3" v-on="handler" :add-fn="addFn"></tile-tree-column>
  </tile-tree>
  <edit-lib ref="editLib"></edit-lib>
  <invite-user ref="inviteUser" catalog></invite-user>

</div>
</template>

<script lang="ts">

import { Vue, Component, Provide } from 'vue-property-decorator'
import Node from '@/components/tile-tree/Node'
import EditLib from './eidt-lib/index.vue'
import InviteUser from '../library/lib-result/invite-user/index.vue'
import { queryLibCatalogs, deleteLibCatalog, deleteLibCatalogField, deleteLibCatalogFieldDict } from '@/api/library'

@Component({
  components: { EditLib, InviteUser }
})
export default class LibraryConfig extends Vue {
  data: any[] = []

  handler = {
    add: this.onAdd,
    edit: this.onEdit,
    del: this.onDel
  }

  addFn (parent: Node) {
    if (parent && parent.level === 2 && ['radio', 'checkbox'].includes(parent.data.type)) return false
    return true
  }

  onAdd (node: Node) {
    const $e = this.$refs.editLib as EditLib
    $e.add(node).then(() => {
      this.loadData()
      this.$message.success('新增成功')
    })
  }

  onEdit (node: Node) {
    const $e = this.$refs.editLib as EditLib
    $e.edit(node).then(() => {
      this.loadData()
      this.$message.success('编辑成功')
    })
  }

  onDel (node: Node) {
    this.$modal.confirm({ title: '确认', content: '是否确认删除？' }).then(() => {
      let id = node.data.id
      if (node.level === 1) return deleteLibCatalog(id)
      if (node.level === 2) return deleteLibCatalogField(id)
      if (node.level === 3) return deleteLibCatalogFieldDict(id)
      return Promise.reject(new Error('error level'))
    }).then(() => {
      this.loadData()
      this.$message.success('删除成功')
    })
  }

  onInviteUser (node: Node) {
    const $e = (this as any).$refs.inviteUser as InviteUser
    $e.invite(node.data).then(() => {
      this.$message.success('更新成员成功')
      this.loadData()
    })
  }

  loadData () {
    queryLibCatalogs().then(data => {
      this.data = transform(data)
    })

    function transform (data: any[] = []) {
      return data.map((v: any) => {
        let extra = {
          key: v.id,
          children: (v.fieldDefs || []).map((w: any) => {
            let extra = {
              key: `${v.id}-${w.id}`,
              children: (w.typeDictList || []).map((k: any) => {
                return Object.assign({ key: `${v.id}-${w.id}-${k.id}` }, k)
              })
            }
            delete w.typeDictList
            return Object.assign(extra, w)
          })
        }
        delete v.fieldDefs
        return Object.assign(extra, v)
      })
    }
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.body {
  display: flex;
}
</style>
