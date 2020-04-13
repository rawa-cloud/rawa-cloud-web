<template>
<div>
  <section-header>系统授权</section-header>

  <div class="my-3 mx-4">
    <v-form>
      <v-row :gutter="16">
        <v-col :span="12">
          <v-form-item label="版本"><span :class="[$style.text]">{{version}}</span></v-form-item>
        </v-col>
        <v-col :span="12">
          <v-form-item label="绑定mac地址"><span :class="[$style.text]">{{dataSource.mac}}</span></v-form-item>
        </v-col>
        <v-col :span="12">
          <v-form-item label="有效期"><span :class="[$style.text]">{{dataSource.expiredDate || '永久'}}</span></v-form-item>
        </v-col>
        <v-col :span="12">
          <v-form-item label="限定用户数"><span :class="[$style.text]">{{dataSource.limitUser || '无限制'}}</span></v-form-item>
        </v-col>
      </v-row>
    </v-form>

    <v-form>
      <v-row :gutter="16">
        <v-col :span="12">
          <v-form-item label="序列号">
            <v-input style="width: 100%;" v-model.trim="value"></v-input>
          </v-form-item>
        </v-col>
        <v-col :span="12">
          <v-form-item>
            <v-button type="primary" @click="onUpdate" :disabled="disabled">更新序列号</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { getLicense, updateLicense } from '@/api/license'

@Component
export default class Auth extends Vue {
  dataSource: any = {}

  value = ''

  loadData () {
    getLicense().then(data => {
      this.dataSource = data || {}
      this.value = this.dataSource.text || ''
    })
  }

  get version () {
    if (this.dataSource.free) return '无限制版'
    if (!this.dataSource.duration) return '永久授权版'
    return `免费试用版(${this.dataSource.duration}天)`
  }

  get disabled () {
    return !this.value || this.value === this.dataSource.text
  }

  onUpdate () {
    updateLicense(this.value).then(() => {
      this.$message.success('更新序列号成功')
      this.loadData()
    })
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.text {
  line-height: 32px;
}
</style>
