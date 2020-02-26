<template>
<div>
  <v-modal :visible.sync="actualVisible" width="640px" title="筛选字段">
    <v-transfer v-model="value" :data-source="dataSource" filterable style="height: calc(100vh - 360px);"></v-transfer>
    <div slot="footer" class="text-right">
      <v-button @click="onCancel">取消</v-button>
      <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
    </div>
  </v-modal>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { addLibrary, updateLibrary } from '@/api/library'

@Component
export default class ColumnFilter extends Vue {
  dataSource: any[] = []

  value: any[] = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  select (dataSource: any[], value: any[] = []) {
    this.dataSource = dataSource || []
    this.value = value || []
    return this.init()
  }

  init (): Promise<any> {
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
    this.visible = false
    if (this.resolve) this.resolve(this.value)
  }
}
</script>
