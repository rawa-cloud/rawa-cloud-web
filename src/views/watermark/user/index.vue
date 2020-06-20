<template>
    <div class="mx-3">
      <div>
        <v-form layout="horizontal" :model="form" ref="form">
            <v-form-item prop="username" label="用户名">
              <v-select v-model="form.username" clearable searchable class="w-12">
                <v-option :label="row.cname" :value="row.username" v-for="row in users" :key="row.username"></v-option>
              </v-select>
            </v-form-item>
            <v-form-item prop="watermarkId" label="水印名称">
                <v-select v-model="form.watermarkId" searchable clearable class="w-12">
                    <v-option :label="row.name" :value="row.id" v-for="row in watermarks" :key="row.id"></v-option>
                </v-select>
            </v-form-item>

            <v-form-item >
                <v-button type="primary" @click="onQuery">查询</v-button>
                <v-button class="ml-3" @click="onReset">重置</v-button>
                <v-button class="ml-3" type="primary" color="info" @click="onAdd">新增关联</v-button>
            </v-form-item>
        </v-form>
      </div>

        <config-table row-key="id" :api="api" simple height="calc(100vh - 64px - 8px - 62px - 70px)" ref="configTable" size="sm">
          <v-table-column prop="username" label="用户名"></v-table-column>
          <v-table-column prop="watermarkName" label="水印名称"></v-table-column>
          <v-table-column prop="download" label="下载使用">
            <template slot-scope="{row}">{{row.download ? '开启' : '关闭'}}</template>
          </v-table-column>
          <v-table-column prop="preview" label="预览使用">
            <template slot-scope="{row}">{{row.preview ? '开启' : '关闭'}}</template>
          </v-table-column>
          <v-table-column prop="opt" label="操作" fixed="right" width="80px">
              <template slot-scope="{row}">
                  <span class="icon-btn" @click="onEdit(row)" title="编辑"><v-icon type="edit"></v-icon></span>
                  <span class="icon-btn ml-3" @click="onDelete(row)" title="删除"><v-icon type="delete"></v-icon></span>
              </template>
          </v-table-column>
        </config-table>

        <edit ref="edit" :users="users" :watermarks="watermarks"></edit>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import Edit from './edit/index.vue'
import { query, del } from '@/api/user-watermark'
import { query as queryWatermarks } from '@/api/watermark'
import { queryUsers } from '@/api/user'

function generateIds (ids: any | any[]) {
  if (typeof ids === 'number') return [ids]
  return (ids || []).map((v: any) => {
    if (typeof v === 'number') return v
    return v.id
  })
}

@Component({
  components: { Edit }
})
export default class User extends Vue {
  api = query

  form = {
    username: '',
    watermarkId: null
  }

  watermarks: any[] = []

  users: any[] = []

  onQuery () {
    this.query(this.form)
  }

  onReset () {
    const $form = this.$refs.form as any
    $form.resetFields()
  }

  onAdd () {
    (this.$refs.edit as any).add().then(() => {
      this.$message.success('新增关联成功')
      this.refresh()
    }).catch(() => {
      // ignore
    })
  }

  onEdit (row: any) {
    (this.$refs.edit as any).edit(row).then(() => {
      this.$message.success('更新关联成功')
      this.refresh()
    }).catch(() => {
      // ignore
    })
  }

  onDelete (row: any) {
    this.$modal.confirm({ title: '确认', content: '确认删除关联？' }).then(() => {
      return del(row.id).then(() => {
        this.$message.success('删除关联成功')
        this.refresh()
      })
    }).catch(() => {
      // ignore
    })
  }

  query (params: any) {
    const $e = (this as any).$refs.configTable
    if ($e) $e.query(params)
  }

  refresh () {
    const $e = (this as any).$refs.configTable
    $e.refresh()
    const $c = (this as any).$refs.configTable as any
    $c.onClearSelection()
  }

  loadWatermarks () {
    queryWatermarks().then(data => {
      this.watermarks = data || []
    })
  }

  loadUser () {
    queryUsers({}).then(data => {
      this.users = data || []
    })
  }

  mounted () {
    this.onQuery()
    this.loadWatermarks()
    this.loadUser()
  }
}
</script>

<style lang="scss" module>
.header {
}

.icon {
  font-size: 30px;
  margin: -4px 4px -4px 0;
}

.label {
  display: flex;
  align-items: center;
}
</style>
