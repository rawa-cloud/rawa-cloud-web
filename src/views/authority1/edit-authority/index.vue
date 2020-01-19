<template>
<div :class="[$style.container]">
  <div class="my-2" v-if="visible">
      <div>
        <v-checkbox v-model="allChecked" :disabled="!editable">全部</v-checkbox>
        <v-checkbox v-model="noneChecked" :disabled="!editable">禁用</v-checkbox>

        <span v-if="authority && authority.implicit">
          (继承于 <span>部门/用户</span> <a> {{authority.principleName}} </a>, <span>文件(夹) </span> <a> {{authority.fileName}} </a>)
        </span>
      </div>
      <v-checkbox-group v-model="form.bits" v-if="editable">
        <v-row :gutter="16">
          <v-col :span="4" v-for="(item, key) in umasks" :key="key">
            <v-checkbox :label="item.value">{{item.desc}}</v-checkbox>
          </v-col>
        </v-row>
      </v-checkbox-group>
      <v-checkbox-group :value="originForm.bits" v-else>
        <v-row :gutter="16">
          <v-col :span="4" v-for="(item, key) in umasks" :key="key">
            <v-checkbox :label="item.value" disabled>{{item.desc}}</v-checkbox>
          </v-col>
        </v-row>
      </v-checkbox-group>

      <div class="mt-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="mr-2">有效天数: </span>
          <v-select v-model="form.validDays" class="w-8" v-if="editable">
            <v-option label="永久有效" :value="null"></v-option>
            <v-option label="1天" :value="1"></v-option>
            <v-option label="3天" :value="3"></v-option>
            <v-option label="7天" :value="7"></v-option>
          </v-select>
          <span v-else>{{originForm.validDays || '永久有效'}}</span>
        </div>
      </div>
  </div>
  <div v-else> <no-data></no-data> </div>
  <div :class="[$style.action]">
    <div v-if="!editable">
      <v-button type="primary" @click="onEdit" v-if="authority && !authority.implicit">更改权限</v-button>
      <v-button type="primary" @click="onEdit" v-else>新增权限</v-button>
    </div>
    <span v-else>
      <v-button @click="onCancel">取 消</v-button>
      <v-button type="primary" class="ml-2" @click="onSave">保 存</v-button>
    </span>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Emit, Prop } from 'vue-property-decorator'
import { UMASK, toUmask, toArray, allUmask } from '@/common/umask'
import { queryAuthorities, addAuthority } from '@/api/authority'

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

  onEdit () {
    this.editable = true
    this.form.validDays = null
    this.form.umask = (this.authority && this.authority.umask) || 0
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

  loadData () {
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

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.container {
  position: relative;
}

.action {
  position: absolute;
  bottom: 12px;
  right: 24px;
}
</style>
