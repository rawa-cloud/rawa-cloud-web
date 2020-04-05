<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="640px" :title="title">
        <div :class="[$style.body]">
          <file-transfer v-model="files" only-dir peer></file-transfer>
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
import { queryDepts } from '@/api/dept'
import { addUser, addUserFiles } from '@/api/user'
import { randomString } from '@/helpers/lang'
import { getFile } from '@/api/file'

@Component
export default class UserFile extends Vue {
  row: any = null

  files: any[] = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get title () {
    return '设置文件夹管理员目录'
  }

  view (row: any) {
    this.row = row || null
    return this.init()
  }

  init (): Promise<any> {
    const origin = {
      files: (this.row && this.row.files) || []
    }
    let files = (this.row && this.row.files) || []
    const all = files.map((v: number) => getFile(v))
    Promise.all(all).then((list: any[]) => {
      this.files = (list || []).filter(v => !!v)
    })
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
    if (this.files.length < 1) {
      this.$message.warning('请至少选择一个文件夹')
    }
    this.request().then(data => {
      this.visible = false
      if (this.resolve) this.resolve(data)
    })
  }

  request (): Promise<any> {
    let req: any = this.generateReq()
    return addUserFiles(this.row.id, req)
  }

  generateReq () {
    return {
      files: this.files.map((v: any) => v.id)
    }
  }
}
</script>
<style lang="scss" module>
.body {
  height: calc(60vh - 120px);
  overflow: auto;
}
</style>
