<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" title="修改文件信息" :maskClosable="false" :keyboard="false">
        <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <v-form-item label="负责人" prop="leader" required>
            <v-select v-model="form.leader" searchable clearable>
              <dict-option name="user"></dict-option>
            </v-select>
          </v-form-item>
          <v-form-item label="所属辖区" prop="location" required>
            <v-select v-model="form.location" searchable clearable>
              <dict-option name="location"></dict-option>
            </v-select>
          </v-form-item>
          <v-form-item label="所属单位" prop="unit" required>
            <v-select v-model="form.unit" searchable clearable>
              <dict-option name="unit"></dict-option>
            </v-select>
          </v-form-item>
          <v-form-item label="重点单位" prop="keyUnit" required>
            <v-select v-model="form.keyUnit" searchable clearable>
              <dict-option name="keyUnit"></dict-option>
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
import { addFile, patchFile, updateFileInfo } from '@/api/file'

@Component
export default class ChooseFileInfo extends Vue {
  row: any = null

  form = {
    leader: '',
    location: null,
    unit: '',
    keyUnit: ''
  }

  rules = {
    'name': [
      { validator: 'required', message: '负责人必填' }
    ],
    'location': [
      { validator: 'required', message: '所属辖区必填' }
    ],
    'unit': [
      { validator: 'required', message: '所属单位必填' }
    ],
    'keyUnit': [
      { validator: 'required', message: '重点单位必填' }
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

  edit (row: any): Promise<any> {
    this.row = row || null
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      leader: this.row.leader || '',
      location: this.row.location || '',
      unit: this.row.unit || '',
      keyUnit: this.row.keyUnit || ''
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
        updateFileInfo(this.row.id, this.form).then(() => {
          this.visible = false
          if (this.resolve) this.resolve(this.form)
        })
      }
    })
  }
}
</script>
