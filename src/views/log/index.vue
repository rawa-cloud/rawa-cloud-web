<template>
<div>
  <div>
        <div>
            <v-form layout="horizontal" class="mx-3 mt-3" :model="form" ref="form">
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
                <v-form-item >
                   <v-button type="primary" @click="onQuery">查询</v-button>
                   <v-button class="ml-3" @click="onReset">重置</v-button>
                </v-form-item>
            </v-form>
        </div>

        <div>
          <config-table row-key="id" :api="api" simple height="calc(100vh - 360px)" ref="configTable">
            <v-table-column prop="module" label="操作模块"><template slot-scope="{row}">{{row.module | transcode('logModule')}}</template></v-table-column>
            <v-table-column prop="type" label="操作类型"><template slot-scope="{row}">{{row.type | transcode('logType')}}</template></v-table-column>
            <v-table-column prop="operateBy" label="操作人"></v-table-column>
            <v-table-column prop="operateTime" label="操作时间"></v-table-column>
            <v-table-column prop="remark" label="操作备注"></v-table-column>
          </config-table>
        </div>
    </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Inject, Watch } from 'vue-property-decorator'
import { queryLogs } from '@/api/log'
@Component({
})
export default class Log extends Vue {
    api = queryLogs

    form = {
      module: '',
      type: ''
    }

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

    query (params: any) {
      const $e = (this as any).$refs.configTable
      if ($e) $e.query(params)
    }

    refresh () {
      const $e = (this as any).$refs.configTable
      $e.refresh()
    }

    mounted () {
      this.onQuery()
    }
}
</script>

<style lang="scss" module>

</style>
