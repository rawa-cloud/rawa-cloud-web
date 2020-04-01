<template>
<div>
  <v-table :data-source="dataSource" pageable>
      <v-table-column prop="principleName" label="部门/用户"></v-table-column>
      <v-table-column prop="umask" label="权限">
      <template slot-scope="{row}">{{row.umask | umask}}</template>
      </v-table-column>
      <v-table-column prop="validDays" label="有效天数"></v-table-column>
  </v-table>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { queryAuthorities } from '@/api/authority'

@Component
export default class FileAuthority extends Vue {
  @Prop(Number) id!: number

  dataSource: any[] = []

  loadData () {
    if (!this.id) {
      this.dataSource = []
      return
    }
    const req = { fileId: this.id }
    queryAuthorities(req).then(data => {
      this.dataSource = data || []
    })
  }

  @Watch('id', { immediate: true }) idChange () {
    this.loadData()
  }
}
</script>
