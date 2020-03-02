<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="40vw" :title="title">
        <div :class="[$style.body]">
          <v-form ref="form" :rules="rules" :model="form" label-width="80px" label-position="left" class="ml-3" v-if="visible">
            <v-form-item label="收藏名称" prop="name" required>
              <v-input clearable v-model="form.name" maxlength="16"></v-input>
            </v-form-item>
            <v-form-item label="收藏类别" prop="catalogId" required>
              <v-select clearable v-model="form.catalogId">
                <v-option :label="row.name" :value="row.id" v-for="row in catalogs" :key="row.id"></v-option>
              </v-select>
            </v-form-item>
            <v-form-item label="备注" prop="name">
              <v-textarea v-model.trim="form.remark" maxlength="100"></v-textarea>
            </v-form-item>
          </v-form>
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
import { queryCatalogs, addItem } from '@/api/favorite'

@Component
export default class FileCollect extends Vue {
  title: string = '收藏文件'

  id: any = null

  name: string = ''

  catalogs: any = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  form = {
    name: '',
    catalogId: null,
    remark: ''
  }

  rules = {
    name: [
      { validator: 'required', message: '收藏名称必填', trigger: 'blur' }
    ],
    catalogId: [
      { validator: 'required', message: '收藏名称必填', trigger: 'change' }
    ]
  }

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  collect (id: number, name?: string) {
    this.id = id
    this.name = name || ''
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      name: this.name || '',
      catalogId: null,
      remark: ''
    }
    this.loadCatalogs()
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
    this.request(this.generateReq()).then(data => {
      this.visible = false
      if (this.resolve) this.resolve(data)
    })
  }

  request (req: any): Promise<any> {
    const $form = this.$refs.form as any
    return $form.validate().then(({ valid }: any) => {
      if (valid) {
        return addItem(this.generateReq())
      }
      return Promise.reject(new Error('valid fail'))
    })
  }

  generateReq (): any {
    return {
      name: this.form.name,
      catalogId: this.form.catalogId,
      fileId: this.id,
      remark: this.form.remark
    }
  }

  loadCatalogs () {
    queryCatalogs().then(data => {
      this.catalogs = data || []
    })
  }
}
</script>

<style lang="scss" module>
.body{

}
</style>
