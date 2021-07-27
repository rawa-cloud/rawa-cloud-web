<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" :title="title" :maskClosable="false" :keyboard="false">
        <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <v-form-item label="名称" prop="name" required v-if="!file">
            <v-input clearable v-model.trim="form.name" maxlength="16"></v-input>
          </v-form-item>

          <v-form-item label="负责人" prop="leader" required>
            <v-select v-model="form.leader" searchable clearable :disabled="isEdit">
              <v-option :label="row.label" :value="row.code" v-for="(row, i) in leaders" :key="i"></v-option>
            </v-select>
          </v-form-item>
          <v-form-item label="所属辖区" prop="location" required>
            <v-select v-model="form.location" searchable disabled>
              <v-option :label="row.label" :value="row.code" v-for="(row, i) in locations" :key="i"></v-option>
            </v-select>
          </v-form-item>
          <v-form-item label="所属单位" prop="unit" required>
            <v-select v-model="form.unit" searchable disabled>
              <v-option :label="row.label" :value="row.code" v-for="(row, i) in units" :key="i"></v-option>
            </v-select>
          </v-form-item>

          <v-form-item label="容量(M)" prop="limitSize">
            <v-input-number v-model="form.limitSize" maxlength="16" :min="0"></v-input-number>
          </v-form-item>
          <v-form-item label="文件类型" prop="limitSuffix">
            <div class="d-flex align-items-center">
                <v-input clearable v-model.trim="form.limitSuffix" maxlength="16"></v-input>
                <v-popover>
                    <span class="ml-2 icon-btn text-info" slot="reference"><v-icon type="question-circle"></v-icon></span>
                    <span>多个后缀使用英文标点,隔开</span>
                </v-popover>
            </div>
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

import { Vue, Component, Watch } from 'vue-property-decorator'
import { addFile, patchFile } from '@/api/file'
import { DictModule } from '@/store'

@Component
export default class EditDir extends Vue {
  @DictModule.State items!: Record<string, Array<any>>

  file: any = null

  parentId?: number | null = null

  form = {
    name: '',
    leader: '',
    location: '',
    unit: '',
    limitSize: null,
    limitSuffix: ''
  }

  rules = {
    'name': [
      { validator: 'required', message: '名称必填' }
    ],
    'leader': [
      { validator: 'required', message: '负责人必选' }
    ],
    'unit': [
      { validator: 'required', message: '单位必选' }
    ],
    'location': [
      { validator: 'required', message: '辖区必选' }
    ]
  }

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get isEdit (): boolean {
    return !!this.file
  }

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get title () {
    return this.isEdit ? '编辑文件夹' : '新建文件夹'
  }

  get leaders () {
    return (this.items && this.items['user']) || []
  }

  units: any[] = []

  locations: any[] = []

  keyUnits: any = []

  getUnitsByLeaderCode (leaderCode: any) {
    if (!leaderCode) return []
    const user = (this.items['user'] || []).find((v: any) => v.code === leaderCode)
    if (!user || !user.data) return []
    return (this.items['unit'] || []).filter((v: any) => (v && v.data && v.data.id) === user.data.deptId)
  }

  getLocationsByUnitCode (code: any) {
    if (!code) return []
    const dept = (this.items['unit'] || []).find((v: any) => v.code === code)
    if (!dept || !dept.data) return []
    return (this.items['location'] || []).filter((v: any) => (v && v.code) === dept.data.areaCode)
  }

  getKeyUnitsByUnitCode (code: any) {
    // if (!code) return []
    // const dept = (this.items['unit'] || []).find((v: any) => v.code === code)
    // if (!dept) return []
    // return (this.items['keyUnit'] || []).filter((v: any) => (v && v.deptThirdId) === dept.thirdId)
    return (this.items['keyUnit'] || [])
  }

  get leader () {
    return (this.form && this.form.leader) || ''
  }

  get unit () {
    return this.form.unit || ''
  }

  @Watch('leader', { immediate: true }) leaderChange () {
    if (!this.leader) {
      this.units = []
      this.form.unit = ''
    } else {
      this.units = this.getUnitsByLeaderCode(this.leader)
      this.form.unit = (this.units[0] && this.units[0].code) || ''
    }
  }

  @Watch('unit', { immediate: true }) unitChange () {
    if (!this.unit) {
      this.locations = []
      this.keyUnits = []
      this.form.location = ''
      // this.form.keyUnit = ''
    } else {
      this.locations = this.getLocationsByUnitCode(this.unit)
      this.keyUnits = this.getKeyUnitsByUnitCode(this.unit)
      this.form.location = (this.locations[0] && this.locations[0].code) || ''
      // if (!this.keyUnits.some((v: any) => v.code === this.form.keyUnit)) this.form.keyUnit =''
    }
  }

  add (parentId: number | null): Promise<any> {
    this.parentId = parentId
    this.file = null
    return this.init()
  }

  edit (file: any) {
    this.file = file || null
    this.parentId = null
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      leader: (this.file && this.file.leader) || this.$auth.username || '',
      location: (this.file && this.file.location) || '',
      unit: (this.file && this.file.unit) || '',
      name: (this.file && this.file.name) || '',
      limitSize: (this.file && this.file.limitSize) || null,
      limitSuffix: (this.file && this.file.limitSuffix) || ''
    }
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  onCancel () {
    this.visible = false
    this.form = {
      name: '',
      leader: '',
      location: '',
      unit: '',
      limitSize: null,
      limitSuffix: ''
    }
    if (this.reject) this.reject()
  }

  onConfirm () {
    const $e = this.$refs.form as any
    $e.validate().then(({ valid, errors }: any) => {
      if (valid) {
        this.request().then(data => {
          this.visible = false
          this.form = {
            name: '',
            leader: '',
            location: '',
            unit: '',
            limitSize: null,
            limitSuffix: ''
          }
          if (this.resolve) this.resolve(data)
        })
      }
    })
  }

  request (): Promise<number | void> {
    let req: any = this.generateReq()
    if (this.isEdit) return patchFile(this.file.id, req)
    return addFile(req)
  }

  generateReq () {
    let req: any = { dir: true }
    Object.assign(req, this.form)
    if (req.limitSize) req.limitSize = req.limitSize * 1024 * 1024
    if (this.isEdit) {
      // req.id = this.file.id
    } else {
      let parentId: any = this.parentId
      req.parentId = parentId
    }
    return req
  }
}
</script>
