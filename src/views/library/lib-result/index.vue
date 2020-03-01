<template>
<div :class="[$style.container]">
  <div v-if="catalogId">
        <div>
            <v-form layout="horizontal" class="mx-3 mt-3" :model="form" ref="form">
                <v-form-item prop="username" label="名称">
                    <v-input v-model.trim="form.name" clearable class="w-10"></v-input>
                </v-form-item>

                <v-form-item >
                   <v-button type="primary" @click="onQuery">查询</v-button>
                   <v-button class="ml-3" @click="onReset">重置</v-button>
                </v-form-item>
            </v-form>
        </div>

        <div :class="[$style.content]">
          <div :class="[$style.action]" class="text-right m-2">
            <v-button type="primary" @click="onAdd">新 增</v-button>
          </div>
          <config-table row-key="id" :storage-key="storageKey" :api="api" :columns="columns" height="calc(100vh - 360px)" ref="configTable">
            <v-table-column prop="name" label="名称" :order="1"></v-table-column>
            <v-table-column prop="filePath" label="文件路径" :order="2">
              <a slot-scope="{row}" @click="onForwardFile(row)">{{row.filePath}}</a>
            </v-table-column>
            <v-table-column prop="opt" label="操作" fixed="right" :order="1000" width="160px">
                <template slot-scope="{row}">
                    <span class="icon-btn" @click="onEdit(row)"><v-icon type="edit"></v-icon></span>
                    <span class="icon-btn ml-2" @click="onEditFields(row)"><v-icon type="tag-o"></v-icon></span>
                    <span class="icon-btn ml-2" @click="onInvite(row)"><v-icon type="usergroup-add"></v-icon></span>
                    <span class="icon-btn ml-2" @click="onAddFile(row)"><v-icon type="file-add"></v-icon></span>
                    <span class="icon-btn ml-2" @click="onDelete(row.id)"><v-icon type="delete"></v-icon></span>
                    <!-- <span class="ml-3 icon-btn" @click="onRecover(row.id)"><svg-icon icon="recover"></svg-icon></span> -->
                </template>
            </v-table-column>
          </config-table>
        </div>
        <edit-lib ref="editLib"></edit-lib>
        <edit-fields ref="editFields"></edit-fields>
        <!-- <edit-user ref="editUser"></edit-user>
        <user-file ref="userFile"></user-file> -->
    </div>
    <no-data v-else></no-data>
    <file-chooser ref="fileChooser"></file-chooser>
    <invite-user ref="inviteUser"></invite-user>
</div>
</template>

<script lang="ts">

import { Vue, Component, Inject, Watch } from 'vue-property-decorator'
import { queryLibraries, deleteLibrary, addLibraryFile } from '@/api/library'
import EditLib from './edit-lib/index.vue'
import EditFields from './edit-fields/index.vue'
import InviteUser from './invite-user/index.vue'
import { getFile } from '@/api/file'
@Component({
  components: { EditLib, EditFields, InviteUser }
})
export default class LibResult extends Vue {
    api = queryLibraries

    form = {
      name: ''
    }

    loading: boolean = false

    dataSource: any[] = []

    @Inject() getCurrent!: () => any

    @Inject() setCurrent!: (row: any) => void

    get catalogId () {
      let current = this.getCurrent()
      return current && current.id
    }

    get storageKey () {
      let b = 'library_list'
      return this.catalogId ? `${b}_${this.catalogId}` : ''
    }

    get columns () {
      let current = this.getCurrent()
      const formatter = (name: string, row: any) => {
        let target = (row.fields || []).find((v: any) => v.name === name)
        let value = JSON.parse((target && target.value) || '""')
        if (typeof value === 'boolean') return value ? '是' : '否'
        if (Array.isArray(value)) return value.join(',')
        return value
      }
      const ret = ((current && current.fieldDefs) || []).map((v: any) => {
        return {
          label: v.name,
          name: v.name,
          formatter
        }
      })
      return ret
    }

    get req () {
      let r: any = { catalogId: this.catalogId }
      Object.assign(r, this.form)
      return r
    }

    onQuery () {
      this.query(this.req)
    }

    onReset () {
      const $form = this.$refs.form as any
      $form.resetFields()
    }

    onAdd () {
      const $e = (this as any).$refs.editLib as EditLib
      $e.add({ catalogId: this.catalogId }).then(() => {
        this.$message.success('新增成功')
        this.refresh()
      })
    }

    onEditFields (row: any) {
      const $e = this.$refs.editFields as EditFields
      $e.edit(row).then(() => {
        this.$message.success('编辑字段成功')
        this.refresh()
      })
    }

    onEdit (row: any) {
      const $e = (this as any).$refs.editLib as EditLib
      $e.edit(row).then(() => {
        this.$message.success('编辑库成功')
        this.refresh()
      })
    }

    onDelete (id: any) {
      this.$modal.confirm({
        title: '确认',
        content: '确定删除?'
      }).then(() => {
        deleteLibrary(id).then(() => {
          this.$message.success('删除库成功')
          this.refresh()
        })
      })
    }

    onInvite (row: any) {
      const $e = (this as any).$refs.inviteUser as InviteUser
      $e.invite(row).then(() => {
        this.$message.success('更新成员成功')
        this.refresh()
      })
    }

    onAddFile (row: any) {
      const $e = (this as any).$refs.fileChooser as any
      $e.choose().then((fileId: number) => {
        addLibraryFile(row.id, fileId).then(() => {
          this.$message.success('添加文件链接成功')
          this.refresh()
        })
      })
    }

    onForwardFile (row: any) {
      getFile(row.fileId).then(data => {
        if (!data || !data.status) {
          this.$message.error('文件已不存在')
          return
        }
        this.$router.push(`/file?id=${row.fileParentId}&filter=${row.fileId}`)
      })
    }

    query (params: any) {
      const $e = (this as any).$refs.configTable
      if ($e) $e.query(params)
    }

    refresh () {
      const $e = (this as any).$refs.configTable
      $e.refresh()
    }

    mounted () {
    }

    @Watch('catalogId', { immediate: true }) catalogIdChange () {
      if (!this.catalogId) return
      this.form.name = ''
      this.$nextTick(() => {
        this.query(this.req)
      })
    }
}
</script>

<style lang="scss" module>
.container {
  padding: 0;
}

.content {
  position: relative;
}

.action {
  position: absolute;
  right: 20px;
  top: -78px;
}
</style>
