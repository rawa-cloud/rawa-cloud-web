<template>
<div :class="[$style.container]">
  <div class="my-2" v-if="visible">
      <div>
        <div v-if="authority && authority.implicit" class="my-2">
          继承于 <span>部门/用户</span> <span class="text-info"> {{authority.principleName}} </span>, <span>文件(夹) </span> <span class="text-info"> {{authority.fileName}} </span> <a @click="onUp(authority)"> &gt;&gt; 前往</a>
        </div>
        <v-checkbox v-model="allChecked" :disabled="!editable">全部</v-checkbox>
        <v-checkbox v-model="noneChecked" :disabled="!editable">禁用</v-checkbox>
      </div>
      <v-checkbox-group v-model="form.bits" v-if="editable">
        <v-row :gutter="16">
          <v-col :span="12" v-for="(item, key) in umasks" :key="key">
            <v-checkbox :label="item.value">{{item.desc}}</v-checkbox>
          </v-col>
        </v-row>
      </v-checkbox-group>
      <v-checkbox-group :value="originForm.bits" v-else>
        <v-row :gutter="16">
          <v-col :span="12" v-for="(item, key) in umasks" :key="key">
            <v-checkbox :label="item.value" disabled>{{item.desc}}</v-checkbox>
          </v-col>
        </v-row>
      </v-checkbox-group>

      <div class="mt-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="mr-2">有效天数: </span>
          <v-input-number size="sm" v-model="form.validDays" maxlength="4" :max="9999" :min="1" :precision="0" class="w-8" v-if="editable"></v-input-number>
          <span class="caption" v-else>{{originForm.validDays || '永久有效'}}</span>
        </div>
      </div>
  </div>
  <div v-else> <no-data></no-data> </div>
  <div :class="[$style.action]">
    <div v-if="!editable">
      <span v-if="authority && !authority.implicit">
        <v-button type="primary" @click="onEdit" size="sm">更改权限</v-button>
        <v-button type="error" @click="onDelete" class="ml-2" size="sm">删除权限</v-button>
      </span>
      <v-button type="primary" @click="onEdit" v-else size="sm">新增权限</v-button>
    </div>
    <span v-else>
      <v-button @click="onCancel" size="sm">取 消</v-button>
      <v-button type="primary" class="ml-2" @click="onSave" size="sm">保 存</v-button>
    </span>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { UMASK, toUmask, toArray, allUmask } from '@/common/umask'
import { queryAuthorities, addAuthority, deleteAuthorities } from '@/api/authority'

@Component
export default class EditAuthority extends Vue {
  @Prop() dept!: any

  @Prop() user!: any

  @Prop() file!: any

  umasks = UMASK

  editable: boolean = false

  authority: any = null

  form: any = {
    validDays: null,
    umask: 0,
    set bits (value: number[]) {
      this.umask = toUmask(value)
    },
    get bits () {
      return toArray(this.umask)
    }
  }

  get isUser () {
    return !!this.user
  }

  get allChecked () {
    let umask = this.editable ? this.form.umask : this.originForm.umask
    return allUmask(umask)
  }

  set allChecked (value: boolean) {
    if (value) this.form.umask = -1
  }

  get noneChecked () {
    let umask = this.editable ? this.form.umask : this.originForm.umask
    return umask === 0
  }

  set noneChecked (value: boolean) {
    if (value) this.form.umask = 0
  }

  get originForm () {
    let umask = (this.authority && this.authority.umask) || 0
    return {
      validDays: (this.authority && this.authority.validDays) || null,
      umask,
      get bits () {
        return toArray(umask)
      }
    }
  }

  get visible () {
    return this.editable || !!this.authority
  }

  get props () {
    return {
      user: this.user,
      dept: this.dept,
      file: this.file
    }
  }

  onEdit () {
    this.editable = true
    this.form.validDays = null
    this.form.umask = (this.authority && this.authority.umask) || 0
  }

  onDelete () {
    let id = this.authority && this.authority.id
    if (!id) return
    deleteAuthorities([id], this.isUser).then(() => {
      this.$message.success('删除成功')
      this.loadData()
    })
  }

  onCancel () {
    this.editable = false
  }

  onSave () {
    this.editable = false
    let req = {
      isUser: this.isUser,
      principleId: this.isUser ? this.user.id : this.dept.id,
      fileId: this.file.id,
      umask: this.form.umask,
      validDays: this.form.validDays
    }
    addAuthority(req).then(() => {
      this.$message.success('修改权限成功')
      this.loadData()
    })
  }

  onUp (row: any) {
    let { principleId, isUser, fileId } = row
    this.$router.push(`/authority?principleId=${principleId}&isUser=${isUser ? 1 : 0}&fileId=${fileId}&t=${Date.now()}`)
  }

  loadData () {
    this.editable = false
    let isUser = !!this.user
    let principleId = !isUser ? (this.dept && this.dept.id) : (this.user && this.user.id)
    if (!principleId) {
      this.authority = null
      return
    }
    let fileId = this.file && this.file.id
    let implicit = true
    queryAuthorities({ isUser, principleId, fileId, implicit }).then(data => {
      this.authority = (data && data[0]) || null
    })
  }

  @Watch('props', { immediate: true }) propsChange () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.container {
  position: relative;
}

.action {
  margin-top: 12px;
}
</style>
