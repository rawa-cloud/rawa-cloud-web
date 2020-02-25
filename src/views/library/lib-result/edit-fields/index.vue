<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="720px" :title="title">
        <v-form ref="form" :class="[$style.form]" :rules="rules" :model="form" label-width="160px" label-position="left" class="ml-3" v-if="visible">
          <v-form-item :label="row.name" :prop="row.fieldDefId + ''" v-for="(row, i) in fields" :key="i">
            <!-- <v-input clearable v-model="form.name" maxlength="16"></v-input> -->
            <form-control :form="form" :name="row.fieldDefId + ''" :type="row.type" :options="row.options || []"></form-control>
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
import { updateLibraryFields } from '@/api/library'
import FormControl from './form-control/index.vue'

@Component({
  components: { FormControl }
})
export default class EditFields extends Vue {
  lib: any = null

  form = {
  }

  rules = {
    // name: [
    //   { validator: 'required', message: '名称必填', trigger: 'blur' }
    // ]
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
    return '编辑字段'
  }

  get fields () {
    return (this.lib && this.lib.fields) || []
  }

  edit (lib: any) {
    this.lib = lib
    return this.init()
  }

  init (): Promise<any> {
    let form: any = {}
    this.fields.forEach((v: any) => {
      form[v.fieldDefId + ''] = getValue(v)
    })
    this.form = form
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })

    function getValue (field: any) {
      let { type, value } = field
      if (value) return JSON.parse(value)
      if (['checkbox', 'date_range', 'datetime_range'].includes(type)) return []
      if (['bool'].includes(type)) return false
      return ''
    }
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
        return updateLibraryFields(this.lib.id, req)
      }
      return Promise.reject(new Error('valid fail'))
    })
  }

  generateReq () {
    let req = Object.entries(this.form).map(([k, v]) => {
      return {
        fieldDefId: +k,
        value: JSON.stringify(v)
      }
    })
    return req
  }
}
</script>

<style lang="scss" module>
.form {
  height: calc(70vh - 120px);
  overflow: auto;
}
</style>
