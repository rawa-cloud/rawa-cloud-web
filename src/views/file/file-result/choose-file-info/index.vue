<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" title="上传文件信息" :maskClosable="false" :keyboard="false">
        <v-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left">
          <v-form-item label="负责人" prop="leader" required>
            <v-select v-model="form.leader" searchable clearable>
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
          <v-form-item label="重点单位" prop="keyUnit" required>
            <v-select v-model="form.keyUnit" searchable clearable>
              <v-option :label="row.label" :value="row.code" v-for="(row, i) in keyUnits" :key="i"></v-option>
            </v-select>
          </v-form-item>
        </v-form>

        <div slot="footer" class="text-right">
          <v-button @click="onCancel">取消</v-button>
          <v-button type="primary" class="ml-3" @click="onConfirm">下一步</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'
import { addFile, patchFile } from '@/api/file'
import { DictModule } from '@/store'

@Component
export default class ChooseFileInfo extends Vue {
  @DictModule.State items!: Record<string, Array<any>>

  form = {
    leader: '',
    location: '',
    unit: '',
    keyUnit: ''
  }

  data: any = null

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
      { validator: 'required', message: '重点单位单位必填' }
    ]
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
    // return (this.items['keyUnit'] || []).filter((v: any) => (v && v.data.deptThirdId) === dept.data.thirdId)
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
      this.form.keyUnit = ''
    } else {
      this.locations = this.getLocationsByUnitCode(this.unit)
      this.keyUnits = this.getKeyUnitsByUnitCode(this.unit)
      this.form.location = (this.locations[0] && this.locations[0].code) || ''
      if (!this.keyUnits.some((v: any) => v.code === this.form.keyUnit)) this.form.keyUnit = ''
    }
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

  choose (data: any): Promise<any> {
    this.data = data || null
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      leader: (this.data && this.data.leader) || '',
      location: (this.data && this.data.location) || '',
      unit: (this.data && this.data.unit) || '',
      keyUnit: ''
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
      leader: '',
      location: '',
      unit: '',
      keyUnit: ''
    }
    if (this.reject) this.reject()
  }

  onConfirm () {
    const $e = this.$refs.form as any
    $e.validate().then(({ valid, errors }: any) => {
      if (valid) {
        this.visible = false
        setTimeout(() => {
          this.form = {
            leader: '',
            location: '',
            unit: '',
            keyUnit: ''
          }
        }, 0)
        if (this.resolve) this.resolve(Object.assign({}, this.form))
      }
    })
  }
}
</script>
