<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" title="输入图片尺寸" :maskClosable="false" :keyboard="false">
        <v-form ref="form" :model="form" label-width="80px" label-position="left">
          <v-form-item label="图片高度" prop="height">
            <v-input-number clearable v-model="form.height" :min="1"></v-input-number>
          </v-form-item>
          <v-form-item label="图片宽度" prop="width">
            <v-input-number clearable v-model="form.width" :min="1"></v-input-number>
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

@Component
export default class ImgSizeChooser extends Vue {
  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  form = {
    width: null,
    height: null
  }

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  choose () {
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      width: null,
      height: null
    }
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  onCancel () {
    this.visible = false
    if (this.reject) this.reject()
  }

  onConfirm () {
    const $e = this.$refs.form as any
    this.visible = false
    if (this.resolve) this.resolve(this.form)
  }
}
</script>
