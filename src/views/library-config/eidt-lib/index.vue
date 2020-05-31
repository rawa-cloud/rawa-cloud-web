<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" :title="title">
        <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <v-form-item label="名称" prop="name" required>
            <v-input clearable v-model.trim="form.name" maxlength="16"></v-input>
          </v-form-item>
          <v-form-item label="类型" prop="type" v-if="typeVisible">
            <v-select clearable v-model.trim="form.type">
              <dict-option name="libraryFieldType"></dict-option>
            </v-select>
          </v-form-item>
          <v-form-item label="可见性" prop="visibility" required v-if="isTop2">
            <v-radio-group v-model="form.visibility">
              <v-radio label="all">所有人</v-radio>
              <v-radio label="assign">指定分配</v-radio>
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

import { Vue, Component } from 'vue-property-decorator'
import { addLibCatalog, addLibCatalogField, addLibCatalogFieldDict,
  updateLibCatalog, updateLibCatalogField, updateLibCatalogFieldDict } from '@/api/library'
import Node from '@/components/tile-tree/Node'

@Component
export default class EditLib extends Vue {
  node: Node | null = null

  isEdit: boolean = false

  form = {
    name: '',
    type: '',
    visibility: 'all'
  }

  rules = {
    'name': [
      { validator: 'required', message: '名称必填' }
    ],
    'type': [
      { validator: 'required', message: '类型必填' }
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

  get title () {
    return this.isEdit ? '编辑' : '新增'
  }

  get typeVisible () {
    if (!this.node) return false
    if (this.isEdit && this.node.level === 2) return true
    if (!this.isEdit && this.node.level === 1) return true
    return false
  }

  get isTop () {
    return this.isEdit ? (this.node && this.node.level === 1) : !this.node
  }

  get isTop2 () {
    return this.isEdit ? (this.node && this.node.level < 3) : (this.node && this.node.level < 2)
  }

  add (node: Node): Promise<any> {
    this.isEdit = false
    this.node = node
    return this.init()
  }

  edit (node: Node) {
    this.isEdit = true
    this.node = node
    return this.init()
  }

  init (): Promise<any> {
    (this.$refs.form as any).resetFields()
    this.form = {
      name: !this.isEdit ? '' : (this.node && this.node.data.name) || '',
      type: !this.isEdit ? '' : (this.node && this.node.data.type) || '',
      visibility: !this.isEdit ? 'all' : (this.node && this.node.data.visibility) || 'all'
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
    if (!this.isEdit) {
      if (!this.node) return addLibCatalog(req)
      if (this.node.level === 1) return addLibCatalogField(req)
      if (this.node.level === 2) return addLibCatalogFieldDict(req)
    } else {
      if (this.node && this.node.level === 1) return updateLibCatalog(this.node.data.id, req)
      if (this.node && this.node.level === 2) return updateLibCatalogField(this.node.data.id, req)
      if (this.node && this.node.level === 3) return updateLibCatalogFieldDict(this.node.data.id, req)
    }
    throw new Error('not implement')
  }

  generateReq () {
    let req: any = { name: this.form.name }
    if (!this.isEdit) {
      if (this.node && this.node.level === 1) {
        req.catalogId = this.node.data.id
        req.type = this.form.type
      }
      if (this.isTop2) {
        req.visibility = this.form.visibility
      }
      if (this.node && this.node.level === 2) req.filedDefId = this.node.data.id
    } else {
      if (this.node && this.node.level === 2) req.type = this.form.type
      if (this.isTop2) {
        req.visibility = this.form.visibility
      }
    }
    return req
  }
}
</script>
