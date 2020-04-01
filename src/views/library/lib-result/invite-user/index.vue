<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="720px" :title="title">

        <div>
          <div class="text-center">
            <v-input-group>
              <v-select clearable v-model="value" searchable :search-fn="searchFn" style="width: 320px;" Search...></v-select>
              <v-button color="primary" icon="plus" @click="onAdd" :disabled="!value"></v-button>
            </v-input-group>
          </div>

          <div style="height: calc(100vh - 360px); overflow: auto;">
            <v-list :data-source="data" bordered size="sm" class="mt-3" v-if="data.length > 0" >
              <v-list-item slot-scope="{item}">
                <v-list-item-meta slot="meta" :title="item.username" :description="item.cname" class="w-12"></v-list-item-meta>
                <div class="d-flex">
                  <div class="text-center" v-if="!catalog">
                    <div class="mb-2">权限</div>
                    <v-radio-group v-model="item.opt">
                      <v-radio label="w" :disabled="item.system">管理人员</v-radio>
                      <v-radio label="r" :disabled="item.system">普通用户</v-radio>
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

import { Vue, Component, Prop } from 'vue-property-decorator'
import { updateLibraryAuthorities, updateLibraryCatalogAuthorities } from '@/api/library'
import { queryUsers } from '@/api/user'

@Component
export default class InviteUser extends Vue {
  @Prop(Boolean) catalog!: boolean

  row: any = null

  data: any[] = []

  value: string = ''

  users: any[] = []

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

  invite (row: any = null): Promise<any> {
    this.row = row
    return this.init()
  }

  init (): Promise<any> {
    let data = this.catalog ? (this.row && this.row.authorityList) || [] : (this.row && this.row.authorities) || []
    this.data = []
    data.map((v: any) => {
      this.add(v.username, v.opt, v.system)
    })
    this.value = ''
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
      : updateLibraryAuthorities(this.row.id, this.generateReq())
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
    if (!this.value) return
    this.add(this.value, 'r', false)
    this.value = ''
  }

  searchFn (input: string, cb: (items: any[])=>void) {
    let ret = this.users.filter((v: any) => {
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

  mounted () {
    this.loadUser()
  }
}
</script>
