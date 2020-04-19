<template>
<div>
  <v-modal :visible.sync="actualVisible" width="560px" title="新增导出计划">
    <v-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
      <v-form-item label="Cron表达式" prop="cron" required>
        <v-input clearable v-model.trim="form.cron" maxlength="32"
        placeholder="例如(每月1号的凌晨2点):  0 0 2 1 * ?" class="d-block"></v-input>
      </v-form-item>
      <v-form-item label="导出文件根目录" prop="filePath" required>
        <v-input clearable v-model.trim="form.filePath" maxlength="128" class="d-block"></v-input>
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
import { addPlan } from '@/api/export-plan'

@Component
export default class AddPlan extends Vue {
  form = {
    cron: '',
    filePath: ''
  }

  rules = {
    cron: [
      { validator: 'required', message: 'cron表达式必填' }
    ],
    filePath: [
      { validator: 'required', message: '导出文件根目录必填' }
    ]
  }

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
      filePath: ''
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
        addPlan(this.form).then(data => {
          this.visible = false
          if (this.resolve) this.resolve(data)
        })
      }
    })
  }
}
</script>
