<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="320px" :title="title">
        <v-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="left" class="ml-3" v-if="visible">
          <v-form-item label="名称" prop="name" required>
            <v-input clearable v-model="form.name" maxlength="16"></v-input>
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
import { addLibrary, updateLibrary } from '@/api/library'

@Component
export default class EditLib extends Vue {
  lib: any = null

  form = {
    name: ''
  }

  rules = {
    name: [
      { validator: 'required', message: '名称必填', trigger: 'blur' }
    ]
  }

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get isEdit (): boolean {
    return this.lib && this.lib.id
  }

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get title () {
    return this.isEdit ? '编辑' : '新增'
  }

  add (lib: any): Promise<any> {
    this.lib = lib
    return this.init()
  }

  edit (lib: any) {
    this.lib = lib || null
    return this.init()
  }

  init (): Promise<any> {
    const origin = {
      name: (this.lib && this.lib.name) || ''
    }
    Object.assign(this.form, origin)
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
    this.request().then(data => {
      this.visible = false
      if (this.resolve) this.resolve(data)
    })
  }

  request (): Promise<number | void> {
    const $form = this.$refs.form as any
    return $form.validate().then(({ valid }: any) => {
      if (valid) {
        let req: any = this.generateReq()
        return this.isEdit ? updateLibrary(this.lib.id, req) : addLibrary(req)
      }
      return Promise.reject(new Error('valid fail'))
    })
  }

  generateReq () {
    let req: any = {}
    Object.assign(req, this.form)
    if (!this.isEdit) {
      req.catalogId = this.lib && this.lib.catalogId
    }
    return req
  }
}
</script>
