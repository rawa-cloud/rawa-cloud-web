<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="720px" :title="title">

        <div>
          <div :class="[$style.search]">
            <div class="pt-1">
              <v-cascader class="mr-2"
                    node-key="key"
                    :data-source="depts"
                    change-on-select
                    v-model="deptIds"
                    clearable placeholder="所有部门"></v-cascader>
            </div>
            <span>选择用户： </span>
            <v-input-group>
              <v-select multiple clearable collapse-tags v-model="value" searchable :search-fn="searchFn" style="width: 240px;" placeholder="查找用户" v-if="searchVisible"></v-select>
              <v-button color="primary" @click="onAdd" :disabled="value.length < 1">添加</v-button>
            </v-input-group>
          </div>

          <div style="height: calc(100vh - 360px); overflow: auto;">
            <v-list :data-source="data" bordered size="sm" class="mt-3" v-if="data.length > 0" >
              <v-list-item slot-scope="{item}">
                <v-list-item-meta slot="meta" class="w-14">
                  <div slot="title"><span>{{item.username}}</span> <span class="caption ml-3">{{item.cname}}</span> </div>
                </v-list-item-meta>
                <div class="d-flex">
                  <div class="text-center">
                    <!-- <div class="mb-2">权限</div> -->
                    <v-radio-group v-model="item.opt" v-if="!catalog">
                      <v-radio label="r" :disabled="item.system">仅可见</v-radio>
                      <v-radio label="w" :disabled="item.system">可编辑</v-radio>
                      <v-radio label="a" :disabled="item.system" v-if="!fieldDef">管理权限</v-radio>
                    </v-radio-group>
                    <v-radio-group v-model="item.opt" v-else>
                      <v-radio label="r">仅可见</v-radio>
                      <v-radio label="a">可新增</v-radio>
                    </v-radio-group>
                  </div>

                </div>
                <div slot="action">
                  <a class="ft-lg" @click="onDelete(item)" v-if="!item.system"><v-icon type="delete"></v-icon></a>
                </div>
              </v-list-item>
            </v-list>
            <no-data v-else></no-data>
          </div>
        </div>

        <div slot="footer" class="text-right">
          <v-button @click="onCancel">取消</v-button>
          <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { updateLibraryAuthorities, updateLibraryCatalogAuthorities, updateLibraryFieldDefAuthorities } from '@/api/library'
import { queryUsers } from '@/api/user'
import { queryDepts } from '@/api/dept'
import { toCascade } from '@/helpers/data'

@Component
export default class InviteUser extends Vue {
  @Prop(Boolean) catalog!: boolean

  @Prop(Boolean) fieldDef!: boolean

  row: any = null

  data: any[] = []

  value: string[] = []

  users: any[] = []

  depts: any[] = []

  deptIds: any[] = []

  searchVisible = true

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
    return '邀请成员'
  }

  get deptId () {
    return this.deptIds.length > 0 ? this.deptIds[this.deptIds.length - 1] : null
  }

  get renderedUsers () {
    return this.users.filter((v: any) => {
      if (!this.deptId) return true
      return v.deptId === this.deptId
    })
  }

  invite (row: any = null): Promise<any> {
    this.row = row
    return this.init()
  }

  init (): Promise<any> {
    let data = (this.catalog || this.fieldDef) ? (this.row && this.row.authorityList) || [] : (this.row && this.row.authorities) || []
    this.data = []
    data.map((v: any) => {
      this.add(v.username, v.opt, v.system)
    })
    this.value = []
    this.deptIds = []
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  onDelete (row: any) {
    let idx = this.data.findIndex((v: any) => v.username === row.username)
    if (idx >= 0) this.data.splice(idx, 1)
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
    return this.catalog ? updateLibraryCatalogAuthorities(this.row.id, this.generateReq())
      : (this.fieldDef ? updateLibraryFieldDefAuthorities(this.row.id, this.generateReq()) : updateLibraryAuthorities(this.row.id, this.generateReq()))
  }

  generateReq () {
    let req: any = this.data.filter((v: any) => !v.inherit).map((v: any) => {
      return {
        username: v.username,
        opt: v.opt
      }
    })
    return req
  }

  add (username: string, opt = 'r', system: boolean = false) {
    const vm = this
    let has = this.data.some(v => v.username === username)
    if (has) return
    this.data.push({
      username,
      opt,
      system,
      get cname () {
        let t = vm.users.find((v: any) => v.username === this.username)
        return (t && t.cname) || ''
      }
    })
  }

  onAdd () {
    let vm = this
    if (this.value.length < 1) return
    this.value.forEach(v => {
      this.add(v, 'r', false)
    })
    this.value = []
  }

  searchFn (input: string, cb: (items: any[])=>void) {
    let ret = this.renderedUsers.filter((v: any) => {
      if (!input) return true
      return v.username.includes(input) || v.cname.includes(input)
    }).slice(0, 15).map((v: any) => {
      return {
        label: v.cname + ' - ' + v.username,
        value: v.username
      }
    })
    cb(ret)
  }

  loadUser () {
    queryUsers({}).then(data => {
      this.users = data || []
    })
  }

  loadDepts () {
    queryDepts({}).then(data => {
      let d = (data || []).map((v: any) => Object.assign({ key: v.id, label: v.name }, v))
      this.depts = toCascade(d, 'id', 'parentId')
    })
  }

  @Watch('deptId') deptIdChange () {
    this.searchVisible = false
    this.$nextTick(() => {
      this.searchVisible = true
    })
  }

  mounted () {
    this.loadUser()
    this.loadDepts()
  }
}
</script>

<style lang="scss" module>
.search {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
