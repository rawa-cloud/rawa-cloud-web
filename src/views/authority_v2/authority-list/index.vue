<template>
<div>
  <div class="d-flex justify-content-between align-content-center m-2">
    <v-alert type="info" style="flex: 1 1 auto;">
        <template slot="description">
            已选择 <span>{{checkedRows.length}}</span> 项
            <a class="ml-2" @click="onClearSelection">清空选择</a>
        </template>
    </v-alert>
    <div class="ml-3">
        <v-button color="primary" icon="delete" :disabled="checkedRows.length < 1" @click="onDelete()">删除</v-button>
    </div>
  </div>
  <v-table :data-source="dataSource" pageable @selection-change="onSelectionChange">
      <v-table-column type="selection" fixed="left" width="80px"></v-table-column>
      <v-table-column prop="fileName" label="文件/文件夹">
        <template slot-scope="{row}">
          <div><file-icon v-bind="iconProps(row)" class="mr-2"></file-icon>{{row.fileName}}</div>
        </template>
      </v-table-column>
      <v-table-column prop="principleName" label="部门/用户"></v-table-column>
      <v-table-column prop="umask" label="权限">
      <template slot-scope="{row}">{{row.umask | umask}}</template>
      </v-table-column>
      <v-table-column prop="validDays" label="有效天数"></v-table-column>
      <v-table-column prop="opt" label="操作" fixed="right" width="120px">
          <template slot-scope="{row}">
              <span class="icon-btn" @click="onEdit(row)"><v-icon type="edit"></v-icon></span>
              <span class="ml-3 icon-btn" @click="onDelete(row)"><v-icon type="delete"></v-icon></span>
          </template>
      </v-table-column>
  </v-table>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { queryAuthorities, deleteAuthorities } from '@/api/authority'

@Component
export default class AuthorityList extends Vue {
  @Prop() dept!: any

  @Prop() user!: any

  @Prop() file!: any

  @Prop() tag!: string

  dataSource: any[] = []

  checkedRows: any = []

  get props () {
    return {
      user: this.user,
      dept: this.dept,
      file: this.file,
      tag: this.tag
    }
  }

  get isUser () {
    return !!this.user
  }

  iconProps (row: any) {
    let dir = row.dir
    let personal = false
    let root = false
    let contentType = row.contentType
    return { dir, personal, root, contentType }
  }

  onEdit (row: any) {
    let { principleId, isUser, fileId } = row
    this.$router.push(`/authority?principleId=${principleId}&isUser=${isUser ? 1 : 0}&fileId=${fileId}&t=${Date.now()}`)
  }

  onDelete (row: number) {
    let rows = row ? [row] : this.checkedRows
    if (rows.length < 1) {
      this.$message.warning('请选择记录')
      return
    }
    let deptIds = rows.filter((v: any) => !v.isUser).map((v: any) => v.id)
    let userIds = rows.filter((v: any) => v.isUser).map((v: any) => v.id)
    let all = []
    if (deptIds.length > 0) {
      all.push(deleteAuthorities(deptIds, false))
    }
    if (userIds.length > 0) {
      all.push(deleteAuthorities(userIds, true))
    }
    if (all.length < 1) {
      this.$message.warning('没有符合条件的记录')
    }
    Promise.all(all).then(() => {
      this.$message.success('删除成功')
      this.loadData()
    })
    // deleteAuthority(id, this.isUser).then(() => {
    //   this.$message.success('删除成功')
    //   this.loadData()
    // })
  }

  onSelectionChange (rows: any[]) {
    this.checkedRows = rows || []
  }

  onClearSelection () {
    this.checkedRows = []
  }

  loadData () {
    let isUser = this.isUser
    let principleId = !isUser ? (this.dept && this.dept.id) : (this.user && this.user.id)
    let fileId = this.file && this.file.id
    if (!principleId && !fileId) {
      this.dataSource = []
      return
    }
    let req: any = null
    if (this.tag === 'file') {
      req = { fileId }
    } else {
      req = { isUser, principleId }
    }
    queryAuthorities(req).then(data => {
      this.dataSource = data || []
      this.onClearSelection()
    })
  }

  @Watch('props', { immediate: true }) propsChange () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>

</style>
