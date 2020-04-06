<template>
<v-table pageable :data-source="dataSource" size="sm">
    <v-table-column prop="name" label="文件名"></v-table-column>
    <v-table-column prop="lastChangeBy" label="修改人"></v-table-column>
    <v-table-column prop="lastChangeTime" label="修改时间"></v-table-column>
    <v-table-column prop="size" label="大小"><template slot-scope="{row}">{{row.size | size}}</template></v-table-column>
    <v-table-column prop="remark" label="备注"></v-table-column>
    <v-table-column prop="opt" label="操作" fixed="right" width="160px">
        <template slot-scope="{row}">
            <span class="ml-3 icon-btn" @click="onDownload(row)" title="下载"><v-icon type="cloud-download-o"></v-icon></span>
        </template>
    </v-table-column>
</v-table>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { getFileRecords } from '@/api/file'
import { download as downloadFile } from '@/api/nas'
import { download } from '@/helpers/download'

@Component
export default class FileRecord extends Vue {
  @Prop(Number) id!: number

  dataSource: any[] = []

  loadData () {
    if (!this.id) {
      this.dataSource = []
      return
    }
    getFileRecords(this.id).then(data => {
      this.dataSource = data || []
    })
  }

  onDownload (row: any) {
    downloadFile(row.uuid).then(data => {
      download(data, row.name)
    })
  }

  onPreview () {

  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
</style>
