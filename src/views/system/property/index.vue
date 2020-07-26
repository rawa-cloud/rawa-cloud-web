<template>
<div class="mx-3">
<v-form>
<section-header>表单配置</section-header>
<v-form-item label="关联文件">
  <v-radio-group v-model="form.form_file_enabled">
    <v-radio label="Y">启用</v-radio>
    <v-radio label="N">禁用</v-radio>
  </v-radio-group>
</v-form-item>

<section-header>图片配置</section-header>
<v-form-item label="下载时选择尺寸">
  <v-radio-group v-model="form.image_download_size_enabled">
    <v-radio label="Y">启用</v-radio>
    <v-radio label="N">禁用</v-radio>
  </v-radio-group>
</v-form-item>

<!-- <section-header class="mt-3">预览配置</section-header>
<v-form-item label="水印">
  <v-radio-group v-model="form.preview_mark_enabled">
    <v-radio label="Y">启用</v-radio>
    <v-radio label="N">禁用</v-radio>
  </v-radio-group>
</v-form-item>
<v-form-item label="显示预览人" v-if="form.preview_mark_enabled === 'Y'">
  <v-radio-group v-model="form.preview_mark_user_enabled">
    <v-radio label="Y">是</v-radio>
    <v-radio label="N">否</v-radio>
  </v-radio-group>
</v-form-item>
<v-form-item label="水印内容" v-if="form.preview_mark_enabled === 'Y'">
  <v-input v-model.lazy="form.preview_mark_content" clearable maxlength="32" style="width: 100%;"></v-input>
</v-form-item> -->

</v-form>
</div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'
import { getLicense, updateLicense } from '@/api/license'
import { http } from '@/api'

@Component
export default class Property extends Vue {
  form = {
    form_file_enabled: 'N',
    image_download_size_enabled: 'N'
    // ,
    // preview_mark_enabled: 'N',
    // preview_mark_user_enabled: 'N',
    // preview_mark_content: ''
  }

  origin: any = {}

  loadData () {
    http().get('/properties').then(data => {
      const origin: any = {}
      ;(data || []).forEach((v: any) => {
        origin[normalize(v.name)] = v.value || ''
      })
      this.origin = JSON.parse(JSON.stringify(origin))
      Object.assign(this.form, origin)
    })

    function normalize (key: string = '') {
      return key.replace(/\./g, '_')
    }
  }

  mounted () {
    this.loadData()
  }

  @Watch('form', { deep: true }) formChange (newVal: any) {
    const all: any[] = []
    Object.entries(newVal).forEach(([k, v]) => {
      if (this.origin[k] !== v) {
        const req = {
          name: normalize(k),
          value: v
        }
        all.push(http().post('/properties', req))
      }
    })
    if (all.length < 1) return
    Promise.all(all).then(() => {
      this.$message.success('更新参数成功')
      this.loadData()
    })

    function normalize (key: any) {
      return key.replace(/_/g, '.')
    }
  }
}
</script>

<style lang="scss" module>
.text {
  line-height: 32px;
}
</style>
