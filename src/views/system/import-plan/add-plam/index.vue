<template>
<div>
  <v-modal :visible.sync="actualVisible" width="560px" title="新增导入计划">
    <v-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
      <v-form-item label="Cron表达式" prop="cron" required>
        <v-input clearable v-model.trim="form.cron" maxlength="32"
        placeholder="例如(2020年4月20日凌晨2点执行):  0 0 2 20 4 ?" class="d-block"></v-input>
      </v-form-item>
      <v-form-item label="导入文件地址" prop="filePath" required>
        <v-input clearable v-model.trim="form.filePath" maxlength="128" class="d-block"></v-input>
      </v-form-item>
      <v-form-item label="导入文件目录" prop="parentId" required>
        <v-select v-model="form.parentId">
          <v-option v-for="(row, i) in files" :key="i" :label="row.name" :value="row.id"></v-option>
        </v-select>
      </v-form-item>
    </v-form>

    <div slot="footer" class="text-right">
      <v-button @click="onCancel">取消</v-button>
      <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
    </div>
  </v-modal>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { addPlan } from '@/api/import-plan'
import { getRootFile } from '@/api/file'

@Component
export default class AddPlan extends Vue {
  form = {
    cron: '',
    filePath: '',
    parentId: null
  }

  rules = {
    cron: [
      { validator: 'required', message: 'cron表达式必填' }
    ],
    filePath: [
      { validator: 'required', message: '导入文件地址必填' }
    ],
    parentId: [
      { validator: 'required', message: '导入文件根目录必填' }
    ]
  }

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

  add (): Promise<any> {
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      cron: '',
      filePath: '',
      parentId: ((this.files[0] && this.files[0].id) || null) as any
    }
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
    $e.validate().then(({ valid, errors }: any) => {
      if (valid) {
        addPlan(this.form as any).then(data => {
          this.visible = false
          if (this.resolve) this.resolve(data)
        })
      }
    })
  }

  loadFiles () {
    getRootFile().then(data => {
      this.files = data ? [data] : []
    })
  }

  mounted () {
    this.loadFiles()
  }
}
</script>
