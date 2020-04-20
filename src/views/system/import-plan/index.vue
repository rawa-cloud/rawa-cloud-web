<template>
<div class="m-3">
  <div class="mb-2">
    <v-button type="primary" @click="onAdd">新增导入计划</v-button>
  </div>
  <v-table :data-source="dataSource" height="360px">
      <v-table-column prop="cron" label="Cron表达式"></v-table-column>
      <v-table-column prop="execStatus" label="执行状态">
        <template slot-scope="{row}">{{row.execStatus | transcode('execStatus')}}</template>
      </v-table-column>
      <v-table-column prop="execCount" label="执行次数"></v-table-column>
      <v-table-column prop="startTime" label="上一次开始时间"></v-table-column>
      <v-table-column prop="endTime" label="上一次开始时间"></v-table-column>
       <v-table-column prop="parentId" label="导入目录"></v-table-column>
      <v-table-column prop="filePath" label="导入文件地址"></v-table-column>
      <v-table-column prop="success" label="是否成功">
        <template slot-scope="{row}">{{row.success | transcode('success')}}</template>
      </v-table-column>
      <v-table-column prop="remark" label="执行日志"></v-table-column>

      <v-table-column prop="opt" label="操作" fixed="right" width="80px">
        <a type="text" @click="onDelete">删除</a>
      </v-table-column>

  </v-table>

  <add-plan ref="addPlan"></add-plan>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { queryPlan, deletePlan } from '@/api/import-plan'
import AddPlan from './add-plam/index.vue'

@Component({
  components: { AddPlan }
})
export default class ImportPlan extends Vue {
  dataSource: any[] = []

  loadData () {
    queryPlan().then(data => {
      this.dataSource = data || []
    })
  }

  onAdd () {
    (this.$refs.addPlan as any).add().then(() => {
      this.$message.success('新增导入计划成功')
      this.loadData()
    })
  }

  onDelete () {
    deletePlan().then(() => {
      this.$message.success('删除成功')
      this.loadData()
    })
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
</style>
