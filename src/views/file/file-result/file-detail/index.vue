<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="30vw" :title="title">
        <div>
          <ul :class="[$style.list]">
            <li v-for="row in rows" :key="row.key" :class="[$style.item]">
              <span :class="[$style.title]">{{row.title}} : </span>
              <span :class="[$style.text]">{{resolveText(row)}}</span>
            </li>
          </ul>
        </div>

        <div slot="footer" class="text-right">
          <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import size from '@/filters/size'

@Component
export default class EditDir extends Vue {
  file: any = null

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get dir () {
    return this.file && this.file.dir
  }

  get title () {
    return this.dir ? '文件夹详情' : '文件详情'
  }

  get rows () {
    let ret: any[] = [
      { key: 'name', title: '名称' }
    ]
    let extra: any[] = []
    if (this.dir) {
      extra = [
        { key: 'limitSize', title: '容量', formatter: (row: any) => row.limitSize || '不限' },
        { key: 'limitSuffix', title: '文件类型', formatter: (row: any) => row.limitSuffix || '不限' }
      ]
    } else {
      extra = [
        { key: 'size', title: '大小', formatter: (row: any) => size(row.size) }
      ]
    }
    ret.push(...extra)
    return ret
  }

  resolveText (row: any) {
    if (!this.file) return ''
    if (row.formatter) return row.formatter(this.file)
    return this.file[row.key]
  }

  view (file: any) {
    this.file = file || null
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
    const $e = this.$refs.form as any
    this.visible = false
    if (this.resolve) this.resolve(null)
  }
}
</script>

<style lang="scss" module>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  line-height: 32px;
}

.title {
  margin-right: 12px;
}
</style>
