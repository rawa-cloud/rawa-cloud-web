<template>
  <v-table :data-source="dataSource">
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
              <span class="ml-3 icon-btn" @click="onDelete(row.id)"><v-icon type="delete"></v-icon></span>
          </template>
      </v-table-column>
  </v-table>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { queryAuthorities } from '@/api/authority'

@Component
export default class AuthorityList extends Vue {
  @Prop() dept!: any

  @Prop() user!: any

  @Prop() file!: any

  dataSource: any[] = []

  iconProps (row: any) {
    let dir = row.dir
    let personal = false
    let root = false
    let contentType = row.contentType
    return { dir, personal, root, contentType }
  }

  onDelete (id: number) {
    // deleteAuthority(id, this.isUser).then(() => {
    //   this.$message.success('删除成功')
    //   this.loadData()
    // })
  }

  loadData () {
    let isUser = !!this.user
    let principleId = isUser ? (this.dept && this.dept.id) : (this.user && this.user.id)
    if (principleId) {
      this.dataSource = []
      return
    }
    let fileId = this.file && this.file.id
    queryAuthorities({ isUser, principleId, fileId }).then(data => {
      this.dataSource = data || []
    })
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>

</style>
