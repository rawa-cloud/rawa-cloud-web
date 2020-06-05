<template>
<div :class="[$style.container]" class="mx-3">
  <div v-if="catalogId">
        <div>
          <dynamic-form :fields="formFields" @query="onQuery" :single.sync="single"></dynamic-form>
        </div>

        <div :class="[$style.content]">
          <config-table :checkable="false" row-key="id" :storage-key="storageKey" :api="api" :columns="columns" bordered ref="configTable">
            <v-table-column prop="createdUser" label="创建人" :order="1"></v-table-column>
            <v-table-column prop="filePath" label="文件路径" :order="2">
              <template slot-scope="{row}">
                <a @click="onForwardFile(row)" :title="row.file.filePath" v-if="row.file">{{row.file.filePath | ellipsis(30, true)}}</a>
                <template v-if="row.file">
                  <v-button size="sm" class="ml-2" @click="onPreview(row)" :disabled="row.file.dir">预览</v-button>
                  <v-button size="sm" class="ml-2" @click="onDownload(row)">下载</v-button>
                </template>
              </template>
            </v-table-column>
            <v-table-column prop="opt" label="操作" fixed="right" :order="1000" width="180px">
                <template slot-scope="{row}">
                    <!-- <span class="icon-btn" @click="onEdit(row)" title="编辑"><v-icon type="edit"></v-icon></span> -->
                    <a class="ml-2" @click="onEditFields(row)" title="编辑" v-if="row.editable">编辑</a>
                    <a class="ml-2" @click="onInvite(row)" title="邀请成员" v-if="row.visibility === 'assign' && row.admin">邀请成员</a>
                    <!-- <span class="icon-btn ml-2" @click="onAddFile(row)" title="关联文件"><v-icon type="file-add"></v-icon></span> -->
                    <a class="ml-2" @click="onDelete(row.id)" title="删除" v-if="row.admin">删除</a>
                    <!-- <span class="ml-3 icon-btn" @click="onRecover(row.id)"><svg-icon icon="recover"></svg-icon></span> -->
                </template>
            </v-table-column>
            <template slot="extra">
              <v-button type="text" size="sm" class="primary-link-btn" icon="plus" @click="onAdd" v-if="current && current.addable">新增</v-button>
            </template>
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
    <file-preview ref="filePreview"></file-preview>
</div>
</template>

<script lang="ts">

import { Vue, Component, Inject, Watch } from 'vue-property-decorator'
import { queryLibraries, deleteLibrary, addLibraryFile, downloadFileForLibrary } from '@/api/library'
import EditLib from './edit-lib/index.vue'
import EditFields from './edit-fields/index.vue'
import InviteUser from './invite-user/index.vue'
import DynamicForm from './dynamic-form/index.vue'
import { getFile } from '@/api/file'
import { download } from '@/helpers/download'
@Component({
  components: { EditLib, EditFields, InviteUser, DynamicForm }
})
export default class LibResult extends Vue {
    api = queryLibraries

    form = {
      name: ''
    }

    single = true

    loading: boolean = false

    dataSource: any[] = []

    @Inject() getCurrent!: () => any

    @Inject() setCurrent!: (row: any) => void

    get height () {
      let total = ((this.current && this.current.fieldDefs) || []).length + 1
      if (this.single) total = Math.min(total, 6)
      const num = Math.ceil(total / 3)
      return `calc(100vh - 64px - 8px - ${num * 63}px - 32px - 70px)`
    }

    get current () {
      return this.getCurrent()
    }

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
      const ret = ((current && current.fieldDefs) || []).filter((v: any) => v.visible).map((v: any) => {
        return {
          label: v.name,
          name: v.name,
          formatter
        }
      })
      return ret
    }

    get formFields () {
      return ((this.current && this.current.fieldDefs) || []).filter((v: any) => v.visible)
    }

    onQuery (params: any = {}) {
      const req: any = {
        catalogId: this.catalogId,
        params
      }
      this.query(req)
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
      // addLibrary({ catalogId: this.catalogId }).then(() => {
      //   this.$message.success('新增成功')
      //   this.refresh()
      // })
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
        this.$message.success('编辑成功')
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
      getFile(row.file.id).then(data => {
        if (!data || !data.status) {
          this.$message.error('文件已不存在')
          return
        }
        this.$router.push(`/file?id=${row.file.parentId}&filter=${row.file.id}`)
      })
    }

    onPreview (row: any) {
      const $e = this.$refs.filePreview as any
      $e.previewForLibrary(Object.assign({}, row.file, { libraryId: row.id }))
    }

    onDownload (row: any) {
      let file = row.file
      downloadFileForLibrary(row.id).then(data => {
        download(data, file.dir ? `${file.name}.zip` : file.name)
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
        this.onQuery()
      })
    }
}
</script>

<style lang="scss" module>
.container {
}

.content {
  position: relative;
}
</style>
