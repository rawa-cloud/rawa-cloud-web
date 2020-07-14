<template>
<div>
  <v-modal :visible.sync="actualVisible" width="50vw" :title="title" :maskClosable="false" :keyboard="false">
    <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
      <v-form-item prop="username" label="用户名" required>
        <v-select v-model="form.username" clearable searchable class="w-12" :disabled="isEdit">
          <v-option :label="r.cname" :value="r.username" v-for="r in users" :key="r.username"></v-option>
        </v-select>
      </v-form-item>
      <v-form-item prop="watermarkId" label="水印名称" required>
        <v-select v-model="form.watermarkId" searchable clearable class="w-12" :disabled="isEdit">
          <v-option :label="r.name" :value="r.id" v-for="r in watermarks" :key="r.id"></v-option>
        </v-select>
      </v-form-item>
      <v-form-item label="下载使用" prop="download" required>
        <v-radio-group v-model="form.download">
          <v-radio :label="true">开启</v-radio>
          <v-radio :label="false">关闭</v-radio>
        </v-radio-group>
      </v-form-item>
      <v-form-item label="预览使用" prop="preview" required>
        <v-radio-group v-model="form.preview">
          <v-radio :label="true">开启</v-radio>
          <v-radio :label="false">关闭</v-radio>
        </v-radio-group>
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

import { Vue, Component, Prop } from 'vue-property-decorator'
import { add as create, update } from '@/api/user-watermark'

@Component
export default class Edit extends Vue {
  @Prop(Array) users!: any[]

  @Prop(Array) watermarks!: any[]

  row: any = null

  form = {
    username: '',
    watermarkId: null,
    download: true,
    preview: true
  }

  rules = {
    username: [
      { validator: 'required', message: '用户名必选' }
    ],
    watermarkId: [
      { validator: 'required', message: '水印必选' }
    ],
    download: [
      { validator: 'required', message: '下载使用必填' }
    ],
    preview: [
      { validator: 'required', message: '预览使用必填' }
    ]
  }

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get isEdit (): boolean {
    return !!this.row
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

  add (): Promise<any> {
    this.row = null
    return this.init()
  }

  edit (row: any) {
    this.row = row || null
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      username: (this.row && this.row.username) || '',
      watermarkId: (this.row && this.row.watermarkId) || null,
      download: !!this.row && !!this.row.download,
      preview: !!this.row && !!this.row.preview
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
        this.request().then(data => {
          this.visible = false
          if (this.resolve) this.resolve(data)
        })
      }
    })
  }

  request (): Promise<number | void> {
    let req: any = this.generateReq()
    if (this.isEdit) return update(this.row.id, req)
    return create(req)
  }

  generateReq () {
    return Object.assign({}, this.form)
  }
}
</script>
