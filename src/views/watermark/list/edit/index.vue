<template>
<div>
  <v-modal :visible.sync="actualVisible" width="50vw" :title="title" :maskClosable="false" :keyboard="false">
    <div style="max-height: 480px; overflow: auto;">
      <v-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
        <v-form-item label="名称" prop="name" required>
          <v-input clearable v-model.trim="form.name" maxlength="16" :disabled="isEdit"></v-input>
        </v-form-item>
        <v-form-item label="logo" prop="uuid" required>
          <v-upload :file-list.sync="fileList" accept="image/*" list-type="picture-card"
          :custom-request="customRequest" :success-fn="successFn" :limit="1" @preview="onPreview">
            <div class="text-center" v-if="fileList.length < 1">
              <div><i class="anticon anticon-plus"></i></div>
              <div>上传</div>
            </div>
          </v-upload>
        </v-form-item>
        <v-form-item label="水印内容" prop="content">
          <v-textarea placeholder="请输入内容" :rows="3" v-model.trim="form.content" maxlength="128" style="width: 100%;"></v-textarea>
        </v-form-item>
        <v-form-item label="状态" prop="status" required>
          <v-radio-group v-model="form.status">
            <v-radio :label="true">开启</v-radio>
            <v-radio :label="false">关闭</v-radio>
          </v-radio-group>
        </v-form-item>

        <v-form-item label="水印宽度比例" prop="widthRadio" required>
          <v-input-number clearable v-model="form.widthRadio" :max="1" :min="0"></v-input-number>
        </v-form-item>

        <v-form-item label="logo宽度比例" prop="logoWidthRadio" required>
          <v-input-number clearable v-model="form.logoWidthRadio" :max="1" :min="0"></v-input-number>
        </v-form-item>

        <v-form-item label="透明度" prop="opacity" required>
          <v-input-number clearable v-model="form.opacity" :max="1" :min="0"></v-input-number>
        </v-form-item>

        <v-form-item label="水平对齐" prop="horizontalPosition" required>
          <v-radio-group v-model="form.horizontalPosition">
            <v-radio label="left">左对齐</v-radio>
            <v-radio label="center">居中对齐</v-radio>
            <v-radio label="right">右对齐</v-radio>
          </v-radio-group>
        </v-form-item>

        <v-form-item label="垂直对齐" prop="verticalPosition" required>
          <v-radio-group v-model="form.verticalPosition">
            <v-radio label="top">顶部对齐</v-radio>
            <v-radio label="center">居中对齐</v-radio>
            <v-radio label="bottom">底部对齐</v-radio>
          </v-radio-group>
        </v-form-item>
      </v-form>
    </div>

    <div slot="footer" class="text-right">
      <v-button @click="onCancel">取消</v-button>
      <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
    </div>
  </v-modal>

  <v-modal :visible.sync="imgVisible">
    <img :src="file && (file.url || file.thumbUrl)" alt="&times;" style="width: 100%;">
  </v-modal>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { add as create, update } from '@/api/watermark'
import customRequest from '@/views/file/file-result/file-upload/request'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component
export default class EditDir extends Vue {
  row: any = null

  form = {
    name: '',
    uuid: '',
    content: '',
    status: true,
    widthRadio: 0.8,
    logoWidthRadio: 0.3,
    opacity: 0.4,
    verticalPosition: 'center',
    horizontalPosition: 'center'
  }

  rules = {
    name: [
      { validator: 'required', message: '名称必填' }
    ],
    // content: [
    //   { validator: 'required', message: '水印内容必填' }
    // ],
    status: [
      { validator: 'required', message: '状态必填' }
    ]
  }

  customRequest = customRequest

  fileList: any = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  imgVisible = false

  file: any = null

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

  successFn (data: any, file: any) {
    this.form.uuid = data
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
      name: (this.row && this.row.name) || '',
      uuid: (this.row && this.row.uuid) || '',
      content: (this.row && this.row.content) || '',
      status: (this.row && this.row.uuid !== false) || true,
      widthRadio: (this.row && this.row.widthRadio) || 0.8,
      logoWidthRadio: (this.row && this.row.logoWidthRadio) || 0.3,
      opacity: (this.row && this.row.opacity) || 0.4,
      verticalPosition: (this.row && this.row.verticalPosition) || 'center',
      horizontalPosition: (this.row && this.row.horizontalPosition) || 'center'
    }
    this.fileList = []
    if (this.form.uuid) {
      this.fileList.push({ url: `${baseUrl}/nas/download/${this.form.uuid}` })
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

  onPreview (file: any) {
    this.imgVisible = true
    this.file = file
  }

  request (): Promise<number | void> {
    let req: any = this.generateReq()
    if (this.isEdit) return update(this.row.id, req)
    return create(req)
  }

  generateReq () {
    const { uuid, name, content, status, widthRadio, logoWidthRadio, opacity, verticalPosition, horizontalPosition } = this.form
    if (!this.isEdit) {
      return { uuid, name, content, status, widthRadio, logoWidthRadio, opacity, verticalPosition, horizontalPosition }
    } else {
      return { uuid, content, status, widthRadio, logoWidthRadio, opacity, verticalPosition, horizontalPosition }
    }
  }
}
</script>
