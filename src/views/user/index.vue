<template>
    <div class="mx-3">
        <div>
            <v-form layout="horizontal" :model="form" ref="form">
                <v-form-item prop="username" label="用户名">
                    <v-input v-model.trim="form.username" clearable class="w-10"></v-input>
                </v-form-item>
                <v-form-item prop="cname" label="中文名">
                    <v-input v-model.trim="form.cname" clearable class="w-10"></v-input>
                </v-form-item>
                <v-form-item prop="deptId" label="归属部门">
                  <!-- <v-select clearable searchable v-model="form.deptId" class="w-10">
                    <v-option label="无" :value="-1"></v-option>
                    <v-option :label="dept.name" :value="dept.id" v-for="dept in depts" :key="dept.id"></v-option>
                </v-select> -->
                  <v-cascader
                    node-key="key"
                    :data-source="depts"
                    change-on-select
                    v-model="form.deptIds"
                    clearable placeholder="请选择"></v-cascader>
                </v-form-item>
                <v-form-item prop="status" label="状态">
                    <v-select v-model="form.status" clearable class="w-8">
                        <v-option label="有效" :value="true"></v-option>
                        <v-option label="无效" :value="false"></v-option>
                    </v-select>
                </v-form-item>

                <v-form-item >
                   <v-button type="primary" @click="onQuery">查询</v-button>
                   <v-button class="ml-3" @click="onReset">重置</v-button>
                   <v-button class="ml-3" type="primary" color="info" @click="onAdd">新增用户</v-button>
                </v-form-item>
            </v-form>
        </div>

        <div>
          <config-table row-key="id" :api="api" :class="[$style.table]" simple height="calc(100vh - 64px - 8px - 62px - 70px)" ref="configTable">
            <v-table-column prop="username" label="用户名"></v-table-column>
            <v-table-column prop="cname" label="姓名"></v-table-column>
            <v-table-column prop="deptName" label="所属部门"></v-table-column>
            <v-table-column prop="role" label="角色">
              <template slot-scope="{row}">{{row.roles[0] | transcode('role')}}</template>
            </v-table-column>
            <v-table-column prop="ip" label="ip"></v-table-column>
            <v-table-column prop="status" label="状态">
              <template slot-scope="{row}">{{row.status | transcode('status')}}</template>
            </v-table-column>
            <v-table-column prop="opt" label="操作" fixed="right" width="160px">
                <template slot-scope="{row}">
                    <span class="icon-btn" @click="onEdit(row)" title="编辑" :disabled="isDefault(row)"><v-icon type="edit"></v-icon></span>
                    <span class="ml-3 icon-btn" @click="onDelete(row.id)" title="删除" :disabled="isDefault(row)"><v-icon type="delete"></v-icon></span>
                    <span class="ml-3 icon-btn" :disabled="!hasAdminRole(row)" @click="onViewUserFile(row)" title="管理员目录"><v-icon type="folder-add"></v-icon></span>
                </template>
            </v-table-column>
          </config-table>
        </div>
        <edit-user ref="editUser"></edit-user>
        <user-file ref="userFile"></user-file>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { queryUsers, deleteUser, queryUsersForPage } from '@/api/user'
import { queryDepts } from '@/api/dept'
import EditUser from './edit-user/index.vue'
import UserFile from './user-file/index.vue'
import { clone } from '@/helpers/lang'
import { toCascade } from '../../helpers/data'

@Component({
  components: { EditUser, UserFile }
})
export default class User extends Vue {
    api = queryUsersForPage

    form = {
      username: '',
      cname: '',
      deptIds: [],
      status: null,

      get deptId () {
        return this.deptIds.slice(-1) || null
      }
    }

    depts: any[] = []

    onReset () {
      const $form = this.$refs.form as any
      $form.resetFields()
    }

    onAdd () {
      const $e = this.$refs.editUser as EditUser
      $e.add().then(() => {
        this.$message.success('添加用户成功')
        this.refresh()
      })
    }

    onEdit (row: any) {
      if (this.isDefault(row)) return
      const $e = this.$refs.editUser as EditUser
      $e.edit(row).then(() => {
        this.$message.success('编辑用户成功')
        this.refresh()
      })
    }

    onDelete (id: any) {
      this.$modal.confirm({
        title: '删除确认',
        content: '将删除该用户所有文件记录，不可恢复， 确定删除?'
      }).then(() => {
        deleteUser(id).then(() => {
          this.$message.success('删除用户成功')
          this.refresh()
        })
      })
    }

    onViewUserFile (row: any) {
      const $e = this.$refs.userFile as UserFile
      $e.view(row).then(() => {
        this.$message.success('修改管理员目录成功')
        this.refresh()
      })
    }

    hasAdminRole (row: any) {
      return (row.roles || []).includes('ADMIN')
    }

    isDefault (row: any) {
      return row.username === 'root'
    }

    onQuery () {
      this.query(this.form)
    }

    query (params: any) {
      const $e = (this as any).$refs.configTable
      if ($e) $e.query(params)
    }

    refresh () {
      const $e = (this as any).$refs.configTable
      $e.refresh()
    }

    loadDepts () {
      queryDepts({}).then(data => {
        let d = (data || []).map((v: any) => Object.assign({ key: v.id, label: v.name }, v))
        this.depts = toCascade(d, 'id', 'parentId')
      })
    }

    mounted () {
      this.onQuery()
      this.loadDepts()
    }
}
</script>

<style lang="scss" module>
.table {
  :global {
    .v-table__table>tbody>tr>td {
      padding: 12px;
    }
  }
}
</style>
