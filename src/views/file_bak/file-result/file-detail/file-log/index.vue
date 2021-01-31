<template>
    <div>
        <config-table row-key="id" simple :api="api" ref="configTable">
            <v-table-column prop="optBy" label="操作人"></v-table-column>
            <v-table-column prop="optTime" label="操作时间"></v-table-column>
            <v-table-column prop="ip" label="IP地址"></v-table-column>
            <v-table-column prop="typeDesc" label="类型"></v-table-column>
            <v-table-column prop="remark" label="描述"></v-table-column>
        </config-table>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { queryFileLogs } from '@/api/fileLog'

@Component
export default class FileLog extends Vue {
  @Prop(Number) id!: number

  api = queryFileLogs

  onQuery () {
    this.query({})
  }

  query (params: any = {}) {
    if (!this.id) return
    const $e = (this as any).$refs.configTable
    if ($e) $e.query(Object.assign({ fileId: this.id }, params))
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
