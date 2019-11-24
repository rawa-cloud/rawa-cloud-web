<template>
<div>
    <v-table pageable row-key="id" :data-source="dataSource" height="calc(100vh - 300px)">
        <v-table-column prop="module" label="操作模块"></v-table-column>
        <v-table-column prop="type" label="操作类型"></v-table-column>
        <v-table-column prop="operateBy" label="操作人"></v-table-column>
        <v-table-column prop="operateTime" label="操作时间"></v-table-column>
        <v-table-column prop="remark" label="操作备注"></v-table-column>
    </v-table>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { queryLogs  } from '@/api/log'

@Component
export default class Log extends Vue {
   
   dataSource: any[] = []

   loadData () {
       this.dataSource = []
       queryLogs().then(data => {
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
