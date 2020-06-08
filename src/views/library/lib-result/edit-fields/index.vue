<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="960px" :title="title">
        <div style="height: calc(80vh - 120px); overflow: auto;">
          <section-header>权限设置</section-header>
          <v-form ref="fm1" label-width="160px" label-position="left" class="ml-3" v-if="visible">
            <v-form-item label="可见性">
              <v-radio-group v-model="visibility">
                <v-radio label="all" :disabled="lib.createdUser !== $auth.username">所有人</v-radio>
                <v-radio label="assign" :disabled="lib.createdUser !== $auth.username">指定分配</v-radio>
              </v-radio-group>
            </v-form-item>
          </v-form>

          <section-header v-if="fileEnabled">关联文件</section-header>
          <div class="py-2" v-if="fileEnabled">
            <v-button type="primary" size="sm" @click="onChooseFile" :disabled="!lib || !lib.editable">选择文件</v-button>
            <span class="ml-3">{{(file && file.name) || (lib && lib.file && lib.file.filePath) }}</span>
            <file-chooser ref="fileChooser"></file-chooser>
          </div>

          <section-header>编辑字段</section-header>
          <v-form ref="form" :class="[$style.form]" :rules="rules" :model="form" label-width="160px" label-position="left" class="ml-3" v-if="visible">
            <v-form-item :label="row.name" :prop="row.fieldDefId + ''" v-for="(row, i) in fields" :key="i">
              <!-- <v-input clearable v-model="form.name" maxlength="16"></v-input> -->
              <form-control :form="form" :name="row.fieldDefId + ''" :type="row.type" :options="row.options || []" :disabled="row.disabled"></form-control>
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
import { updateLibraryFields, addLibraryFile, updateLibrary } from '@/api/library'
import FormControl from './form-control/index.vue'
import { getFile } from '../../../../api/file'
import { http } from '@/api'

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

  file: any = null

  visibility: string = 'all'

  properties: any[] = []

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
    return '编辑'
  }

  get fileEnabled () {
    return this.properties.some((v: any) => v.name === 'form.file.enabled' && v.value === 'Y')
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
    // this.file
    this.visibility = (this.lib && this.lib.visibility) || 'all'
    this.file = null
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

  onChooseFile () {
    const $e = (this as any).$refs.fileChooser as any
    $e.choose().then((fileId: number) => {
      return getFile(fileId)
      // addLibraryFile(row.id, fileId).then(() => {
      //   this.$message.success('添加文件链接成功')
      //   this.refresh()
      // })
    }).then((data: any) => {
      this.file = data || null
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

  request (): Promise<any> {
    const $form = this.$refs.form as any
    const all = []
    const q1 = $form.validate().then(({ valid }: any) => {
      if (valid) {
        let req: any = this.generateReq()
        return updateLibraryFields(this.lib.id, req)
      }
      return Promise.reject(new Error('valid fail'))
    })
    all.push(q1)
    if (this.file && this.file.id !== (this.lib.file && this.lib.file.id)) {
      const q2 = addLibraryFile(this.lib.id, this.file.id)
      all.push(q2)
    }
    if (this.visibility !== this.lib.visibility) {
      const q3 = updateLibrary(this.lib.id, { catalogId: this.lib.catalogId, visibility: this.visibility } as any)
      all.push(q3)
    }
    return Promise.all(all)
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

  loadProperties () {
    http().get('/properties').then(data => {
      this.properties = data || []
    })
  }

  mounted () {
    this.loadProperties()
  }
}
</script>

<style lang="scss" module>
.form {
}
</style>
