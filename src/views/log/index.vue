<template>
<div class="mx-3">
  <div>
        <div>
            <v-form layout="horizontal" :model="form" ref="form">
                <v-form-item prop="module" label="模块">
                    <v-select v-model="form.module" clearable class="w-10">
                      <dict-option name="logModule"></dict-option>
                    </v-select>
                </v-form-item>

                <v-form-item prop="type" label="类型">
                    <v-select v-model="form.type" clearable class="w-10">
                      <dict-option name="logType"></dict-option>
                    </v-select>
                </v-form-item>
                <v-form-item prop="operateBy" label="操作人">
                    <v-select clearable v-model="form.operateBy" searchable :search-fn="searchFn" class="w-10"></v-select>
                </v-form-item>
                <v-form-item prop="operateTime" label="操作时间">
                    <v-range-picker v-model="form.operateTime" class="w-10"></v-range-picker>
                </v-form-item>
                <v-form-item >
                   <v-button type="primary" @click="onQuery">查询</v-button>
                   <v-button class="ml-3" @click="onReset">重置</v-button>
                </v-form-item>
            </v-form>
        </div>

        <div>
          <config-table row-key="id" :class="[$style.table]" :api="api" simple height="calc(100vh - 64px - 8px - 62px - 70px)" ref="configTable">
            <v-table-column prop="module" label="操作模块"><template slot-scope="{row}">{{row.module | transcode('logModule')}}</template></v-table-column>
            <v-table-column prop="type" label="操作类型"><template slot-scope="{row}">{{row.type | transcode('logType')}}</template></v-table-column>
            <v-table-column prop="operateBy" label="操作人"></v-table-column>
            <v-table-column prop="operateTime" label="操作时间"></v-table-column>
            <v-table-column prop="remark" label="操作备注">
              <div slot-scope="{row}">
                 <span>{{row.remark | ellipsis(50)}}</span>
                 <span class="ml-2 icon-btn" @click="onCopy(row.remark)"> <v-icon type="copy"></v-icon> </span>
              </div>
            </v-table-column>
          </config-table>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Inject, Watch } from 'vue-property-decorator'
import { queryLogs } from '@/api/log'
import { queryUsers } from '@/api/user'
import { copy } from '@/helpers/copy'
@Component({
})
export default class Log extends Vue {
    api = queryLogs

    form = {
      module: '',
      type: '',
      operateBy: '',
      operateTime: ['2020/05/03', '2020/05/04']
    }

    value: string = ''

    users: any[] = []

    get req () {
      let r: any = { }
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

    onCopy (text: string) {
      copy(text)
      this.$message.success('已复制到粘贴板')
    }

    query (params: any) {
      const $e = (this as any).$refs.configTable
      if ($e) $e.query(params)
    }

    refresh () {
      const $e = (this as any).$refs.configTable
      $e.refresh()
    }

    searchFn (input: string, cb: (items: any[])=>void) {
      let ret = this.users.filter((v: any) => {
        if (!input) return true
        return v.username.includes(input) || v.cname.includes(input)
      }).slice(0, 15).map((v: any) => {
        return {
          label: v.cname + ' - ' + v.username,
          value: v.username
        }
      })
      cb(ret)
    }

    loadUser () {
      queryUsers({}).then(data => {
        this.users = data || []
      })
    }

    mounted () {
      this.onQuery()
      this.loadUser()
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
