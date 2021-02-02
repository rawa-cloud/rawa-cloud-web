<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="70vw" :title="title">
        <div :class="[$style.body]" v-if="file && visible">
          <basic-info :file="file"></basic-info>
          <v-tabs v-model="value" size="sm" v-if="file">
            <v-tab-pane name="1" label="版本列表">
              <file-record :id="file && file.id"></file-record>
            </v-tab-pane>
            <!-- <v-tab-pane name="2" label="权限管理">
              <file-authority :id="file && file.id"></file-authority>
            </v-tab-pane> -->
            <v-tab-pane name="3" label="操作历史">
              <file-log :id="file && file.id"></file-log>
            </v-tab-pane>
          </v-tabs>
        </div>

        <div slot="footer" class="text-right">
          <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import size from '@/filters/size'
import transcode from '@/filters/transcode'
import BasicInfo from './basic-info/index.vue'
import FileRecord from './file-record/index.vue'
import FileLog from './file-log/index.vue'
import FileAuthority from './file-authority/index.vue'

@Component({
  components: { BasicInfo, FileRecord, FileLog, FileAuthority }
})
export default class EditDir extends Vue {
  file: any = null

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  value: string = '1'

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get dir () {
    return this.file && this.file.dir
  }

  get title () {
    return this.dir ? '文件夹详情' : '文件详情'
  }

  resolveText (row: any) {
    if (!this.file) return ''
    if (row.formatter) return row.formatter(this.file)
    return this.file[row.key]
  }

  view (file: any) {
    this.file = file || null
    return this.init()
  }

  init (): Promise<any> {
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
    const $e = this.$refs.form as any
    this.visible = false
    if (this.resolve) this.resolve(null)
  }
}
</script>

<style lang="scss" module>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  line-height: 32px;
}

.title {
  margin-right: 12px;
}

.body {
  height: calc(70vh - 40px);
  overflow: auto;
}
</style>
