<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="70vw" title="文件轨迹">
        <div>
          <v-table pageable :data-source="dataSource" height="420px" size="sm">
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
        </div>
        <div slot="footer" class="text-right">
          <v-button @click="onCancel">取消</v-button>
          <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { getFileRecords } from '@/api/file'
import { download as downloadFile } from '@/api/nas'
import { download } from '@/helpers/download'

@Component
export default class FileRecord extends Vue {
  id: number | null = null

  dataSource: any[] = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  view (id: number) {
    this.id = id
    return this.init()
  }

  init (): Promise<any> {
    this.loadData()
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  onCancel () {
    this.visible = false
    if (this.reject) this.reject()
  }

  onConfirm () {
    this.visible = false
    if (this.resolve) this.resolve(null)
  }

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
}
</script>

<style lang="scss" module>
</style>
