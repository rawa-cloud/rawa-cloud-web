<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" title="新增标签" :maskClosable="false" :keyboard="false">
        <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <v-form-item label="标签" prop="tag" required>
            <v-input v-model.trim="form.tag" clearable maxlength="36"></v-input>
          </v-form-item>
        </v-form>

        <div slot="footer" class="text-right">
          <v-button @click="onCancel">取消</v-button>
          <v-button type="primary" class="ml-3" @click="onConfirm">确认</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { addFile, patchFile } from '@/api/file'

@Component
export default class AddTag extends Vue {
  form = {
    tag: ''
  }

  rules = {
    'tag': [
      { validator: 'required', message: '请输入标签' }
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
      tag: ''
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
        this.visible = false
        if (this.resolve) this.resolve(this.form.tag)
      }
    })
  }
}
</script>
